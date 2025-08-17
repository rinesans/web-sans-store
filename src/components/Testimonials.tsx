import { Card, CardContent } from '@/components/ui/card';
import { Star, Quote } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const testimonials = [
   {
      id: 1,
      name: 'Ahmad Rizki',
      role: 'Content Creator',
      content: 'Sangat puas dengan layanan ini! Akun Canva Pro langsung aktif dan semua fitur premium tersedia. Harga sangat terjangkau untuk kualitas yang didapat.',
      rating: 5,
      product: 'Canva Pro',
   },
   {
      id: 2,
      name: 'Sarah Putri',
      role: 'Mahasiswa',
      content: 'Spotify Premium yang saya beli berfungsi sempurna. Tidak ada lag atau masalah sama sekali. Sangat recommended untuk yang suka musik!',
      rating: 5,
      product: 'Spotify Premium',
   },
   {
      id: 3,
      name: 'Budi Santoso',
      role: 'Freelancer',
      content: 'Netflix Premium dengan kualitas 4K yang smooth. Customer service juga sangat responsif dan membantu. Akan beli lagi di sini!',
      rating: 5,
      product: 'Netflix Premium',
   },
   {
      id: 4,
      name: 'Dewi Sari',
      role: 'Designer',
      content: 'Canva Lifetime yang saya beli sangat worth it! Hemat jangka panjang dan semua template premium tersedia. Terima kasih!',
      rating: 5,
      product: 'Canva Lifetime',
   },
   {
      id: 5,
      name: 'Rendi Pratama',
      role: 'YouTuber',
      content: 'YouTube Premium tanpa iklan sangat membantu untuk content creation. Background play juga berfungsi dengan baik. Highly recommended!',
      rating: 5,
      product: 'YouTube Premium',
   },
   {
      id: 6,
      name: 'Maya Indah',
      role: 'Business Owner',
      content: 'Layanan yang sangat terpercaya. Pembayaran aman dan akun langsung aktif. Sudah beberapa kali beli dan selalu puas!',
      rating: 5,
      product: 'Multiple Products',
   },
];

export function Testimonials() {
   return (
      <section className="py-16 bg-muted/30">
         <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">Testimoni Pelanggan</h2>
               <p className="text-muted-foreground max-w-2xl mx-auto">Lihat apa kata pelanggan kami tentang layanan premium yang kami sediakan</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
               {testimonials.map((testimonial) => (
                  <Card key={testimonial.id} className="relative">
                     <CardContent className="p-6">
                        <div className="flex items-center gap-1 mb-4">
                           {[...Array(testimonial.rating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                           ))}
                        </div>

                        <div className="relative mb-4">
                           <Quote className="h-8 w-8 text-muted-foreground/20 absolute -top-2 -left-2" />
                           <p className="text-sm text-muted-foreground leading-relaxed pl-4">&quot;{testimonial.content}&quot;</p>
                        </div>

                        <div className="flex items-center justify-between">
                           <div>
                              <h4 className="font-semibold text-sm">{testimonial.name}</h4>
                              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                           </div>
                           <Badge variant="secondary" className="text-xs">
                              {testimonial.product}
                           </Badge>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            <div className="text-center mt-12">
               <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium">
                  <Star className="h-4 w-4" />
                  <span>4.9/5 Rating dari 200+ Pelanggan</span>
               </div>
            </div>
         </div>
      </section>
   );
}
