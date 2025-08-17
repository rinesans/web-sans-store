import type { Metadata } from 'next';
import { apiService } from '@/services/api';

// Generate metadata for product pages
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
   const { slug } = await params;

   try {
      const response = await apiService.getProductInfo();
      const product = response.data.find((p) => p.slug === slug);

      if (product) {
         return {
            title: `${product.name} - Detail Produk - Toko Sans`,
            description: `${product.name} - ${product.description}. Harga ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}. Pembayaran aman melalui QRIS.`,
            openGraph: {
               title: `${product.name} - Detail Produk - Toko Sans`,
               description: `${product.name} - ${product.description}. Harga ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}.`,
            },
            twitter: {
               title: `${product.name} - Detail Produk - Toko Sans`,
               description: `${product.name} - ${product.description}. Harga ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(product.price)}.`,
            },
         };
      }
   } catch (error) {
      console.error('Error generating metadata:', error);
   }

   return {
      title: 'Detail Produk - Toko Sans',
      description: 'Detail produk premium dari Toko Sans. Akses aplikasi premium dengan harga terjangkau.',
   };
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
   return children;
}
