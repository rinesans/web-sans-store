# 🧾 Invoice Detail Page with QRIS

## 🎯 **Fitur Baru**

Halaman **Detail Invoice** dengan QRIS code yang otomatis expired setelah 15 menit.

## 🏗️ **Flow Baru**

```
Beli Sekarang → Generate Invoice → /invoice/{invoice} → QRIS Payment
```

## 📁 **File yang Dibuat/Dimodifikasi**

### **1. `src/app/invoice/[invoice]/page.tsx` (Baru)**

-  Halaman detail invoice dengan QRIS code
-  Auto-expire QRIS setelah 15 menit
-  Status tracking (Menunggu/Lunas/Gagal)
-  Account info untuk transaksi yang sudah dibayar

### **2. `src/app/beli/[slug]/page.tsx` (Dimodifikasi)**

-  Generate invoice otomatis saat klik "Beli Sekarang"
-  Simpan ke localStorage `purchase_history`
-  Redirect ke halaman invoice detail

## 🎨 **UI Features**

### **✅ Invoice Header:**

-  Invoice number dengan copy button
-  Status badge (Menunggu/Lunas/Gagal)
-  Created date

### **✅ QRIS Payment Section:**

-  QRIS code yang bisa di-scan
-  Amount yang harus dibayar
-  Expiry warning (15 menit)
-  Auto-hide jika expired

### **✅ QRIS Expired Message:**

-  Pesan expired dengan tombol "Buat Pesanan Baru"
-  Redirect ke homepage

### **✅ Payment Success:**

-  Pesan sukses jika sudah dibayar
-  Account info ditampilkan

### **✅ Transaction Details:**

-  Product info lengkap
-  Payment details
-  Customer info
-  Account info (jika sudah dibayar)

## ⏰ **QRIS Expiry Logic**

```typescript
const checkQrValidity = (transactionData: TransactionData) => {
   const createdAt = new Date(transactionData.created_at);
   const now = new Date();
   const timeDiff = now.getTime() - createdAt.getTime();
   const minutesDiff = Math.floor(timeDiff / (1000 * 60));

   if (minutesDiff > 15) {
      setIsQrExpired(true);
      setQrCodeUrl(null);
   } else {
      setIsQrExpired(false);
      generateQrCode(transactionData);
   }
};
```

## 🔄 **Data Flow**

### **1. Generate Invoice:**

```typescript
const invoice = `WEB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
```

### **2. Create Transaction:**

```typescript
const transactionData = {
   invoice: invoice,
   status: null, // Pending
   status_text: 'Menunggu Pembayaran',
   total_paid: 0,
   method: 'QRIS',
   pay_time: null,
   created_at: new Date().toISOString(),
   // ... product details
};
```

### **3. Save to localStorage:**

```typescript
const existingHistory = localStorage.getItem('purchase_history');
const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
historyArray.unshift(transactionData);
localStorage.setItem('purchase_history', JSON.stringify(historyArray));
```

### **4. Navigate to Invoice:**

```typescript
router.push(`/invoice/${invoice}`);
```

## 📱 **Screenshots**

### **Active QRIS:**

```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Navigation, Theme Toggle)                │
├─────────────────────────────────────────────────────────┤
│ Detail Invoice                    [Kembali]            │
│ Informasi lengkap transaksi pembelian                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ WEB1755212001711YTGKPL    [Menunggu] [Salin]      │ │
│ │ Dibuat pada 14 Jan 2025, 10:30                    │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ 🧾 Pembayaran QRIS                                 │ │
│ │ Scan QRIS code di bawah ini untuk melakukan pembayaran │
│ │                                                     │ │
│ │    ┌─────────────────────────────────────────┐     │ │
│ │    │                                         │     │ │
│ │    │              [QRIS CODE]                │     │ │
│ │    │                                         │     │ │
│ │    └─────────────────────────────────────────┘     │ │
│ │                                                     │ │
│ │ Rp 50.000                                          │ │
│ │ QRIS akan expired dalam 15 menit dari pembuatan invoice │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **QRIS Expired:**

```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Navigation, Theme Toggle)                │
├─────────────────────────────────────────────────────────┤
│ Detail Invoice                    [Kembali]            │
│ Informasi lengkap transaksi pembelian                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ❌ QRIS Expired                                    │ │
│ │ Kode QRIS telah expired. Silakan buat pesanan baru. │ │
│ │                                                     │ │
│ │ [Buat Pesanan Baru]                                │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### **Payment Success:**

```
┌─────────────────────────────────────────────────────────┐
│ Header (Logo, Navigation, Theme Toggle)                │
├─────────────────────────────────────────────────────────┤
│ Detail Invoice                    [Kembali]            │
│ Informasi lengkap transaksi pembelian                  │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ ✅ Pembayaran Berhasil                             │ │
│ │ Transaksi telah selesai dan akun telah aktif       │ │
│ └─────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────┐ │
│ │ Detail Transaksi                                   │ │
│ │ 📦 Netflix Premium                                 │ │
│ │ Netflix Premium 1 Bulan                            │ │
│ │ Rp 50.000                                          │ │
│ │                                                     │ │
│ │ 💳 Total Bayar: Rp 50.000                          │ │
│ │ 💳 Metode Pembayaran: QRIS                         │ │
│ │ 📅 Waktu Pembayaran: 14 Jan 2025, 10:35            │ │
│ │                                                     │ │
│ │ 👤 Nama Pembeli: Web User                          │ │
│ │ 📱 Nomor Telepon: -                                │ │
│ │                                                     │ │
│ │ Informasi Akun                                     │ │
│ │ Email: user@example.com                            │ │
│ │ Password: password123                              │ │
│ └─────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

## 🎉 **Status: ✅ SELESAI & BERFUNGSI**

### **✅ Completed Features:**

-  ✅ Invoice detail page dengan QRIS
-  ✅ Auto-expire QRIS setelah 15 menit
-  ✅ Generate invoice otomatis saat beli
-  ✅ Save ke localStorage purchase_history
-  ✅ Status tracking (Menunggu/Lunas/Gagal)
-  ✅ Account info untuk transaksi lunas
-  ✅ Copy invoice button
-  ✅ Refresh status button
-  ✅ Responsive design

### **✅ QRIS Features:**

-  ✅ QRIS code generation
-  ✅ 15-minute expiry timer
-  ✅ Auto-hide expired QRIS
-  ✅ Expired message dengan CTA
-  ✅ Success message untuk pembayaran

**Ready for production use! 🚀**
