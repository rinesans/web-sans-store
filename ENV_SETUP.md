# Environment Variables Setup

## TokoPay Configuration

Buat file `.env.local` di root directory project dan tambahkan konfigurasi berikut:

```env
# TokoPay Configuration
# Dapatkan nilai ini dari TokoPay Dashboard Anda
TOKOPAY_MERCHANT_ID=your_merchant_id_here
TOKOPAY_SECRET_KEY=your_secret_key_here

# API Configuration
# JWT Token untuk akses API server
JWT_TOKEN=your_jwt_token_here
```

### Contoh Format:

```env
TOKOPAY_MERCHANT_ID=M20230422TEST26949756
TOKOPAY_SECRET_KEY=2f0683f4a9fed9958f218f1490204764c68a79xxxxxxx5a88539559dea74ce
JWT_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Cara Mendapatkan Credentials:

1. **Login ke TokoPay Dashboard**
2. **Pergi ke menu "API" atau "Settings"**
3. **Copy Merchant ID dan Secret Key**
4. **Paste ke file `.env.local`**

### Verifikasi Setup:

Setelah setup, restart development server:

```bash
npm run dev
```

Cek di console apakah ada error "Missing TokoPay credentials". Jika tidak ada error, berarti setup sudah benar.

### Troubleshooting:

-  **Error "Missing TokoPay credentials"**: Pastikan file `.env.local` ada di root directory
-  **Error "Invalid response from payment gateway"**: Cek apakah Merchant ID dan Secret Key sudah benar
-  **Error "Failed to create payment order"**: Pastikan credentials valid dan akun TokoPay aktif
