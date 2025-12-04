# R2 Storage Setup Guide

## Apa itu Cloudflare R2?

Cloudflare R2 adalah object storage yang kompatibel dengan S3 API, memberikan penyimpanan tanpa biaya egress.

## Langkah-Langkah Setup

### 1. Buat R2 Bucket di Cloudflare

1. Login ke [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Pilih akun Anda
3. Navigate ke **R2** di sidebar
4. Klik **Create Bucket**
5. Masukkan nama bucket (contoh: `veritas-images`)
6. Pilih lokasi/region yang sesuai
7. Klik **Create Bucket**

### 2. Setup Public Access (Opsional)

Untuk membuat images dapat diakses secara publik:

1. Buka bucket yang baru dibuat
2. Pergi ke **Settings**
3. Scroll ke **Public Access**
4. Klik **Allow Access** dan ikuti instruksi untuk mengkonfigurasi custom domain atau gunakan R2.dev subdomain
5. Salin URL publik yang diberikan

### 3. Generate API Tokens

1. Dari halaman R2, klik **Manage R2 API Tokens**
2. Klik **Create API Token**
3. Pilih permissions:
   - **Object Read & Write** untuk bucket Anda
4. Pilih **TTL** (Time To Live) atau set ke unlimited
5. Klik **Create API Token**
6. **PENTING**: Simpan `Access Key ID` dan `Secret Access Key` - ini hanya ditampilkan sekali!

### 4. Konfigurasi Environment Variables

Tambahkan variabel berikut ke file `.env` Anda:

```env
# R2 Storage Configuration
R2_ENDPOINT=https://<ACCOUNT_ID>.r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=<your_access_key_id>
R2_SECRET_ACCESS_KEY=<your_secret_access_key>
R2_BUCKET=<your_bucket_name>
R2_PUBLIC_URL=https://<your_public_url>
R2_REGION=auto
```

**Penjelasan:**
- `R2_ENDPOINT`: Endpoint R2 Anda (ganti `<ACCOUNT_ID>` dengan Account ID Cloudflare Anda)
- `R2_ACCESS_KEY_ID`: Access Key ID dari API token yang dibuat
- `R2_SECRET_ACCESS_KEY`: Secret Access Key dari API token yang dibuat
- `R2_BUCKET`: Nama bucket yang Anda buat
- `R2_PUBLIC_URL`: URL publik untuk mengakses file (dari custom domain atau R2.dev)
- `R2_REGION`: Region, biasanya "auto" untuk R2

### 5. Cara Mendapatkan Account ID

1. Dari Cloudflare Dashboard
2. Pergi ke R2 atau bagian lain dari dashboard
3. Account ID biasanya terlihat di URL atau di sidebar kanan
4. Atau bisa ditemukan di **Manage Account** > **Account Details**

### 6. Testing

Setelah konfigurasi selesai, restart aplikasi Anda:

```bash
npm run dev
```

Coba upload gambar melalui API event creation/update untuk memastikan R2 berfungsi dengan baik.

## Struktur File di R2

File akan disimpan dengan struktur:
```
events/
  ├── 1234567890-abc123def456.jpg
  ├── 1234567891-def789ghi012.png
  └── ...
```

## Troubleshooting

### Error: "Failed to upload image to R2"
- Pastikan API credentials benar
- Pastikan endpoint URL benar dengan Account ID yang tepat
- Pastikan bucket name sesuai

### Error: "Access Denied"
- Pastikan API token memiliki permission yang cukup (Read & Write)
- Pastikan bucket name benar

### Images tidak bisa diakses secara publik
- Pastikan Public Access sudah diaktifkan di bucket settings
- Pastikan R2_PUBLIC_URL sudah dikonfigurasi dengan benar

## Keuntungan R2 vs Cloudinary

1. **No Egress Fees**: R2 tidak mengenakan biaya untuk bandwidth keluar
2. **S3 Compatible**: Menggunakan API standar S3
3. **Predictable Pricing**: Hanya bayar untuk storage dan operasi
4. **Global CDN**: Otomatis didistribusikan melalui Cloudflare CDN

## Security Best Practices

1. **Jangan commit** file `.env` ke repository
2. Gunakan **API tokens** dengan permissions minimal yang dibutuhkan
3. Set **TTL** pada API tokens untuk keamanan ekstra
4. Rotate API credentials secara berkala
5. Gunakan **CORS policy** yang tepat jika diperlukan

## Resources

- [R2 Documentation](https://developers.cloudflare.com/r2/)
- [R2 Pricing](https://www.cloudflare.com/products/r2/)
- [AWS S3 SDK Documentation](https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-s3/)






