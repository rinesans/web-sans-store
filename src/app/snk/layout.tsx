import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Syarat & Ketentuan - Toko Sans',
   description: 'Syarat dan ketentuan penggunaan layanan Toko Sans. Baca dengan seksama sebelum melakukan transaksi pembelian akun premium.',
   openGraph: {
      title: 'Syarat & Ketentuan - Toko Sans',
      description: 'Syarat dan ketentuan penggunaan layanan Toko Sans. Baca dengan seksama sebelum melakukan transaksi.',
   },
   twitter: {
      title: 'Syarat & Ketentuan - Toko Sans',
      description: 'Syarat dan ketentuan penggunaan layanan Toko Sans. Baca dengan seksama sebelum melakukan transaksi.',
   },
};

export default function SNKLayout({ children }: { children: React.ReactNode }) {
   return children;
}
