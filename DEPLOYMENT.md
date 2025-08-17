# Deployment Guide - Toko Sans

Panduan lengkap untuk deployment proyek Toko Sans ke berbagai platform.

## 🚀 Platform Deployment

### 1. Vercel (Recommended)

Vercel adalah platform deployment yang paling cocok untuk Next.js applications.

#### Langkah-langkah:

1. **Push ke GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Connect ke Vercel**

   -  Buka [vercel.com](https://vercel.com)
   -  Sign in dengan GitHub
   -  Klik "New Project"
   -  Import repository dari GitHub
   -  Vercel akan otomatis detect Next.js

3. **Environment Variables**

   -  Di dashboard Vercel, buka project settings
   -  Tambahkan environment variables:

   ```
   NEXT_PUBLIC_API_BASE_URL=https://bot.bikinapps.cloud/api
   ```

4. **Deploy**
   -  Klik "Deploy"
   -  Vercel akan build dan deploy otomatis
   -  Setiap push ke main branch akan auto-deploy

#### Keuntungan Vercel:

-  ✅ Auto-deployment dari GitHub
-  ✅ Preview deployments untuk PR
-  ✅ Edge functions support
-  ✅ Analytics built-in
-  ✅ Custom domains
-  ✅ SSL certificates

### 2. Netlify

#### Langkah-langkah:

1. **Build Command**

   ```bash
   npm run build
   ```

2. **Publish Directory**

   ```
   .next
   ```

3. **Environment Variables**
   -  Tambahkan di Netlify dashboard:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://bot.bikinapps.cloud/api
   ```

### 3. Railway

#### Langkah-langkah:

1. **Connect GitHub**

   -  Buka [railway.app](https://railway.app)
   -  Connect dengan GitHub account
   -  Deploy dari repository

2. **Environment Variables**
   -  Tambahkan di Railway dashboard
   -  Auto-deploy dari GitHub

### 4. DigitalOcean App Platform

#### Langkah-langkah:

1. **Create App**

   -  Buka DigitalOcean dashboard
   -  Pilih "Create App"
   -  Connect GitHub repository

2. **Configure Build**
   -  Build Command: `npm run build`
   -  Run Command: `npm start`
   -  Output Directory: `.next`

## 🔧 Environment Configuration

### Required Environment Variables

```env
# API Configuration
NEXT_PUBLIC_API_BASE_URL=https://bot.bikinapps.cloud/api

# Optional: Analytics
NEXT_PUBLIC_GA_TRACKING_ID=your_ga_tracking_id

# Optional: Payment Gateway (future)
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_MERCHANT_ID=your_midtrans_merchant_id
```

### Local Development

1. **Create .env.local**

   ```bash
   cp .env.example .env.local
   ```

2. **Edit .env.local**
   ```env
   NEXT_PUBLIC_API_BASE_URL=https://bot.bikinapps.cloud/api
   ```

## 📦 Build Process

### Pre-deployment Checklist

-  [ ] Environment variables configured
-  [ ] API endpoints accessible
-  [ ] Images optimized
-  [ ] SEO meta tags added
-  [ ] Performance optimized
-  [ ] Mobile responsive tested

### Build Commands

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Start production server
npm start

# Run tests (if available)
npm test
```

## 🌐 Domain & SSL

### Custom Domain Setup

1. **Vercel**

   -  Buka project settings
   -  Pilih "Domains"
   -  Add custom domain
   -  Update DNS records

2. **Netlify**
   -  Buka site settings
   -  Pilih "Domain management"
   -  Add custom domain
   -  Update DNS records

### SSL Certificates

-  **Vercel**: Automatic SSL
-  **Netlify**: Automatic SSL
-  **Railway**: Automatic SSL
-  **DigitalOcean**: Automatic SSL

## 📊 Monitoring & Analytics

### Vercel Analytics

```bash
npm install @vercel/analytics
```

```tsx
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <body>
            {children}
            <Analytics />
         </body>
      </html>
   );
}
```

### Google Analytics

```tsx
// app/layout.tsx
import Script from 'next/script';

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <html lang="en">
         <head>
            <Script src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_TRACKING_ID}`} strategy="afterInteractive" />
            <Script id="google-analytics" strategy="afterInteractive">
               {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_TRACKING_ID}');
          `}
            </Script>
         </head>
         <body>{children}</body>
      </html>
   );
}
```

## 🔍 Performance Optimization

### Image Optimization

```tsx
import Image from 'next/image';

<Image src="/product-image.jpg" alt="Product" width={400} height={300} priority placeholder="blur" blurDataURL="data:image/jpeg;base64,..." />;
```

### Code Splitting

```tsx
import dynamic from 'next/dynamic';

const ProductModal = dynamic(() => import('@/components/ProductModal'), {
   loading: () => <LoadingSpinner />,
   ssr: false,
});
```

## 🚨 Error Handling

### Custom Error Pages

```tsx
// app/error.tsx
'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
   return (
      <div className="min-h-screen flex items-center justify-center">
         <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
            <button onClick={() => reset()} className="bg-primary text-white px-4 py-2 rounded">
               Try again
            </button>
         </div>
      </div>
   );
}
```

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Vercel

on:
   push:
      branches: [main]

jobs:
   deploy:
      runs-on: ubuntu-latest
      steps:
         - uses: actions/checkout@v3
         - uses: actions/setup-node@v3
           with:
              node-version: '18'
         - run: npm ci
         - run: npm run build
         - uses: amondnet/vercel-action@v25
           with:
              vercel-token: ${{ secrets.VERCEL_TOKEN }}
              vercel-org-id: ${{ secrets.ORG_ID }}
              vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📱 PWA Setup (Optional)

### Install PWA Dependencies

```bash
npm install next-pwa
```

### Configure PWA

```javascript
// next.config.js
const withPWA = require('next-pwa')({
   dest: 'public',
   register: true,
   skipWaiting: true,
});

module.exports = withPWA({
   // your existing config
});
```

## 🔒 Security

### Security Headers

```javascript
// next.config.js
module.exports = {
   async headers() {
      return [
         {
            source: '/(.*)',
            headers: [
               {
                  key: 'X-Frame-Options',
                  value: 'DENY',
               },
               {
                  key: 'X-Content-Type-Options',
                  value: 'nosniff',
               },
               {
                  key: 'Referrer-Policy',
                  value: 'origin-when-cross-origin',
               },
            ],
         },
      ];
   },
};
```

## 📞 Support

Untuk bantuan deployment, silakan:

1. Check documentation platform yang digunakan
2. Review error logs di dashboard
3. Contact support platform
4. Create issue di repository GitHub
