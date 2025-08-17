import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'FAQ - Pertanyaan Umum - Toko Sans',
   description: 'Pertanyaan umum seputar pembelian akun premium, pembayaran, aktivasi, dan layanan customer service Toko Sans. Temukan jawaban lengkap di sini.',
   openGraph: {
      title: 'FAQ - Pertanyaan Umum - Toko Sans',
      description: 'Pertanyaan umum seputar pembelian akun premium, pembayaran, aktivasi, dan layanan customer service Toko Sans.',
   },
   twitter: {
      title: 'FAQ - Pertanyaan Umum - Toko Sans',
      description: 'Pertanyaan umum seputar pembelian akun premium, pembayaran, aktivasi, dan layanan customer service Toko Sans.',
   },
};

export default function FAQLayout({ children }: { children: React.ReactNode }) {
   return children;
}
