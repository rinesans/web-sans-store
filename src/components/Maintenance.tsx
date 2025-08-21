/* eslint-disable @next/next/no-img-element */
'use client';

import React from 'react';

export default function Maintenance() {
   return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
         <img src="/logo.svg" alt="Logo" className="h-16 w-16 opacity-80" />
         <div className="max-w-xl">
            <h1 className="text-3xl sm:text-4xl font-semibold">Sedang Perbaikan</h1>
            <p className="mt-3 text-muted-foreground">Kami sedang melakukan pemeliharaan sistem untuk peningkatan layanan. Silakan coba lagi nanti.</p>
            <p className="mt-1 text-sm text-muted-foreground">Terima kasih atas pengertiannya.</p>
         </div>
      </div>
   );
}
