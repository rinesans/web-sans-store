import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
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
   },
};

export default nextConfig;
