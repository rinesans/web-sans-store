import { Button } from '@/components/ui/button';
import { Crown, Shield, Zap, HelpCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Logo } from './Logo';

export function Hero() {
   return (
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-primary/5 dark:from-primary/20 dark:via-background dark:to-primary/10 py-20">
         <div className="container mx-auto px-4">
            <div className="text-center space-y-8">
               <div className="space-y-4">
                  <div className="inline-flex items-center space-x-0 bg-primary/20 dark:bg-primary/30 text-primary dark:text-primary px-4 py-2 rounded-full text-sm font-medium shadow-sm">
                     <Logo />
                     <span>Toko Sans</span>
                  </div>

                  <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                     Akses Premium Apps
                     <span className="text-primary dark:text-primary block">Dengan Harga Terjangkau</span>
                  </h1>

                  <p className="text-xl text-muted-foreground max-w-3xl mx-auto">Dapatkan akses ke aplikasi premium favorit Anda seperti Canva Pro, Spotify Premium, Netflix, dan banyak lagi dengan harga yang sangat terjangkau.</p>
               </div>

               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" className="text-lg px-8 py-6 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all">
                     <ShoppingCart className="mr-2 h-5 w-5" />
                     Mulai Belanja
                  </Button>
                  <Link href="/faq">
                     <Button variant="outline" size="lg" className="text-lg px-8 py-6 border-primary/30 dark:border-primary/50 text-primary dark:text-primary hover:bg-primary/10 dark:hover:bg-primary/20">
                        <HelpCircle className="mr-2 h-5 w-5" />
                        FAQ
                     </Button>
                  </Link>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
                  <div className="text-center space-y-2">
                     <div className="mx-auto w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center shadow-sm">
                        <Shield className="h-6 w-6 text-primary dark:text-primary" />
                     </div>
                     <h3 className="font-semibold text-primary dark:text-primary">100% Aman</h3>
                     <p className="text-sm text-muted-foreground">Transaksi aman dan terpercaya</p>
                  </div>

                  <div className="text-center space-y-2">
                     <div className="mx-auto w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center shadow-sm">
                        <Zap className="h-6 w-6 text-primary dark:text-primary" />
                     </div>
                     <h3 className="font-semibold text-primary dark:text-primary">Instan</h3>
                     <p className="text-sm text-muted-foreground">Aktivasi langsung setelah pembayaran</p>
                  </div>

                  <div className="text-center space-y-2">
                     <div className="mx-auto w-12 h-12 bg-primary/20 dark:bg-primary/30 rounded-full flex items-center justify-center shadow-sm">
                        <Crown className="h-6 w-6 text-primary dark:text-primary" />
                     </div>
                     <h3 className="font-semibold text-primary dark:text-primary">Premium Quality</h3>
                     <p className="text-sm text-muted-foreground">Akun original dan berkualitas tinggi</p>
                  </div>
               </div>
            </div>
         </div>
      </section>
   );
}
