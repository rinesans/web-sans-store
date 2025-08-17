# 🚀 TokoPay Integration Setup Guide

Panduan lengkap untuk mengintegrasikan payment gateway TokoPay QRIS ke aplikasi web.

## 📋 **Persyaratan**

-  Akun TokoPay Merchant (daftar di [tokopay.id](https://tokopay.id))
-  Merchant ID dan Secret Key dari dashboard TokoPay
-  Node.js dan npm terinstall

## ⚙️ **Konfigurasi Environment Variables**

Buat file `.env.local` di root project dan tambahkan konfigurasi berikut:

```env
# TokoPay Configuration
NEXT_PUBLIC_TOKOPAY_MERCHANT_ID=your_merchant_id_here
NEXT_PUBLIC_TOKOPAY_SECRET_KEY=your_secret_key_here

# API Configuration
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```

### **Cara Mendapatkan Credentials TokoPay:**

1. **Daftar Akun TokoPay**

   -  Kunjungi [tokopay.id](https://tokopay.id)
   -  Klik "Daftar" dan ikuti proses registrasi
   -  Verifikasi email dan lengkapi profil

2. **Aktivasi Merchant**

   -  Login ke dashboard TokoPay
   -  Lengkapi data merchant (KTP, NPWP, dll)
   -  Tunggu approval dari tim TokoPay

3. **Dapatkan Credentials**
   -  Setelah approved, masuk ke menu "API"
   -  Copy Merchant ID dan Secret Key
   -  Paste ke file `.env.local`

## 🔧 **Testing Payment Gateway**

### **1. Test Order Creation**

```bash
# Buat file test sederhana
node -e "
const tokopay = require('tokopay');
const client = new tokopay('YOUR_MERCHANT_ID', 'YOUR_SECRET_KEY');

async function testOrder() {
  try {
    const response = await client.simpleOrder('TEST123', 'QRIS', 10000);
    console.log('Order created:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testOrder();
"
```

### **2. Test Payment Status**

```bash
node -e "
const tokopay = require('tokopay');
const client = new tokopay('YOUR_MERCHANT_ID', 'YOUR_SECRET_KEY');

async function testStatus() {
  try {
    const response = await client.simpleOrder('TEST123', 'QRIS', 10000);
    console.log('Payment status:', response);
  } catch (error) {
    console.error('Error:', error);
  }
}

testStatus();
"
```

## 🎯 **Flow Pembayaran**

### **1. User Flow**

```
User Klik "Beli Sekarang"
→ PaymentModal Terbuka
→ QR Code Ditampilkan
→ User Scan & Bayar
→ Status Monitoring (15 detik)
→ Akun Dikirim Otomatis
```

### **2. Technical Flow**

```
1. createPaymentOrder() - Buat order TokoPay
2. generateRefId() - Generate unique reference ID
3. client.simpleOrder() - Call TokoPay API
4. Display QR Code - Tampilkan QR untuk user
5. checkPaymentStatus() - Monitor status setiap 15 detik
6. onSuccess() - Kirim akun saat pembayaran berhasil
```

## 🔍 **Monitoring & Debugging**

### **Console Logs**

```javascript
// Enable debug mode
console.log('🔍 Creating order:', order);
console.log('✅ Order created:', response);
console.log('🔄 Checking status:', refId);
console.log('💰 Payment status:', status);
```

### **Error Handling**

```javascript
try {
   const response = await tokoPayService.createOrder(order);
} catch (error) {
   console.error('❌ Payment error:', error);
   // Handle error gracefully
}
```

## 🛡️ **Security Best Practices**

### **1. Environment Variables**

-  ✅ Gunakan `.env.local` untuk development
-  ✅ Gunakan environment variables di production
-  ❌ Jangan hardcode credentials di code

### **2. Input Validation**

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

### **3. Error Handling**

```javascript
// Don't expose sensitive info
catch (error) {
  console.error('Payment error:', error);
  throw new Error('Gagal membuat pembayaran');
}
```

## 📱 **Mobile Responsive**

Payment modal sudah responsive untuk mobile:

-  QR Code size: 200x200px (optimal untuk scan)
-  Touch-friendly buttons
-  Mobile-optimized layout

## 🔄 **Auto-Retry Mechanism**

```javascript
// Auto retry jika gagal
const retryPayment = () => {
   setPaymentData(null);
   setPaymentStatus('pending');
   createPaymentOrder();
};
```

## 📊 **Analytics & Tracking**

### **Payment Events**

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

## 🚨 **Troubleshooting**

### **Common Issues**

#### **1. "Invalid merchant" Error**

```bash
# Check environment variables
echo $NEXT_PUBLIC_TOKOPAY_MERCHANT_ID
echo $NEXT_PUBLIC_TOKOPAY_SECRET_KEY
```

#### **2. QR Code Not Loading**

```javascript
// Check if qr_link exists
if (paymentData?.data?.qr_link) {
   // Display QR code
} else {
   // Show error
}
```

#### **3. Payment Status Not Updating**

```javascript
// Check interval timing
setInterval(() => {
   checkPaymentStatus();
}, 15000); // 15 seconds
```

### **Debug Commands**

```bash
# Check TokoPay package
npm list tokopay

# Test API connection
curl -X GET "https://api.tokopay.id/v1/order" \
  -H "Content-Type: application/json"
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

## ✅ **Checklist Setup**

-  [ ] Daftar akun TokoPay
-  [ ] Aktivasi merchant account
-  [ ] Dapatkan Merchant ID dan Secret Key
-  [ ] Setup environment variables
-  [ ] Test order creation
-  [ ] Test payment status checking
-  [ ] Verify QR code display
-  [ ] Test complete payment flow
-  [ ] Deploy ke production

---

**🎉 Selamat! Payment gateway TokoPay sudah terintegrasi dengan aplikasi Anda!**

