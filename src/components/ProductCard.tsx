import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/types/api';
import { ShoppingCart, Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import { ProductModal } from './ProductModal';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductCardProps {
   product: Product;
   onBuyNow: (product: Product) => void;
}

export function ProductCard({ product, onBuyNow }: ProductCardProps) {
   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price);
   };

   const isOutOfStock = product.accounts_unsold_count === 0;

   return (
      <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:hover:border-purple-700">
         <div className="relative h-48 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
            {product.image ? (
               <Image src={`${API_BASE_URL}/upload/product/${product.image}`} alt={product.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" />
            ) : (
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-30">
                     {product.type === 'Canva' && '🎨'}
                     {product.type === 'Spotify' && '🎵'}
                     {product.type === 'Netflix' && '🎬'}
                     {product.type === 'YouTube' && '📺'}
                  </div>
               </div>
            )}
            <div className="absolute top-4 right-4">
               <Badge className={isOutOfStock ? 'bg-red-500 text-white' : 'bg-purple-200 dark:bg-purple-800 text-purple-700 dark:text-purple-300 border-purple-300 dark:border-purple-700'}>
                  {isOutOfStock ? 'Habis' : `${product.accounts_unsold_count} tersedia`}
               </Badge>
            </div>
         </div>

         <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
               <div className="space-y-1">
                  <CardTitle className="text-lg font-semibold line-clamp-2 text-purple-800 dark:text-purple-200">{product.name}</CardTitle>
                  <CardDescription className="text-sm text-purple-600 dark:text-purple-400">{product.type}</CardDescription>
               </div>
               <div className="text-right">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{formatPrice(product.price)}</div>
               </div>
            </div>
         </CardHeader>

         <CardContent className="pb-4">
            <p className="text-sm text-muted-foreground line-clamp-3">{product.description}</p>

            <div className="mt-4 flex items-center gap-2 text-xs text-purple-500 dark:text-purple-400">
               <Clock className="h-3 w-3" />
               <span>{product.name.includes('Lifetime') ? 'Akses Seumur Hidup' : '1 Bulan'}</span>
            </div>
         </CardContent>

         <CardFooter className="pt-0">
            <div className="flex gap-2 w-full">
               <ProductModal product={product}>
                  <Button variant="outline" className="flex-1 border-purple-300 dark:border-purple-700 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/50" aria-label={`Lihat detail ${product.name}`}>
                     <Eye className="mr-2 h-4 w-4" />
                     Detail
                  </Button>
               </ProductModal>
               <Button
                  className="flex-1 bg-purple-500 hover:bg-purple-600 text-white"
                  onClick={() => onBuyNow(product)}
                  disabled={isOutOfStock}
                  aria-label={isOutOfStock ? `${product.name} sudah habis` : `Beli ${product.name} seharga ${formatPrice(product.price)}`}
               >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  {isOutOfStock ? 'Habis' : 'Beli'}
               </Button>
            </div>
         </CardFooter>
      </Card>
   );
}

export function ProductGrid({ products, onBuyNow }: { products: Product[]; onBuyNow: (product: Product) => void }) {
   return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
         {products.map((product) => (
            <ProductCard key={product.id} product={product} onBuyNow={onBuyNow} />
         ))}
      </div>
   );
}
