# 🚀 Setup Guide - TokoPay Payment Integration

Panduan lengkap untuk setup dan menjalankan aplikasi dengan integrasi payment gateway TokoPay QRIS.

## 📋 **Prerequisites**

-  Node.js v16+ dan npm
-  Akun TokoPay Merchant (daftar di [tokopay.id](https://tokopay.id))
-  Git

## ⚙️ **Installation & Setup**

### 1. **Clone & Install Dependencies**

```bash
git clone <repository-url>
cd prem-app
npm install
```

### 2. **Environment Configuration**

Buat file `.env.local` di root project:

```env
# API Configuration
NEXT_PUBLIC_API_URL=https://bot.bikinapps.cloud/api

# TokoPay Configuration
TOKOPAY_MERCHANT_ID=your_merchant_id_here
TOKOPAY_SECRET_KEY=your_secret_key_here

# Development Configuration
NODE_ENV=development
```

### 3. **TokoPay Setup**

#### **Step 1: Daftar Akun TokoPay**

1. Kunjungi [tokopay.id](https://tokopay.id)
2. Klik "Daftar" dan ikuti proses registrasi
3. Verifikasi email dan lengkapi profil

#### **Step 2: Aktivasi Merchant**

1. Login ke dashboard TokoPay
2. Lengkapi data merchant (KTP, NPWP, dll)
3. Tunggu approval dari tim TokoPay (1-2 hari kerja)

#### **Step 3: Dapatkan Credentials**

1. Setelah approved, masuk ke menu "API"
2. Copy Merchant ID dan Secret Key
3. Update file `.env.local` dengan credentials tersebut

### 4. **Test Payment Gateway**

```bash
# Test TokoPay integration
node test-tokopay.js
```

Expected output:

```
🧪 Testing TokoPay Integration...

1️⃣ Testing account info...
✅ Account info: { status: 'Success', data: {...} }

2️⃣ Testing order creation...
✅ Order created: { refId: 'TKP123456789', qr_link: '...', status: 'Unpaid' }

3️⃣ Testing payment status...
✅ Payment status: { reference: 'TKP123456789', status: 'Unpaid' }

🎉 All tests passed! TokoPay integration is working correctly.
```

### 5. **Run Development Server**

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) di browser.

## 🎯 **Testing Payment Flow**

### **Manual Testing**

1. **Buka aplikasi** di browser
2. **Pilih produk** yang ingin dibeli
3. **Klik "Beli Sekarang"**
4. **Payment modal** akan terbuka dengan QR Code
5. **Scan QR Code** menggunakan e-wallet/mobile banking
6. **Lakukan pembayaran** sesuai nominal
7. **Tunggu konfirmasi** otomatis (15 detik interval)
8. **Akun akan dikirim** otomatis setelah pembayaran berhasil

### **Test dengan Nominal Kecil**

Untuk testing, gunakan nominal kecil (misal: Rp 1.000) untuk menghindari biaya yang besar.

## 🔧 **Troubleshooting**

### **Common Issues**

#### **1. "Invalid merchant" Error**

```bash
# Check environment variables
echo $TOKOPAY_MERCHANT_ID
echo $TOKOPAY_SECRET_KEY
```

**Solution:**

-  Pastikan credentials sudah benar
-  Verifikasi akun TokoPay sudah approved
-  Restart development server setelah update .env

#### **2. QR Code Not Loading**

```javascript
// Check browser console for errors
console.log('Payment data:', paymentData);
```

**Solution:**

-  Check network connection
-  Verify API endpoint accessible
-  Check browser console for CORS errors

#### **3. Payment Status Not Updating**

```javascript
// Check interval timing
setInterval(() => {
   checkPaymentStatus();
}, 15000); // 15 seconds
```

**Solution:**

-  Verify payment was actually completed
-  Check TokoPay dashboard for transaction status
-  Increase interval timing if needed

#### **4. Build Errors**

```bash
# Clean and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### **Debug Commands**

```bash
# Check dependencies
npm list tokopay
npm list md5

# Test API endpoints
curl -X POST http://localhost:3000/api/payment \
  -H "Content-Type: application/json" \
  -d '{"refId":"TEST123","metode":"QRIS","nominal":1000}'

# Check environment
node -e "console.log('Merchant ID:', process.env.TOKOPAY_MERCHANT_ID)"
```

## 📱 **Mobile Testing**

### **QR Code Scanning**

-  QR Code size: 200x200px (optimal untuk scan)
-  Test dengan berbagai e-wallet: GoPay, OVO, DANA, LinkAja
-  Test dengan mobile banking: BCA, Mandiri, BNI

### **Responsive Design**

-  Payment modal responsive untuk mobile
-  Touch-friendly buttons
-  Mobile-optimized layout

## 🔒 **Security Best Practices**

### **Environment Variables**

-  ✅ Gunakan `.env.local` untuk development
-  ✅ Gunakan environment variables di production
-  ❌ Jangan hardcode credentials di code
-  ❌ Jangan commit `.env.local` ke repository

### **Input Validation**

```javascript
// Validate amount
if (nominal < 1000 || nominal > 10000000) {
   throw new Error('Invalid amount');
}

// Validate refId format
if (!refId.match(/^[A-Z0-9]+$/)) {
   throw new Error('Invalid reference ID');
}
```

### **Error Handling**

```javascript
// Don't expose sensitive info
catch (error) {
  console.error('Payment error:', error);
  throw new Error('Gagal membuat pembayaran');
}
```

## 🚀 **Production Deployment**

### **Vercel (Recommended)**

1. **Push code** ke GitHub
2. **Connect repository** ke Vercel
3. **Set environment variables** di Vercel dashboard:
   -  `TOKOPAY_MERCHANT_ID`
   -  `TOKOPAY_SECRET_KEY`
   -  `NEXT_PUBLIC_API_URL`
4. **Deploy** otomatis

### **Manual Build**

```bash
npm run build
npm start
```

### **Environment Variables di Production**

```env
# Production Configuration
TOKOPAY_MERCHANT_ID=your_production_merchant_id
TOKOPAY_SECRET_KEY=your_production_secret_key
NEXT_PUBLIC_API_URL=https://your-production-api.com
NODE_ENV=production
```

## 📊 **Monitoring & Analytics**

### **Payment Events Tracking**

```javascript
// Track payment events
const trackPaymentEvent = (event, data) => {
   // Send to analytics service
   console.log('Payment event:', event, data);
};
```

### **Success Rate Monitoring**

```javascript
// Monitor success rate
const successRate = (successfulPayments / totalPayments) * 100;
```

## 📞 **Support**

### **TokoPay Support**

-  Email: support@tokopay.id
-  WhatsApp: +62 xxx-xxxx-xxxx
-  Documentation: [tokopay.id/docs](https://tokopay.id/docs)

### **Development Support**

-  Check console logs untuk error details
-  Verify environment variables
-  Test dengan nominal kecil terlebih dahulu
-  Review [TOKOPAY_SETUP.md](TOKOPAY_SETUP.md) untuk detail teknis

## ✅ **Checklist Setup**

-  [ ] Install dependencies (`npm install`)
-  [ ] Setup environment variables (`.env.local`)
-  [ ] Daftar akun TokoPay
-  [ ] Aktivasi merchant account
-  [ ] Dapatkan Merchant ID dan Secret Key
-  [ ] Update environment variables
-  [ ] Test payment gateway (`node test-tokopay.js`)
-  [ ] Run development server (`npm run dev`)
-  [ ] Test complete payment flow
-  [ ] Deploy ke production

---

## 🎉 **Congratulations!**

Payment gateway TokoPay QRIS sudah terintegrasi dengan aplikasi Anda!

**Next Steps:**

1. Test dengan pembayaran real
2. Monitor transaksi di TokoPay dashboard
3. Setup monitoring dan analytics
4. Optimize user experience

**Happy Coding! 🚀**

