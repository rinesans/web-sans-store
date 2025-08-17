import type { Metadata } from 'next';

export const metadata: Metadata = {
   title: 'Kebijakan Privasi - Toko Sans',
   description: 'Kebijakan privasi Toko Sans menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda. Baca selengkapnya di sini.',
   openGraph: {
      title: 'Kebijakan Privasi - Toko Sans',
      description: 'Kebijakan privasi Toko Sans menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
   },
   twitter: {
      title: 'Kebijakan Privasi - Toko Sans',
      description: 'Kebijakan privasi Toko Sans menjelaskan bagaimana kami mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.',
   },
};

export default function PrivacyLayout({ children }: { children: React.ReactNode }) {
   return children;
}
