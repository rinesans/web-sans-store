'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { LoadingSpinner } from '@/components/LoadingSpinner';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/services/api';
import { Product } from '@/types/api';
import { useProductStore } from '@/store/productStore';
import { TransactionService } from '@/services/transactionService';

import { ArrowLeft, ShoppingCart, Star, Shield, Zap, Clock, CheckCircle, Crown, RefreshCw, Sparkles, Award, Users } from 'lucide-react';
import Image from 'next/image';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function ProductDetailPage() {
   const params = useParams();
   const router = useRouter();
   const [product, setProduct] = useState<Product | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [isProcessing, setIsProcessing] = useState(false);

   // Set page title
   useEffect(() => {
      const title = product ? `${product.name} - Detail Produk - Toko Sans` : 'Detail Produk - Toko Sans';
      document.title = title;
   }, [product]);

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setLoading(true);
            const productSlug = params.slug as string;

            const response = await apiService.getProductInfo();
            const foundProduct = response.data.find((p) => p.slug === productSlug);

            if (!foundProduct) {
               setError('Produk tidak ditemukan');
               return;
            }

            setProduct(foundProduct);
         } catch (err) {
            setError('Gagal memuat data produk. Silakan coba lagi.');
            console.error('Error fetching product:', err);
         } finally {
            setLoading(false);
         }
      };

      if (params.slug) {
         fetchProduct();
      }
   }, [params.slug]);

   useEffect(() => {
      const transactionInProgress = sessionStorage.getItem('transaction_in_progress');
      if (transactionInProgress) {
         console.log('🧹 Clearing stale transaction_in_progress flag');
         sessionStorage.removeItem('transaction_in_progress');
      }
   }, []);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price);
   };

   const handleBuyNow = async () => {
      if (isProcessing) {
         console.log('⚠️ Transaction already in progress, ignoring duplicate click');
         return;
      }

      const transactionInProgress = sessionStorage.getItem('transaction_in_progress');
      if (transactionInProgress) {
         console.log('⚠️ Transaction already in progress (sessionStorage), ignoring click');
         return;
      }

      if (!product) {
         alert('Produk tidak tersedia');
         return;
      }

      if (product.accounts_unsold_count === 0) {
         alert('Maaf, stok produk sudah habis');
         return;
      }

      try {
         setIsProcessing(true);
         sessionStorage.setItem('transaction_in_progress', 'true');

         console.log('🔄 Starting transaction process...');
         console.log('📊 Current stock:', product.accounts_unsold_count);

         const invoice = `WEB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
         console.log('📝 Generated invoice:', invoice);

         console.log('🔍 Step 1: Pre-payment validation...');
         const validationResult = await TransactionService.validateBeforePayment(product.id.toString(), invoice, 'Web User');

         if (!validationResult.success) {
            console.error('❌ Validation failed:', validationResult.error);

            if (validationResult.error?.includes('akun yang tersedia') || validationResult.error?.includes('stok')) {
               alert('Maaf, stok produk sudah habis. Silakan refresh halaman untuk melihat stok terbaru.');
               window.location.reload();
               return;
            }

            alert(`Validasi transaksi gagal: ${validationResult.error}`);
            return;
         }

         console.log('✅ Validation successful, creating TokoPay order');

         const transactionData = {
            invoice: invoice,
            status: null,
            status_text: 'Menunggu Pembayaran',
            total_paid: product.price,
            method: 'QRIS',
            pay_time: null,
            created_at: new Date().toISOString(),
            buyer_name: 'Web User',
            phone_number: null,
            product: {
               name: product.name,
               price: product.price,
               description: product.description,
               is_manual_order: false,
            },
            tokoPay: null,
         };

         const transactionInfo = {
            invoice: invoice,
            productId: product.id.toString(),
            productName: product.name,
            buyerName: 'Web User',
            nominal: product.price,
            created_at: transactionData.created_at,
         };
         sessionStorage.setItem(`transaction_info_${invoice}`, JSON.stringify(transactionInfo));
         console.log('✅ Transaction info saved to sessionStorage for invoice page');

         console.log('✅ Transaction created, navigating to invoice detail (pending payment not saved to localStorage)');

         sessionStorage.removeItem('transaction_in_progress');
         router.push(`/invoice/${invoice}`);
      } catch (error) {
         console.error('Error creating transaction:', error);

         if (error instanceof Error && (error.message.includes('akun yang tersedia') || error.message.includes('stok'))) {
            alert('Maaf, stok produk sudah habis. Silakan refresh halaman untuk melihat stok terbaru.');
            window.location.reload();
            return;
         }

         alert('Terjadi kesalahan saat membuat transaksi');
      } finally {
         setIsProcessing(false);
         sessionStorage.removeItem('transaction_in_progress');
      }
   };

   const handleBack = () => {
      router.push('/');
   };

   if (loading) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 flex items-center justify-center">
               <LoadingSpinner size="lg" />
            </div>
         </div>
      );
   }

   if (error || !product) {
      return (
         <div className="min-h-screen flex flex-col">
            <Header />
            <div className="flex-1 container mx-auto px-4 py-8">
               <Button variant="outline" onClick={handleBack} className="mb-6">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali ke Beranda
               </Button>
               <Card className="w-full max-w-md mx-auto">
                  <CardHeader>
                     <CardTitle className="text-red-600">Error</CardTitle>
                     <CardDescription>{error || 'Produk tidak ditemukan'}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button onClick={handleBack} className="w-full">
                        Kembali ke Beranda
                     </Button>
                  </CardContent>
               </Card>
            </div>
            <Footer />
         </div>
      );
   }

   const isOutOfStock = product.accounts_unsold_count === 0;

   return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
         <Header />

         <div className="flex-1 container mx-auto px-4 py-6 sm:py-8">
            {/* Back Button */}
            <Button variant="outline" onClick={handleBack} className="mb-4 sm:mb-6 group hover:bg-primary hover:text-primary-foreground transition-all duration-200">
               <ArrowLeft className="mr-2 h-4 w-4 group-hover:-translate-x-1 transition-transform duration-200" />
               Kembali ke Beranda
            </Button>

            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
               {/* Product Image Section */}
               <div className="space-y-6">
                  <Card className="overflow-hidden border-0 shadow-xl bg-card/80 backdrop-blur-sm dark:bg-card/80">
                     <div className="relative h-64 sm:h-80 lg:h-96 bg-gradient-to-br from-primary/10 via-primary/5 to-purple-500/10 dark:from-primary/20 dark:via-primary/10 dark:to-purple-500/20">
                        {product.image ? (
                           <Image src={`${API_BASE_URL}/upload/product/${product.image}`} alt={product.name} fill className="object-cover transition-transform duration-300 hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" />
                        ) : (
                           <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-6xl sm:text-8xl opacity-30 animate-pulse">
                                 {product.type === 'Canva' && '🎨'}
                                 {product.type === 'Spotify' && '🎵'}
                                 {product.type === 'Netflix' && '🎬'}
                                 {product.type === 'YouTube' && '📺'}
                                 {product.type === 'CapCut' && '✂️'}
                              </div>
                           </div>
                        )}

                        {/* Stock Badge */}
                        <div className="absolute top-3 right-3 sm:top-4 sm:right-4">
                           <Badge className={`px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium ${isOutOfStock ? 'bg-red-500 text-white shadow-lg' : 'bg-green-500 text-white shadow-lg'}`}>
                              {isOutOfStock ? 'Habis' : `${product.accounts_unsold_count} tersedia`}
                           </Badge>
                        </div>

                        {/* Premium Badge */}
                        <div className="absolute top-3 left-3 sm:top-4 sm:left-4">
                           <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm font-medium shadow-lg">
                              <Crown className="mr-1 h-3 w-3" />
                              Premium
                           </Badge>
                        </div>
                     </div>
                  </Card>

                  {/* Product Type Badge */}
                  <div className="flex items-center gap-3">
                     <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-md dark:bg-card/80">
                        <Crown className="h-5 w-5 text-primary" />
                        <Badge variant="outline" className="text-sm border-primary/30 text-primary bg-card/50 dark:bg-card/50">
                           {product.type}
                        </Badge>
                     </div>
                  </div>
               </div>

               {/* Product Details Section */}
               <div className="space-y-6">
                  {/* Title and Description */}
                  <div className="space-y-4">
                     <div>
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent leading-tight">{product.name}</h1>
                        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg leading-relaxed">{product.description}</p>
                     </div>

                     {/* Price Section */}
                     <Card className="bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 dark:from-primary/10 dark:to-purple-500/10 dark:border-primary/30">
                        <CardContent className="p-4 sm:p-6">
                           <div className="text-center">
                              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary mb-2">{formatPrice(product.price)}</div>
                              <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-muted-foreground">
                                 <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                                 <span>{product.name.includes('Lifetime') ? 'Akses Seumur Hidup' : '1 Bulan'}</span>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  {/* Features */}
                  <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-primary">
                           <Star className="h-5 w-5" />
                           Fitur Premium
                        </CardTitle>
                     </CardHeader>
                     <CardContent>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800/50">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-foreground">Akses penuh ke semua fitur premium</span>
                           </div>
                           <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800/50">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-foreground">Tanpa iklan dan batasan</span>
                           </div>
                           <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800/50">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-foreground">Kualitas terbaik dan original</span>
                           </div>
                           <div className="flex items-center gap-3 p-3 rounded-lg bg-green-50 border border-green-200 dark:bg-green-950/30 dark:border-green-800/50">
                              <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                              <span className="text-sm text-foreground">Aktivasi instan setelah pembayaran</span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>

                  {/* Buy Button Section */}
                  <div className="space-y-4">
                     <Button
                        size="lg"
                        className="w-full h-14 text-lg font-semibold bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        onClick={handleBuyNow}
                        disabled={isOutOfStock || isProcessing}
                     >
                        {isProcessing ? (
                           <>
                              <RefreshCw className="mr-2 h-5 w-5 animate-spin" />
                              Memproses...
                           </>
                        ) : (
                           <>
                              <ShoppingCart className="mr-2 h-5 w-5" />
                              {isOutOfStock ? 'Stok Habis' : 'Beli Sekarang'}
                           </>
                        )}
                     </Button>

                     {!isOutOfStock && (
                        <p className="text-sm text-muted-foreground text-center bg-card/50 backdrop-blur-sm p-3 rounded-lg border border-primary/10 dark:bg-card/50 dark:border-primary/20">
                           ⚡ Setelah pembayaran berhasil, akun premium Anda akan langsung aktif
                        </p>
                     )}
                  </div>
               </div>
            </div>

            {/* Trust Indicators */}
            <div className="mt-16 space-y-8">
               <Separator className="bg-primary/20 dark:bg-primary/30" />

               <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Mengapa Memilih Kami?</h2>
                  <p className="text-muted-foreground">Platform terpercaya dengan ribuan pelanggan puas</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="text-center p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 dark:bg-card/80 dark:border-primary/30">
                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Shield className="h-8 w-8 text-white" />
                     </div>
                     <CardTitle className="mb-3 text-lg text-foreground">100% Aman</CardTitle>
                     <CardDescription className="text-sm leading-relaxed">Transaksi aman dengan sistem pembayaran terpercaya dan perlindungan data pribadi Anda</CardDescription>
                  </Card>

                  <Card className="text-center p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 dark:bg-card/80 dark:border-primary/30">
                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Zap className="h-8 w-8 text-white" />
                     </div>
                     <CardTitle className="mb-3 text-lg text-foreground">Aktivasi Instan</CardTitle>
                     <CardDescription className="text-sm leading-relaxed">Setelah pembayaran berhasil, akun premium Anda akan langsung aktif dan siap digunakan</CardDescription>
                  </Card>

                  <Card className="text-center p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 dark:bg-card/80 dark:border-primary/30">
                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Award className="h-8 w-8 text-white" />
                     </div>
                     <CardTitle className="mb-3 text-lg text-foreground">Kualitas Premium</CardTitle>
                     <CardDescription className="text-sm leading-relaxed">Semua akun yang kami jual adalah akun original dengan kualitas premium dan garansi</CardDescription>
                  </Card>
               </div>
            </div>
         </div>

         <Footer />
      </div>
   );
}
