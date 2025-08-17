import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Riwayat Transaksi - Toko Sans',
   description: 'Lihat riwayat transaksi pembelian akun premium Anda. Cek status pembayaran, detail produk, dan informasi akun yang telah dibeli.',
   openGraph: {
      title: 'Riwayat Transaksi - Toko Sans',
      description: 'Lihat riwayat transaksi pembelian akun premium Anda. Cek status pembayaran dan detail produk.',
   },
   twitter: {
      title: 'Riwayat Transaksi - Toko Sans',
      description: 'Lihat riwayat transaksi pembelian akun premium Anda. Cek status pembayaran dan detail produk.',
   },
};

export default function RiwayatLayout({ children }: { children: React.ReactNode }) {
   return children;
}
