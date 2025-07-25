# Panduan Deployment Nuxt.js ke cPanel

## Persiapan Sebelum Deploy

### 1. Persiapan Backend Laravel
Pastikan backend Laravel sudah di-deploy di `public_html/backend` dengan:
- Database sudah dikonfigurasi
- API endpoints berfungsi dengan baik di `https://yourdomain.com/backend/api`
- CORS sudah dikonfigurasi untuk domain frontend
- File `.htaccess` sudah dikonfigurasi dengan benar

### 2. Persiapan Environment Variables
Buat file `.env` di **root folder Nuxt.js** (sejajar dengan `package.json` dan `nuxt.config.ts`) dengan:
```env
NUXT_PUBLIC_API_BASE_URL=https://yourdomain.com/backend/api
NODE_ENV=production
PORT=3000
```

**Lokasi file .env:**
```
frontend/                 # Root project Nuxt.js
├── .env                 # File environment variables (buat file ini)
├── package.json
├── nuxt.config.ts
├── .output/
└── ...
```

## Langkah-langkah Deployment

### Step 1: Build Aplikasi
```bash
# Install dependencies
npm install

# Build untuk production
npm run build
```

### Step 2: Upload ke cPanel

**Upload SELURUH folder project** (bukan hanya hasil build), karena cPanel perlu:
- Source code untuk Node.js App
- `package.json` untuk install dependencies
- File konfigurasi (`nuxt.config.ts`, `ecosystem.config.js`)
- Hasil build di folder `.output/`

**Catatan penting tentang folder build:**
- **`.output/`** - Hasil build production (WAJIB di-upload)
- **`.nuxt/`** - Cache development (TIDAK perlu di-upload, bisa di-exclude)
- Folder `.nuxt/` akan dibuat otomatis saat development, tapi untuk production hanya butuh `.output/`

**Langkah upload:**
1. Compress **seluruh folder project** menjadi ZIP (termasuk `.output/` hasil build)
2. Upload ZIP ke cPanel File Manager
3. Extract di folder yang diinginkan (misal: `/public_html/frontend`)

**Folder yang harus ada setelah extract:**
```
public_html/frontend/
├── .output/              # Hasil build (wajib ada)
├── package.json          # Dependencies info
├── nuxt.config.ts        # Konfigurasi Nuxt
├── ecosystem.config.js   # PM2 config
├── .env                  # Environment variables
├── pages/                # Source code
├── components/           # Source code
└── ...
```

### Step 3: Setup Node.js App di cPanel
1. Masuk ke cPanel → **Node.js App**
2. Klik **Create Application**
3. Isi konfigurasi:
   - **Node.js Version**: 18.x atau 20.x
   - **Application Mode**: Production
   - **Application Root**: `/public_html/nuxt-app` (sesuaikan path)
   - **Application URL**: subdomain atau path yang diinginkan
   - **Application Startup File**: `.output/server/index.mjs`

### Step 4: Install Dependencies
1. Setelah aplikasi dibuat, klik **Open Terminal**
2. Jalankan:
```bash
npm install --production
```

### Step 5: Environment Variables
Di halaman Node.js App, tambahkan environment variables:
- `NUXT_PUBLIC_API_BASE_URL`: `https://yourdomain.com/backend/api`
- `NODE_ENV`: `production`
- `PORT`: `3000` (atau port yang diberikan cPanel)

### Step 6: Start Aplikasi
1. Klik **Restart** pada aplikasi Node.js
2. Aplikasi akan berjalan di URL yang sudah dikonfigurasi

## Konfigurasi Domain/Subdomain

### Struktur Deployment yang Disarankan:
```
public_html/
├── backend/          # Laravel backend
│   ├── public/       # Laravel public folder
│   └── ...
└── frontend/         # Nuxt.js app (atau gunakan subdomain)
    ├── .output/
    └── ...
```

### Untuk Subdomain (Disarankan):
1. Buat subdomain di cPanel (misal: `app.yourdomain.com`)
2. Arahkan ke folder aplikasi Nuxt.js
3. Update Application URL di Node.js App
4. Backend tetap di `https://yourdomain.com/backend/api`

### Untuk Path di Domain Utama:
1. Deploy Nuxt.js di `public_html/frontend`
2. Akses via `https://yourdomain.com/frontend`
3. Konfigurasi di Node.js App sesuai path

## Konfigurasi Backend Laravel

### File .htaccess untuk Laravel (public_html/backend/.htaccess):
```apache
<IfModule mod_rewrite.c>
    <IfModule mod_negotiation.c>
        Options -MultiViews -Indexes
    </IfModule>

    RewriteEngine On

    # Handle Authorization Header
    RewriteCond %{HTTP:Authorization} .
    RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]

    # Redirect Trailing Slashes If Not A Folder...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} (.+)/$
    RewriteRule ^ %1 [L,R=301]

    # Send Requests To Front Controller...
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteRule ^ index.php [L]
</IfModule>
```

### CORS Configuration di Laravel:
Pastikan file `config/cors.php` dikonfigurasi dengan benar:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_methods' => ['*'],
'allowed_origins' => [
    'https://yourdomain.com',
    'https://app.yourdomain.com', // jika menggunakan subdomain
],
'allowed_origins_patterns' => [],
'allowed_headers' => ['*'],
'exposed_headers' => [],
'max_age' => 0,
'supports_credentials' => true,
```

### API Routes Testing:
Test endpoint backend dengan:
```bash
curl -X GET https://yourdomain.com/backend/api/test
```

## Troubleshooting

### Error: Module not found
- Pastikan semua dependencies sudah terinstall
- Jalankan `npm install` di terminal cPanel

### Error: Port already in use
- Gunakan port yang diberikan oleh cPanel
- Update environment variable `PORT`

### Error: API connection failed
- Periksa URL backend di environment variable
- Pastikan CORS dikonfigurasi dengan benar di Laravel

### Error: Static files not loading
- Periksa path static files di konfigurasi
- Pastikan folder `public` dapat diakses

## Update Aplikasi

1. Build ulang aplikasi lokal:
```bash
npm run build
```

2. Upload file yang berubah ke cPanel
3. Restart aplikasi di Node.js App

## Monitoring

- Gunakan **Error Logs** di Node.js App untuk debugging
- Monitor penggunaan resource di cPanel
- Setup backup berkala untuk aplikasi

## Tips Optimasi

1. **Compression**: Aktifkan gzip compression di cPanel
2. **Caching**: Konfigurasi browser caching untuk static assets
3. **CDN**: Pertimbangkan menggunakan CDN untuk static files
4. **Database**: Optimasi query di backend Laravel

## Struktur File Setelah Build

```
/public_html/nuxt-app/
├── .output/
│   ├── server/
│   │   └── index.mjs (startup file)
│   └── public/
├── node_modules/
├── package.json
├── ecosystem.config.js
└── .env
```

## Catatan Penting

- Pastikan Node.js version di cPanel kompatibel dengan aplikasi
- Backup database dan files sebelum deployment
- Test semua fitur setelah deployment
- Monitor logs untuk error yang mungkin terjadi