# Toast Notification System

## Overview

Sistem notifikasi menggunakan **react-toastify** untuk memberikan feedback yang modern dan user-friendly kepada pengguna.

## Installation

```bash
npm install react-toastify
```

## Configuration

### Toast Configuration File (`src/lib/toast-config.ts`)

File ini berisi konfigurasi konsisten untuk semua toast notifications:

```typescript
// Default configurations
export const defaultToastConfig: ToastOptions = {
   position: 'top-right',
   autoClose: 5000,
   hideProgressBar: false,
   closeOnClick: true,
   pauseOnHover: true,
   draggable: true,
   theme: 'light',
};

// Specific configurations
export const successToastConfig: ToastOptions = { ...defaultToastConfig, autoClose: 4000 };
export const errorToastConfig: ToastOptions = { ...defaultToastConfig, autoClose: 6000 };
export const infoToastConfig: ToastOptions = { ...defaultToastConfig, autoClose: 3000 };
export const warningToastConfig: ToastOptions = { ...defaultToastConfig, autoClose: 8000 };
export const shortToastConfig: ToastOptions = { ...defaultToastConfig, autoClose: 2000 };
```

### Toast Messages

Semua pesan toast dikelola secara terpusat:

```typescript
export const toastMessages = {
   paymentSuccess: '🎉 Pembayaran berhasil! Akun Anda telah aktif.',
   paymentPending: '⏳ Pembayaran sedang diproses...',
   paymentFailed: '❌ Pembayaran gagal. Silakan coba lagi.',
   qrisExpired: '⚠️ QRIS telah expired. Silakan buat pesanan baru.',
   autoRefreshActive: '🔄 Auto-refresh aktif. Status pembayaran akan diperbarui otomatis.',
   refreshStatus: '📡 Memperbarui status pembayaran...',
   copySuccess: '📋 Berhasil disalin!',
   copyFailed: '❌ Gagal menyalin ke clipboard',
   invoiceCopied: '📄 Invoice berhasil disalin!',
   accountOpened: '🔗 Membuka akun di tab baru...',
   loadError: '❌ Gagal memuat detail transaksi. Silakan coba lagi.',
   networkError: '🌐 Gagal terhubung ke server. Periksa koneksi internet Anda.',
};
```

## Usage

### Basic Usage

```typescript
import { toast } from 'react-toastify';
import { successToastConfig, toastMessages } from '@/lib/toast-config';

// Success notification
toast.success(toastMessages.paymentSuccess, successToastConfig);

// Error notification
toast.error(toastMessages.loadError, errorToastConfig);

// Info notification
toast.info(toastMessages.refreshStatus, infoToastConfig);

// Warning notification
toast.warning(toastMessages.qrisExpired, warningToastConfig);
```

### Toast Container Setup

Setiap halaman yang menggunakan toast harus memiliki `ToastContainer`:

```typescript
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

return (
   <div>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover theme="light" />
      {/* Your content */}
   </div>
);
```

## Toast Types

### 1. Success Toasts

-  **Payment Success**: Ketika pembayaran berhasil
-  **Copy Success**: Ketika berhasil copy ke clipboard
-  **Invoice Copied**: Ketika invoice berhasil disalin

### 2. Error Toasts

-  **Load Error**: Ketika gagal memuat data
-  **Copy Failed**: Ketika gagal copy ke clipboard
-  **Network Error**: Ketika ada masalah koneksi

### 3. Info Toasts

-  **Auto-refresh Active**: Ketika auto-refresh dimulai
-  **Refresh Status**: Ketika manual refresh
-  **Account Opened**: Ketika membuka akun di tab baru

### 4. Warning Toasts

-  **QRIS Expired**: Ketika QRIS sudah expired

## Implementation Examples

### Payment Success Flow

```typescript
// Detect payment completion
if (wasPending && isNowCompleted) {
   // Show success notification
   toast.success(toastMessages.paymentSuccess, successToastConfig);

   // Show account modal
   setShowSuccessNotification(true);
}
```

### Copy to Clipboard

```typescript
const copyToClipboard = async (text: string, field: string) => {
   try {
      await navigator.clipboard.writeText(text);
      toast.success(`${field === 'account' ? 'Username' : 'Password'} ${toastMessages.copySuccess}`, shortToastConfig);
   } catch (err) {
      toast.error(toastMessages.copyFailed, errorToastConfig);
   }
};
```

### Auto-refresh Notification

```typescript
// Start auto-refresh
const interval = setInterval(() => {
   fetchTransactionDetail(true);
}, 10000);

// Show notification
toast.info(toastMessages.autoRefreshActive, infoToastConfig);
```

## Customization

### Custom Toast Configuration

```typescript
// Custom configuration for specific use case
const customToastConfig: ToastOptions = {
   ...defaultToastConfig,
   position: 'bottom-center',
   autoClose: 10000,
   theme: 'dark',
};

toast.success('Custom message', customToastConfig);
```

### Custom Toast Messages

```typescript
// Add new messages to toast-config.ts
export const toastMessages = {
   // ... existing messages
   customMessage: '🚀 Custom notification message',
};
```

## Best Practices

### 1. Use Consistent Configuration

-  Selalu gunakan konfigurasi dari `toast-config.ts`
-  Jangan hardcode toast options di komponen

### 2. Use Centralized Messages

-  Semua pesan toast harus ada di `toastMessages`
-  Gunakan emoji untuk visual appeal

### 3. Appropriate Auto-close Times

-  **Success**: 4 seconds (user can see quickly)
-  **Error**: 6 seconds (user needs time to read)
-  **Info**: 3 seconds (quick information)
-  **Warning**: 8 seconds (important warning)
-  **Short**: 2 seconds (quick actions)

### 4. Toast Positioning

-  **Top-right**: Default position for most notifications
-  **Bottom-center**: For important system messages
-  **Top-center**: For critical errors

### 5. User Experience

-  **Draggable**: Allow users to move toasts
-  **Pause on hover**: Give users time to read
-  **Close on click**: Allow quick dismissal
-  **Progress bar**: Show remaining time

## Troubleshooting

### Common Issues

1. **Toast not showing**: Ensure `ToastContainer` is rendered
2. **CSS not loading**: Import `react-toastify/dist/ReactToastify.css`
3. **Multiple containers**: Only one `ToastContainer` per app
4. **Z-index issues**: Check if other elements are covering toasts

### Debug Mode

```typescript
// Enable debug mode for development
<ToastContainer
   enableMultiContainer
   containerId="A"
   position="top-right"
   // ... other props
/>
```

## Performance Considerations

-  **Auto-close**: Set appropriate times to avoid screen clutter
-  **Limit concurrent toasts**: Don't show too many at once
-  **Cleanup**: Clear intervals when component unmounts
-  **Memory**: Toast notifications are automatically cleaned up

## Accessibility

-  **Screen readers**: Toast messages are announced
-  **Keyboard navigation**: Toasts can be dismissed with keyboard
-  **High contrast**: Works with system accessibility settings
-  **Focus management**: Doesn't interfere with page focus

