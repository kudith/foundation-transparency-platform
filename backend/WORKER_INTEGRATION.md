# Worker Integration Guide

## Overview

Sistem ini menggunakan worker-based image processing dengan Redis queue. Backend upload raw images ke R2, membuat job record, dan push ke Redis queue. Worker akan mengambil job, memproses image, dan update status via callback.

## Alur Kerja (Workflow)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│ Client  │────▶│ Backend │────▶│  Redis  │────▶│ Worker  │
└─────────┘     └────┬────┘     └─────────┘     └────┬────┘
                     │                                 │
                     │         ┌─────────┐            │
                     │◀────────│   R2    │◀───────────┘
                     │         └─────────┘
                     │
                     ▼
                ┌─────────┐
                │ MongoDB │
                └─────────┘
```

## Detail Alur

### 1. Upload & Create Job (Backend)

Ketika user upload image melalui event creation/update:

```javascript
// Backend: services/event.js
const imageJob = await createImageJob(
  {
    entityType: "event",
    entityId: eventId,
  },
  file.buffer,
  file.mimetype,
  file.originalname
);
```

Ini akan:

1. Upload raw image ke R2 folder `/raw`
2. Create record di collection `image_jobs`
3. Push job ke Redis queue

### 2. Redis Queue Format

Job dipush ke Redis list `task_queue` dengan format:

```json
{
  "task_type": "process_image",
  "payload": {
    "imageJobID": "655501d2f12a3d0f3c5a1002"
  }
}
```

Command untuk push manual (testing):

```bash
redis-cli LPUSH task_queue '{"task_type":"process_image","payload":{"imageJobID":"655501d2f12a3d0f3c5a1002"}}'
```

### 3. Worker Processing

Worker harus:

1. **Pop job dari Redis:**

   ```bash
   BRPOP task_queue 0
   ```

2. **Get image job data:**

   ```bash
   GET /api/image-jobs/:id
   ```

   Response:

   ```json
   {
     "success": true,
     "data": {
       "_id": "655501d2f12a3d0f3c5a1002",
       "entityType": "event",
       "entityId": "655501d2f12a3d0f3c5a1001",
       "sourceImageURL": "https://pub-xxx.r2.dev/raw/1234567890-abc123def456.jpg",
       "sourceImageKey": "raw/1234567890-abc123def456.jpg",
       "status": "PENDING",
       "errorMsg": "",
       "originalFilename": "photo.jpg",
       "mimetype": "image/jpeg",
       "fileSize": 1234567,
       "createdAt": "2024-01-01T00:00:00.000Z",
       "updatedAt": "2024-01-01T00:00:00.000Z"
     }
   }
   ```

3. **Update status ke "PROCESSING":**

   ```bash
   PATCH /api/image-jobs/:id/status
   Content-Type: application/json

   {
     "status": "PROCESSING"
   }
   ```

4. **Download image dari sourceImageURL**

5. **Process image** (compress, resize, optimize, dll)

6. **Upload processed image ke R2** (folder `/optimized` sesuai worker)

7. **Update status ke "COMPLETED":**

   ```bash
   PATCH /api/image-jobs/:id/status
   Content-Type: application/json

   {
     "status": "COMPLETED",
     "outputImageURL": "https://pub-xxx.r2.dev/optimized/1234567890-abc123def456-optimized.webp",
     "outputImageKey": "optimized/1234567890-abc123def456-optimized.webp"
   }
   ```

8. **Jika error, update status ke "FAILED":**

   ```bash
   PATCH /api/image-jobs/:id/status
   Content-Type: application/json

   {
     "status": "FAILED",
     "errorMsg": "Failed to process image: invalid format"
   }
   ```

### 4. Frontend Display

Ketika frontend fetch event, backend akan populate images dari `image_jobs`:

```javascript
// Backend: services/event.js
const imageJobs = await getImageJobsByIds(event.imageJobIds);
eventObj.images = imageJobs
  .filter((job) => job.status === "completed")
  .map((job) => ({
    id: job._id,
    url: job.outputImageURL, // URL hasil processing
    status: job.status,
  }));
```

Frontend hanya akan melihat images yang statusnya `completed`.

## Image Job Model

```javascript
{
  _id: ObjectID,            // MongoDB ObjectID (auto-generated)
  entityType: String,       // "event", "report", "other"
  entityId: String,         // ID dari entity (event ID, report ID, dll)
  sourceImageURL: String,   // URL raw image di R2 /raw
  sourceImageKey: String,   // Key di R2 /raw
  outputImageURL: String,   // URL processed image (set by worker)
  outputImageKey: String,   // Key processed image (set by worker)
  status: String,           // "PENDING", "PROCESSING", "COMPLETED", "FAILED" (UPPERCASE)
  errorMsg: String,         // Error message jika failed (default: "")
  originalFilename: String, // Original filename
  mimetype: String,         // MIME type
  fileSize: Number,         // Size in bytes
  createdAt: Date,
  updatedAt: Date,
  processedAt: Date         // Timestamp when completed/failed
}
```

**IMPORTANT**:

- `_id` adalah MongoDB ObjectID (bukan String)
- `status` harus UPPERCASE untuk kompatibilitas dengan worker Go
- Worker menggunakan folder `/optimized` untuk output images

## API Endpoints

### For Backend/Admin

- `GET /api/image-jobs/:id` - Get single image job
- `GET /api/image-jobs?entityType=event&entityId=xxx` - Get jobs by entity
- `POST /api/image-jobs/:id/retry` - Retry failed job (push ke queue lagi)
- `DELETE /api/image-jobs/:id` - Delete job and images from R2

### For Worker

- `PATCH /api/image-jobs/:id/status` - Update job status (no auth required)
  - **Note:** Dalam production, sebaiknya gunakan secret token atau IP whitelist

## Environment Variables

Backend membutuhkan:

```env
# Redis
REDIS_URI=redis://localhost:6379

# R2 Storage
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET=your_bucket_name
R2_PUBLIC_URL=https://pub-xxx.r2.dev
R2_REGION=auto
```

## Testing

### 1. Test Upload Image

```bash
# Create event dengan image
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Event" \
  -F "community=Test Community" \
  -F "date=2024-01-01" \
  -F "tutor[type]=Internal" \
  -F "tutor[name]=John Doe" \
  -F "images=@/path/to/image.jpg"
```

Ini akan:

1. Create event
2. Upload image ke R2 /raw
3. Create image job
4. Push job ke Redis

### 2. Check Redis Queue

```bash
redis-cli LLEN task_queue
# Output: 1

redis-cli LRANGE task_queue 0 -1
# Output: ["{"task_type":"process_image","payload":{"imageJobID":"..."}}"]
```

### 3. Check Image Job Status

```bash
curl http://localhost:3000/api/image-jobs/IMAGE_JOB_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Manual Worker Simulation

```bash
# 1. Pop job from Redis
redis-cli BRPOP task_queue 0

# 2. Update to PROCESSING
curl -X PATCH http://localhost:3000/api/image-jobs/IMAGE_JOB_ID/status \
  -H "Content-Type: application/json" \
  -d '{"status":"PROCESSING"}'

# 3. Update to COMPLETED (simulate worker done)
curl -X PATCH http://localhost:3000/api/image-jobs/IMAGE_JOB_ID/status \
  -H "Content-Type: application/json" \
  -d '{
    "status":"COMPLETED",
    "outputImageURL":"https://pub-xxx.r2.dev/optimized/test-optimized.webp",
    "outputImageKey":"optimized/test-optimized.webp"
  }'
```

### 5. Check Event with Images

```bash
curl http://localhost:3000/api/events/EVENT_ID
```

Response akan include images dari completed jobs:

```json
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "Test Event",
    "images": [
      {
        "id": "IMAGE_JOB_ID",
        "url": "https://pub-xxx.r2.dev/optimized/test-optimized.webp",
        "status": "COMPLETED"
      }
    ]
  }
}
```

## Error Handling

### Retry Failed Jobs

Jika job failed, bisa di-retry via API:

```bash
POST /api/image-jobs/:id/retry
```

Ini akan:

1. Reset status ke "PENDING"
2. Clear error message
3. Push job ke queue lagi

### Delete Failed Jobs

Untuk delete job yang failed permanently:

```bash
DELETE /api/image-jobs/:id
```

Ini akan:

1. Delete source image dari R2
2. Delete output image dari R2 (jika ada)
3. Delete record dari database

## R2 Folder Structure

```
your-bucket/
├── raw/
│   ├── 1234567890-abc123def456.jpg           (uploaded by backend)
│   ├── 1234567891-def789ghi012.png
│   └── ...
└── optimized/
    ├── 1234567890-abc123def456-optimized.webp  (uploaded by worker)
    ├── 1234567891-def789ghi012-optimized.webp
    └── ...
```

**Note**: Worker menggunakan folder `optimized` dan convert images ke WebP format.

## Security Considerations

1. **Worker Callback Endpoint** (`PATCH /api/image-jobs/:id/status`):

   - Saat ini tidak ada authentication
   - Untuk production, tambahkan:
     - Secret token di header
     - IP whitelist
     - Rate limiting

2. **R2 Access**:

   - Backend: Read & Write ke /raw
   - Worker: Read dari /raw, Write ke /optimized
   - Public: Read-only dari /optimized via public URL

3. **Redis Queue**:
   - Pastikan Redis tidak exposed ke public
   - Gunakan password jika perlu
   - Monitor queue length untuk prevent overflow

## Monitoring

Monitor hal-hal berikut:

1. **Queue Length**:

   ```bash
   redis-cli LLEN task_queue
   ```

   Jika terlalu banyak, worker mungkin down atau lambat

2. **Pending Jobs**:

   ```javascript
   db.image_jobs.countDocuments({ status: "PENDING" });
   ```

3. **Failed Jobs**:

   ```javascript
   db.image_jobs.countDocuments({ status: "FAILED" });
   ```

4. **Processing Duration**:
   Monitor `processedAt - createdAt` untuk completed jobs

## Integration dengan Community-Report-Worker

Worker Go yang sudah ada di `/home/adty/Documents/project/college/cc/Community-Report-Worker` bisa di-extend untuk handle image processing:

1. Tambahkan handler untuk `task_type: "process_image"`
2. Implement image processing logic
3. Update job status via callback ke backend

Contoh struktur:

```go
func processImageJob(payload map[string]interface{}) error {
    imageJobID := payload["imageJobID"].(string)

    // 1. Get job data from backend
    jobData := getImageJobFromBackend(imageJobID)

    // 2. Update status to processing
    updateJobStatus(imageJobID, "processing", nil)

    // 3. Download source image
    imageData := downloadFromR2(jobData.SourceImageURL)

    // 4. Process image (compress, resize, etc)
    processedImage := processImage(imageData)

    // 5. Upload to R2 /processed
    outputURL, outputKey := uploadToR2(processedImage, "processed")

    // 6. Update status to completed
    updateJobStatus(imageJobID, "completed", map[string]string{
        "outputImageURL": outputURL,
        "outputImageKey": outputKey,
    })

    return nil
}
```
