import React from 'react';
import Image from 'next/image';

interface LogoProps {
   size?: 'sm' | 'md' | 'lg';
   className?: string;
}

interface LogoPreviewProps {
   className?: string;
}

export function Logo({ size = 'md', className = '' }: LogoProps) {
   const sizeClasses = {
      sm: 'w-6 h-6',
      md: 'w-8 h-8',
      lg: 'w-12 h-12',
   };

   return (
      <div className={`${sizeClasses[size]} ${className}`}>
         <Image src="/logo.svg" alt="Toko Sans Logo" width={48} height={48} className="w-full h-full object-contain" priority loading="eager" sizes="(max-width: 768px) 24px, (max-width: 1200px) 32px, 48px" />
      </div>
   );
}

export function LogoPreview({ className = '' }: LogoPreviewProps) {
   return (
      <div className={`w-32 h-32 ${className}`}>
         <Image src="/LogoPriview.png" alt="Toko Sans Logo Preview" width={128} height={128} className="w-full h-full object-contain" priority loading="eager" sizes="128px" />
      </div>
   );
}
