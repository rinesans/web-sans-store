'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/api';
import { ShoppingCart, Clock, X } from 'lucide-react';
import { useProductStore } from '@/store/productStore';

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
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
               <DialogHeader className="bg-white dark:bg-gray-900">
                  <DialogTitle className="text-xl font-bold text-gray-900 dark:text-white">{product.name}</DialogTitle>
               </DialogHeader>
               <div className="space-y-6 bg-white dark:bg-gray-900">
                  {/* Product Info */}
                  <div className="flex items-start justify-between bg-white dark:bg-gray-900">
                     <div className="space-y-2">
                        <div className="flex items-center gap-2">
                           <Badge variant="outline">{product.type}</Badge>
                           <Badge className={isOutOfStock ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}>{isOutOfStock ? 'Habis' : `${product.accounts_unsold_count} tersedia`}</Badge>
                        </div>
                        <div className="text-3xl font-bold text-primary">{formatPrice(product.price)}</div>
                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                           <Clock className="h-4 w-4" />
                           <span>{product.name.includes('Lifetime') ? 'Akses Seumur Hidup' : '1 Bulan'}</span>
                        </div>
                     </div>
                  </div>

                  {/* Description */}
                  <div className="bg-white dark:bg-gray-900">
                     <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Deskripsi</h3>
                     <p className="text-sm text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-900">{product.description}</p>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="bg-white dark:bg-gray-900">
                     <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Syarat & Ketentuan</h3>
                     <div className="text-sm text-gray-600 dark:text-gray-400 prose prose-sm max-w-none bg-white dark:bg-gray-900" dangerouslySetInnerHTML={{ __html: product.tnc }} />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 pt-4 bg-white dark:bg-gray-900">
                     <Button className="flex-1" onClick={handleBuyNow} disabled={isOutOfStock} size="lg" aria-label={isOutOfStock ? `${product.name} sudah habis` : `Beli ${product.name} seharga ${formatPrice(product.price)}`}>
                        <ShoppingCart className="mr-2 h-5 w-5" />
                        {isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}
                     </Button>
                     <Button variant="outline" onClick={() => setOpen(false)} size="lg" aria-label="Tutup dialog detail produk">
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
