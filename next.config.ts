import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
   // Performance optimizations
   compress: true,
   poweredByHeader: false,
   generateEtags: false,

   // Image optimization
   images: {
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'techexs.it.com',
            port: '',
            pathname: '/upload/**',
         },
         {
            protocol: 'https',
            hostname: 'assets.tokopay.id',
            port: '',
            pathname: '/**',
         },
      ],
      formats: ['image/webp', 'image/avif'],
      minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
   },

   // Bundle optimization
   experimental: {
      optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-separator'],
   },

   // Headers for caching and security
   async headers() {
      return [
         {
            source: '/(.*)',
            headers: [
               {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
               },
               {
                  key: 'X-Frame-Options',
                  value: 'DENY',
               },
               {
                  key: 'X-XSS-Protection',
                  value: '1; mode=block',
               },
            ],
         },
         {
            source: '/static/(.*)',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
               },
            ],
         },
         {
            source: '/images/(.*)',
            headers: [
               {
                  key: 'Cache-Control',
                  value: 'public, max-age=31536000, immutable',
               },
            ],
         },
      ];
   },
};

export default nextConfig;
