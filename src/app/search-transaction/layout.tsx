import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Cari Transaksi - Toko Sans',
   description: 'Cari dan cek status transaksi pembelian akun premium Anda dengan memasukkan nomor invoice. Lihat detail pembayaran dan status akun.',
   openGraph: {
      title: 'Cari Transaksi - Toko Sans',
      description: 'Cari dan cek status transaksi pembelian akun premium Anda dengan memasukkan nomor invoice.',
   },
   twitter: {
      title: 'Cari Transaksi - Toko Sans',
      description: 'Cari dan cek status transaksi pembelian akun premium Anda dengan memasukkan nomor invoice.',
   },
};

export default function SearchTransactionLayout({ children }: { children: React.ReactNode }) {
   return children;
}
