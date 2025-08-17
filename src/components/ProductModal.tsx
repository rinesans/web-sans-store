'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/api';
import { useProductStore } from '@/store/productStore';
import { ShoppingCart, Clock, Shield, Star, X } from 'lucide-react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductModalProps {
   product: Product;
   children: React.ReactNode;
}

export function ProductModal({ product, children }: ProductModalProps) {
   const [open, setOpen] = useState(false);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price);
   };

   const isOutOfStock = product.accounts_unsold_count === 0;

   const { setSelectedProduct } = useProductStore();

   const handleBuyNow = () => {
      setSelectedProduct(product);
      setOpen(false);
      // Navigate to payment page
      window.location.href = `/payment/${product.id}`;
   };

   return (
      <>
         <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>{children}</DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">{product.name}</DialogTitle>
                  <DialogDescription className="text-lg">{product.type}</DialogDescription>
               </DialogHeader>

               <div className="space-y-6">
                  {/* Product Image */}
                  <div className="relative h-64 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950 dark:to-indigo-900 rounded-lg overflow-hidden">
                     {product.image ? (
                        <Image src={`${API_BASE_URL}/upload/product/${product.image}`} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
                     ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                           <div className="text-8xl opacity-20">
                              {product.type === 'Canva' && '🎨'}
                              {product.type === 'Spotify' && '🎵'}
                              {product.type === 'Netflix' && '🎬'}
                              {product.type === 'YouTube' && '📺'}
                           </div>
                        </div>
                     )}
                     <Badge variant={isOutOfStock ? 'destructive' : 'secondary'} className="absolute top-4 right-4">
                        {isOutOfStock ? 'Habis' : `${product.accounts_unsold_count} tersedia`}
                     </Badge>
                  </div>

                  {/* Price */}
                  <div className="text-center">
                     <div className="text-4xl font-bold text-primary mb-2">{formatPrice(product.price)}</div>
                     <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{product.name.includes('Lifetime') ? 'Akses Seumur Hidup' : '1 Bulan'}</span>
                     </div>
                  </div>

                  {/* Description */}
                  <div>
                     <h3 className="font-semibold mb-2">Deskripsi</h3>
                     <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                  </div>

                  {/* Features */}
                  <div>
                     <h3 className="font-semibold mb-3">Fitur Utama</h3>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="flex items-center gap-2">
                           <Shield className="h-4 w-4 text-green-500" />
                           <span className="text-sm">Akun Original</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Star className="h-4 w-4 text-yellow-500" />
                           <span className="text-sm">Kualitas Premium</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <Clock className="h-4 w-4 text-blue-500" />
                           <span className="text-sm">Aktivasi Instan</span>
                        </div>
                        <div className="flex items-center gap-2">
                           <ShoppingCart className="h-4 w-4 text-purple-500" />
                           <span className="text-sm">Pembayaran Aman</span>
                        </div>
                     </div>
                  </div>

                  {/* Terms and Conditions */}
                  <div>
                     <h3 className="font-semibold mb-3">Syarat & Ketentuan</h3>
                     <div className="text-sm text-muted-foreground prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: product.tnc }} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4">
                     <Button className="flex-1" onClick={handleBuyNow} disabled={isOutOfStock} size="lg">
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}
                     </Button>
                     <Button variant="outline" onClick={() => setOpen(false)} size="lg">
                        <X className="mr-2 h-5 w-5" />
                        Tutup
                     </Button>
                  </div>
               </div>
            </DialogContent>
         </Dialog>
      </>
   );
}
