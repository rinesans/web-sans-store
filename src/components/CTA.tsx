import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Crown, Zap, Shield, Star } from 'lucide-react';

export function CTA() {
   return (
      <section className="py-16 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
         <div className="container mx-auto px-4">
            <Card className="max-w-4xl mx-auto bg-gradient-to-r from-primary/5 to-secondary/5 border-primary/20">
               <CardContent className="p-12 text-center">
                  <div className="mb-8">
                     <div className="inline-flex items-center space-x-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
                        <Crown className="h-4 w-4" />
                        <span>Limited Time Offer</span>
                     </div>

                     <h2 className="text-4xl md:text-5xl font-bold mb-4">
                        Mulai Nikmati Premium
                        <span className="text-primary block">Hari Ini Juga!</span>
                     </h2>

                     <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
                        Jangan lewatkan kesempatan untuk mengakses fitur premium dari aplikasi favorit Anda dengan harga yang sangat terjangkau. Aktivasi instan dan garansi 100%.
                     </p>
                  </div>

                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                           <Shield className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="text-left">
                           <h4 className="font-semibold">100% Aman</h4>
                           <p className="text-sm text-muted-foreground">Transaksi terpercaya</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                           <Zap className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="text-left">
                           <h4 className="font-semibold">Aktivasi Instan</h4>
                           <p className="text-sm text-muted-foreground">Langsung bisa digunakan</p>
                        </div>
                     </div>

                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center">
                           <Star className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="text-left">
                           <h4 className="font-semibold">Kualitas Premium</h4>
                           <p className="text-sm text-muted-foreground">Akun original</p>
                        </div>
                     </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <Button size="lg" className="text-lg px-8 py-6">
                        <Crown className="mr-2 h-5 w-5" />
                        Mulai Belanja Sekarang
                     </Button>
                     <Button variant="outline" size="lg" className="text-lg px-8 py-6">
                        Lihat Semua Produk
                     </Button>
                  </div>

                  <p className="text-sm text-muted-foreground mt-6">⚡ Lebih dari 200+ pelanggan puas • 🔒 Pembayaran 100% aman • ⭐ Rating 4.9/5</p>
               </CardContent>
            </Card>
         </div>
      </section>
   );
}
