import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';

const geistSans = Geist({
   variable: '--font-geist-sans',
   subsets: ['latin'],
   display: 'swap',
   preload: true,
});

const geistMono = Geist_Mono({
   variable: '--font-geist-mono',
   subsets: ['latin'],
   display: 'swap',
   preload: true,
});

export const metadata: Metadata = {
   title: 'Toko Sans - Akses Premium Apps',
   description: 'Toko Sans menyediakan akses premium untuk berbagai aplikasi populer seperti Canva, Spotify, Netflix, YouTube, dan CapCut dengan harga terjangkau. Pembayaran aman melalui QRIS.',
   keywords: 'premium apps, canva pro, spotify premium, netflix, youtube premium, capcut, digital products',
   authors: [{ name: 'Toko Sans' }],
   creator: 'Toko Sans',
   publisher: 'Toko Sans',
   formatDetection: {
      email: false,
      address: false,
      telephone: false,
   },
   metadataBase: new URL('https://tokosans.com'),
   icons: {
      icon: '/logo.svg',
      shortcut: '/logo.svg',
      apple: '/logo.svg',
   },
   openGraph: {
      title: 'Toko Sans - Akses Premium Apps',
      description: 'Toko Sans menyediakan akses premium untuk berbagai aplikasi populer dengan harga terjangkau.',
      url: 'https://tokosans.com',
      siteName: 'Toko Sans',
      locale: 'id_ID',
      type: 'website',
      images: [
         {
            url: '/LogoPriview.png',
            width: 1200,
            height: 630,
            alt: 'Toko Sans - Akses Premium Apps',
         },
      ],
   },
   twitter: {
      card: 'summary_large_image',
      title: 'Toko Sans - Akses Premium Apps',
      description: 'Toko Sans menyediakan akses premium untuk berbagai aplikasi populer dengan harga terjangkau.',
      images: ['/LogoPriview.png'],
   },
   robots: {
      index: true,
      follow: true,
      googleBot: {
         index: true,
         follow: true,
         'max-video-preview': -1,
         'max-image-preview': 'large',
         'max-snippet': -1,
      },
   },
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <head>
            {/* Preconnect to external domains */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://techexs.it.com" />

            {/* DNS prefetch for other domains */}
            <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
            <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
            <link rel="dns-prefetch" href="https://techexs.it.com" />

            {/* Favicon */}
            <link rel="icon" href="/logo.svg" />
            <link rel="shortcut icon" href="/logo.svg" />
            <link rel="apple-touch-icon" href="/logo.svg" />

            {/* Preload critical resources */}
            <link rel="preload" href="/logo.svg" as="image" type="image/svg+xml" />
            <link rel="preload" href="/LogoPriview.png" as="image" type="image/png" />
         </head>
         <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
               {children}
               <Toaster />
            </ThemeProvider>
         </body>
      </html>
   );
}
