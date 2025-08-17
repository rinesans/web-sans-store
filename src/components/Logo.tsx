import React from 'react';
import Image from 'next/image';

interface LogoProps {
   size?: 'sm' | 'md' | 'lg';
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
         <Image src="/logo.svg" alt="Toko Sans Logo" width={48} height={48} className="w-full h-full object-contain" priority />
      </div>
   );
}
