import toast from 'react-hot-toast';

// Toast messages
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
   forceRefresh: '🔄 Memperbarui data dari server...',
   forceRefreshSuccess: '✅ Data berhasil diperbarui dari server',
   forceRefreshError: '❌ Gagal memperbarui data dari server',
};

// Toast helper functions
export const showToast = {
   success: (message: string, duration: number = 4000) => {
      toast.success(message, {
         duration,
         position: 'top-right',
         style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
         },
      });
   },
   error: (message: string, duration: number = 6000) => {
      toast.error(message, {
         duration,
         position: 'top-right',
         style: {
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
         },
      });
   },
   info: (message: string, duration: number = 3000) => {
      toast(message, {
         duration,
         position: 'top-right',
         icon: 'ℹ️',
         style: {
            background: '#eff6ff',
            color: '#1d4ed8',
            border: '1px solid #bfdbfe',
         },
      });
   },
   warning: (message: string, duration: number = 8000) => {
      toast(message, {
         duration,
         position: 'top-right',
         icon: '⚠️',
         style: {
            background: '#fffbeb',
            color: '#d97706',
            border: '1px solid #fed7aa',
         },
      });
   },
   loading: (message: string) => {
      return toast.loading(message, {
         position: 'top-right',
         style: {
            background: '#f8fafc',
            color: '#475569',
            border: '1px solid #e2e8f0',
         },
      });
   },
   dismiss: (toastId: string) => {
      toast.dismiss(toastId);
   },
};
