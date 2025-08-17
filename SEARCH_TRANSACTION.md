# Search Transaction by Invoice

Fitur pencarian transaksi berdasarkan nomor invoice telah berhasil ditambahkan ke aplikasi.

## Fitur yang Ditambahkan

### 1. Backend API Integration

-  **POST** `https://techexs.it.com/api/transaction/search-by-invoice`
-  Menerima request dengan body JSON yang berisi `invoice`
-  Mengembalikan data transaksi lengkap sesuai format yang diminta
-  Frontend langsung memanggil backend tanpa proxy

### 2. Halaman UI

-  **URL**: `/search-transaction`
-  Interface yang user-friendly untuk mencari transaksi
-  Menampilkan detail transaksi dengan layout yang rapi
-  Responsive design untuk desktop dan mobile

### 3. Service Layer

-  **File**: `src/services/transactionService.ts`
-  Berisi fungsi-fungsi utility untuk operasi transaksi
-  Formatting currency dan date
-  Helper functions untuk status dan styling

### 4. Navigation

-  Link "Cari Transaksi" ditambahkan di header
-  Mudah diakses dari semua halaman

## Cara Penggunaan

### 1. Melalui UI

1. Klik tombol "Cari Transaksi" di header
2. Masukkan nomor invoice (contoh: `WEB1755145013763032DSP`)
3. Klik tombol "Cari" atau tekan Enter
4. Hasil pencarian akan ditampilkan di bawah form

### 2. Melalui Backend API

```bash
curl -X POST https://techexs.it.com/api/transaction/search-by-invoice \
  -H "Content-Type: application/json" \
  -d '{"invoice": "WEB1755145013763032DSP"}'
```

## Response Format

### Success Response

```json
{
   "success": true,
   "data": {
      "invoice": "WEB1755145013763032DSP",
      "status": true,
      "status_text": "Lunas",
      "total_paid": 50000,
      "method": "DANA",
      "pay_time": "2025-08-14T15:30:00.000000Z",
      "created_at": "2025-08-14T15:00:00.000000Z",
      "buyer_name": "John Doe",
      "phone_number": "081234567890",
      "product": {
         "name": "Netflix Premium",
         "price": 50000,
         "description": "Netflix Premium 1 Bulan",
         "is_manual_order": true
      },
      "account": {
         "account": "user@example.com",
         "password": "password123"
      }
   }
}
```

### Error Response

```json
{
   "success": false,
   "error": "Transaction not found"
}
```

## Status Transaksi

-  **Lunas** (status: true) - Pembayaran berhasil, akun tersedia
-  **Gagal** (status: false) - Pembayaran gagal
-  **Menunggu** (status: null) - Menunggu pembayaran

## Informasi yang Ditampilkan

1. **Invoice & Status** - Nomor invoice dan status pembayaran
2. **Payment Details** - Total bayar, metode pembayaran, waktu pembayaran
3. **Customer Info** - Nama pembeli dan nomor telepon
4. **Product Info** - Detail produk yang dibeli
5. **Account Info** - Informasi akun (hanya jika status = Lunas)
6. **Timestamps** - Waktu pembuatan transaksi

## File yang Dibuat/Dimodifikasi

### File Baru

-  `src/app/search-transaction/page.tsx` - Halaman UI
-  `src/services/transactionService.ts` - Service layer (langsung ke backend)
-  `SEARCH_TRANSACTION.md` - Dokumentasi ini

### File Dimodifikasi

-  `src/components/Header.tsx` - Menambahkan link navigasi

## Backend Integration

Frontend langsung memanggil backend `https://techexs.it.com` tanpa proxy atau API route tambahan. Semua request search dan detail invoice menggunakan backend langsung.

## Testing

Untuk testing fitur ini, Anda dapat:

1. Menggunakan invoice yang sudah ada di database
2. Mencoba dengan invoice yang tidak ada untuk test error handling
3. Test responsive design di berbagai ukuran layar

## Error Handling

Fitur ini menangani berbagai error scenario:

-  Invoice tidak ditemukan
-  Network error
-  Server error
-  Invalid input
-  Missing environment variables
