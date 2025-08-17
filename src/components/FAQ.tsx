'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';

const faqs = [
   {
      id: 1,
      question: 'Apakah akun yang dijual original?',
      answer: 'Ya, semua akun yang kami jual adalah akun original dan resmi dari platform terkait. Kami tidak menjual akun bajakan atau ilegal.',
   },
   {
      id: 2,
      question: 'Berapa lama waktu aktivasi setelah pembayaran?',
      answer: 'Aktivasi dilakukan secara instan setelah pembayaran berhasil. Biasanya dalam waktu 1-5 menit, akun premium Anda sudah bisa digunakan.',
   },
   {
      id: 3,
      question: 'Apakah ada garansi untuk akun yang dibeli?',
      answer: 'Ya, kami memberikan garansi penggantian jika ada masalah dengan akun dalam waktu 24 jam setelah pembelian. Customer service kami siap membantu.',
   },
   {
      id: 4,
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Kami menerima berbagai metode pembayaran seperti transfer bank, e-wallet (OVO, DANA, GoPay), dan QRIS untuk kemudahan transaksi.',
   },
   {
      id: 5,
      question: 'Apakah bisa mengganti email/password akun?',
      answer: 'Untuk akun yang disediakan oleh kami, tidak disarankan untuk mengganti email atau password untuk menghindari masalah akses.',
   },
   {
      id: 6,
      question: 'Bagaimana jika akun tidak bisa diakses?',
      answer: 'Jika mengalami masalah akses, segera hubungi customer service kami melalui WhatsApp atau email. Kami akan membantu menyelesaikan masalah tersebut.',
   },
   {
      id: 7,
      question: 'Apakah ada batasan penggunaan akun?',
      answer: 'Akun premium yang kami jual mengikuti kebijakan penggunaan dari platform terkait. Gunakan sesuai dengan Terms of Service masing-masing platform.',
   },
   {
      id: 8,
      question: 'Bisakah membeli untuk hadiah orang lain?',
      answer: 'Tentu bisa! Anda bisa memberikan akun premium sebagai hadiah. Pastikan untuk memberikan informasi yang benar saat checkout.',
   },
];

interface FAQItemProps {
   faq: {
      id: number;
      question: string;
      answer: string;
   };
}

function FAQItem({ faq }: FAQItemProps) {
   const [isOpen, setIsOpen] = useState(false);

   return (
      <Card className="border-l-4 border-l-primary">
         <CardHeader className="pb-3">
            <CardTitle className="text-lg cursor-pointer flex items-center justify-between" onClick={() => setIsOpen(!isOpen)}>
               {faq.question}
               <Button variant="ghost" size="sm" className="p-0 h-auto">
                  {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
               </Button>
            </CardTitle>
         </CardHeader>
         {isOpen && (
            <CardContent className="pt-0">
               <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </CardContent>
         )}
      </Card>
   );
}

export function FAQ() {
   return (
      <section className="py-16">
         <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl font-bold mb-4">Pertanyaan yang Sering Diajukan</h2>
               <p className="text-muted-foreground max-w-2xl mx-auto">Temukan jawaban untuk pertanyaan umum seputar layanan premium kami</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-4">
               {faqs.map((faq) => (
                  <FAQItem key={faq.id} faq={faq} />
               ))}
            </div>

            <div className="text-center mt-12">
               <p className="text-muted-foreground mb-4">Masih punya pertanyaan? Hubungi customer service kami</p>
               <Button size="lg">Hubungi Kami</Button>
            </div>
         </div>
      </section>
   );
}
