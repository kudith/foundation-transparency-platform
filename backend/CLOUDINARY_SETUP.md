# Cloudinary Setup Guide

## Overview

This application uses Cloudinary for image storage and management. Images for events are automatically uploaded to Cloudinary when creating or updating events.

## Setup Instructions

### 1. Create Cloudinary Account

1. Go to [https://cloudinary.com](https://cloudinary.com)
2. Sign up for a free account
3. Verify your email

### 2. Get API Credentials

1. Login to your Cloudinary dashboard
2. Go to Dashboard → Account Details
3. Copy the following credentials:
   - Cloud Name
   - API Key
   - API Secret

### 3. Configure Environment Variables

Add the following to your `.env` file:

```env
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

## Features

### Image Upload

- **Maximum files**: 5 images per event
- **File size limit**: 5MB per image
- **Accepted formats**: All image types (jpg, png, gif, webp, etc.)
- **Auto optimization**: Images are automatically optimized for web
- **Auto resize**: Max dimensions 1200x800px (maintains aspect ratio)

### Image Storage

Images are stored in Cloudinary with the following structure:

```
veritas/
  └── events/
      ├── image1.jpg
      ├── image2.png
      └── ...
```

### Image Management

- **Create Event**: Upload multiple images (max 5)
- **Update Event**: Add more images to existing event
- **Delete Image**: Remove specific image from event
- **Delete Event**: Automatically removes all associated images from Cloudinary

## API Endpoints

### Upload Images (Create Event)

```http
POST /api/events
Content-Type: multipart/form-data

Fields:
- name: string (required)
- community: string (required)
- date: ISO date (required)
- tutor: JSON string (required)
- description: string (optional)
- location: string (optional)
- images: File[] (optional, max 5)
```

### Add Images (Update Event)

```http
PUT /api/events/:id
Content-Type: multipart/form-data

Fields: (all optional)
- name: string
- community: string
- date: ISO date
- tutor: JSON string
- description: string
- location: string
- images: File[] (max 5)
```

### Delete Specific Image

```http
DELETE /api/events/:id/images/:publicId
```

### Delete Event (with all images)

```http
DELETE /api/events/:id
```

## Response Format

Event with images:

```json
{
  "success": true,
  "data": {
    "_id": "event-id",
    "name": "Event Name",
    "community": "Community Name",
    "date": "2025-12-20T09:00:00.000Z",
    "tutor": {
      "type": "External",
      "name": "Tutor Name"
    },
    "description": "Event description",
    "location": "Event location",
    "images": [
      {
        "url": "https://res.cloudinary.com/...",
        "publicId": "veritas/events/abc123",
        "width": 1200,
        "height": 800
      }
    ],
    "createdAt": "2025-11-17T11:58:35.204Z",
    "updatedAt": "2025-11-17T11:58:35.204Z"
  }
}
```

## Testing

### Using cURL

**Create event with images:**

```bash
curl -X POST http://localhost:3000/api/events \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "name=Test Event" \
  -F "community=Test Community" \
  -F "date=2025-12-31" \
  -F 'tutor={"type":"External","name":"John Doe"}' \
  -F "description=Test Description" \
  -F "location=Jakarta" \
  -F "images=@/path/to/image1.jpg" \
  -F "images=@/path/to/image2.jpg"
```

### Using Postman

1. Set method to `POST`
2. URL: `http://localhost:3000/api/events`
3. Headers: `Authorization: Bearer YOUR_TOKEN`
4. Body → form-data:
   - Add text fields: name, community, date, tutor (as JSON string)
   - Add file fields: images (can select multiple files)

## Troubleshooting

### Error: "Failed to upload image to Cloudinary"

- Check your API credentials in `.env`
- Verify Cloudinary account is active
- Check internet connection

### Error: "Only image files are allowed"

- Make sure you're uploading image files only
- Accepted formats: jpg, jpeg, png, gif, webp, etc.

### Error: "File size limit exceeded"

- Each image must be under 5MB
- Compress images before uploading

## Free Tier Limits

Cloudinary free tier includes:

- ✅ 25 GB storage
- ✅ 25 GB bandwidth per month
- ✅ Unlimited transformations

This should be more than enough for most applications.

## Security Notes

1. ⚠️ Never commit `.env` file to git
2. ✅ API routes are protected with authentication
3. ✅ File type validation (images only)
4. ✅ File size limit (5MB max)
5. ✅ Automatic cleanup when deleting events

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Node.js SDK](https://cloudinary.com/documentation/node_integration)
- [Image Transformations](https://cloudinary.com/documentation/image_transformations)
