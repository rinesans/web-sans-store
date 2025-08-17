import type { Metadata } from 'next';

// Generate metadata for invoice pages
export async function generateMetadata({ params }: { params: Promise<{ invoice: string }> }): Promise<Metadata> {
   const { invoice } = await params;

   return {
      title: `Invoice ${invoice} - Detail Transaksi - Toko Sans`,
      description: `Detail transaksi untuk invoice ${invoice}. Cek status pembayaran, QRIS, dan informasi akun premium Anda.`,
      openGraph: {
         title: `Invoice ${invoice} - Detail Transaksi - Toko Sans`,
         description: `Detail transaksi untuk invoice ${invoice}. Cek status pembayaran dan informasi akun premium.`,
      },
      twitter: {
         title: `Invoice ${invoice} - Detail Transaksi - Toko Sans`,
         description: `Detail transaksi untuk invoice ${invoice}. Cek status pembayaran dan informasi akun premium.`,
      },
   };
}

export default function InvoiceLayout({ children }: { children: React.ReactNode }) {
   return children;
}
