'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Hero } from '@/components/Hero';
import { ProductGrid } from '@/components/ProductCard';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Testimonials } from '@/components/Testimonials';
import { apiService } from '@/services/api';
import { CardInfoResponse, Product } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Shield, Zap, Star } from 'lucide-react';

export default function Home() {
   const router = useRouter();
   const [cardInfo, setCardInfo] = useState<CardInfoResponse['data'] | null>(null);
   const [products, setProducts] = useState<Product[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Set page title
   useEffect(() => {
      document.title = 'Toko Sans - Akses Premium Apps';
   }, []);

   useEffect(() => {
      const fetchData = async () => {
         try {
            setLoading(true);
            const [cardInfoResponse, productInfoResponse] = await Promise.all([apiService.getCardInfo(), apiService.getProductInfo()]);

            setCardInfo(cardInfoResponse.data);
            setProducts(productInfoResponse.data);
         } catch (err) {
            setError('Gagal memuat data. Silakan coba lagi.');
            console.error('Error fetching data:', err);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   const handleBuyNow = (product: Product) => {
      // Navigate to product detail page
      router.push(`/beli/${product.slug}`);
   };

   if (loading) {
      return (
         <div className="min-h-screen">
            <Header />
            <div className="flex items-center justify-center min-h-[60vh]">
               <LoadingSpinner size="lg" />
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen">
            <Header />
            <div className="flex items-center justify-center min-h-[60vh]">
               <Card className="w-full max-w-md">
                  <CardHeader>
                     <CardTitle className="text-red-600">Error</CardTitle>
                     <CardDescription>{error}</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <Button onClick={() => window.location.reload()} className="w-full">
                        Coba Lagi
                     </Button>
                  </CardContent>
               </Card>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         <Header />
         <Hero />

         {/* Products Section */}
         <section className="py-16">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Produk Premium</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">Pilih aplikasi premium favorit Anda dan nikmati fitur-fitur eksklusif dengan harga yang sangat terjangkau</p>
               </div>

               {products.length > 0 ? (
                  <ProductGrid products={products} onBuyNow={handleBuyNow} />
               ) : (
                  <div className="text-center py-12">
                     <Crown className="mx-auto h-12 w-12 text-primary mb-4" />
                     <p className="text-muted-foreground">Tidak ada produk tersedia saat ini</p>
                  </div>
               )}
            </div>
         </section>

         {/* Testimonials Section */}
         <Testimonials />

         {/* CTA Section
         <CTA /> */}

         {/* Features Section */}
         <section className="py-16 bg-gradient-to-br from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold mb-4 text-foreground">Mengapa Memilih Kami?</h2>
                  <p className="text-muted-foreground">Kami berkomitmen memberikan layanan terbaik untuk Anda</p>
               </div>

               <div className="grid md:grid-cols-3 gap-8">
                  <Card className="text-center p-6 border-primary/20 dark:border-primary/30 bg-card/90 backdrop-blur-sm shadow-md hover:shadow-lg dark:bg-card/90">
                     <div className="mx-auto w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Shield className="h-6 w-6 text-primary" />
                     </div>
                     <CardTitle className="mb-2 text-foreground">100% Aman</CardTitle>
                     <CardDescription className="text-muted-foreground">Transaksi aman dengan sistem pembayaran terpercaya dan perlindungan data pribadi Anda</CardDescription>
                  </Card>

                  <Card className="text-center p-6 border-primary/20 dark:border-primary/30 bg-card/90 backdrop-blur-sm shadow-md hover:shadow-lg dark:bg-card/90">
                     <div className="mx-auto w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Zap className="h-6 w-6 text-primary" />
                     </div>
                     <CardTitle className="mb-2 text-foreground">Aktivasi Instan</CardTitle>
                     <CardDescription className="text-muted-foreground">Setelah pembayaran berhasil, akun premium Anda akan langsung aktif dan siap digunakan</CardDescription>
                  </Card>

                  <Card className="text-center p-6 border-primary/20 dark:border-primary/30 bg-card/90 backdrop-blur-sm shadow-md hover:shadow-lg dark:bg-card/90">
                     <div className="mx-auto w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center mb-4 shadow-sm">
                        <Star className="h-6 w-6 text-primary" />
                     </div>
                     <CardTitle className="mb-2 text-foreground">Kualitas Premium</CardTitle>
                     <CardDescription className="text-muted-foreground">Semua akun yang kami jual adalah akun original dengan kualitas premium dan garansi</CardDescription>
                  </Card>
               </div>
            </div>
         </section>

         {/* FAQ Section */}
         {/* <FAQ /> */}

         <Footer />
      </div>
   );
}
