'use client';

import { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronDown, ChevronUp, HelpCircle, MessageCircle, Clock, Users } from 'lucide-react';

interface FAQItem {
   question: string;
   answer: string;
   category: string;
}

const faqData: FAQItem[] = [
   {
      question: 'Bagaimana cara membeli akun premium?',
      answer: "Pilih produk yang diinginkan, klik 'Beli Sekarang', lalu ikuti proses pembayaran melalui QRIS. Setelah pembayaran berhasil, akun akan langsung aktif.",
      category: 'Pembelian',
   },
   {
      question: 'Berapa lama waktu aktivasi akun?',
      answer: 'Akun premium akan langsung aktif setelah pembayaran berhasil. Biasanya dalam waktu 1-5 menit setelah pembayaran dikonfirmasi.',
      category: 'Aktivasi',
   },
   {
      question: 'Apakah akun yang dijual original?',
      answer: 'Ya, semua akun yang kami jual adalah akun original dengan kualitas premium. Kami tidak menjual akun bajakan atau ilegal.',
      category: 'Kualitas',
   },
   {
      question: 'Bagaimana jika akun tidak bisa login?',
      answer: 'Jika mengalami masalah login, silakan hubungi kami melalui Telegram atau email. Kami akan membantu menyelesaikan masalah tersebut.',
      category: 'Dukungan',
   },
   {
      question: 'Apakah ada garansi untuk akun?',
      answer: 'Ya, kami memberikan garansi penggantian akun jika terjadi masalah dalam 24 jam pertama setelah pembelian.',
      category: 'Garansi',
   },
   {
      question: 'Metode pembayaran apa saja yang tersedia?',
      answer: 'Saat ini kami menerima pembayaran melalui QRIS yang mendukung berbagai e-wallet dan mobile banking.',
      category: 'Pembayaran',
   },
   {
      question: 'Berapa lama masa berlaku akun?',
      answer: 'Masa berlaku tergantung produk yang dibeli. Ada produk 1 bulan dan lifetime. Informasi detail ada di deskripsi produk.',
      category: 'Durasi',
   },
   {
      question: 'Bagaimana cara cek status transaksi?',
      answer: "Anda bisa mengecek status transaksi di halaman 'Cari Transaksi' dengan memasukkan nomor invoice yang diberikan.",
      category: 'Transaksi',
   },
   {
      question: 'Apakah data pribadi saya aman?',
      answer: 'Ya, kami menjaga kerahasiaan data pribadi Anda. Data hanya digunakan untuk keperluan transaksi dan tidak akan dibagikan ke pihak ketiga.',
      category: 'Keamanan',
   },
   {
      question: 'Bagaimana jika stok habis?',
      answer: 'Jika stok habis, Anda bisa menunggu hingga stok tersedia kembali atau menghubungi kami untuk informasi lebih lanjut.',
      category: 'Stok',
   },
   {
      question: 'Apakah bisa refund jika tidak puas?',
      answer: 'Kami memberikan garansi penggantian akun jika ada masalah teknis. Namun tidak ada refund uang tunai.',
      category: 'Refund',
   },
   {
      question: 'Bagaimana cara menghubungi customer service?',
      answer: 'Anda bisa menghubungi kami melalui Telegram @tokosans atau email support@tokosans.com untuk bantuan.',
      category: 'Kontak',
   },
];

const categories = ['Semua', 'Pembelian', 'Aktivasi', 'Kualitas', 'Dukungan', 'Garansi', 'Pembayaran', 'Durasi', 'Transaksi', 'Keamanan', 'Stok', 'Refund', 'Kontak'];

export default function FAQPage() {
   const [selectedCategory, setSelectedCategory] = useState('Semua');
   const [openItems, setOpenItems] = useState<number[]>([]);

   // Set page title
   useEffect(() => {
      document.title = 'FAQ - Pertanyaan Umum - Toko Sans';
   }, []);

   const toggleItem = (index: number) => {
      setOpenItems((prev) => (prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]));
   };

   const filteredFAQ = selectedCategory === 'Semua' ? faqData : faqData.filter((item) => item.category === selectedCategory);

   return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
         <Header />

         <div className="flex-1 container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <HelpCircle className="h-8 w-8 text-primary" />
               </div>
               <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Pertanyaan yang Sering Diajukan</h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Temukan jawaban untuk pertanyaan umum seputar layanan kami. Jika tidak menemukan jawaban yang Anda cari, silakan hubungi kami.</p>
            </div>

            {/* Category Filter */}
            <div className="mb-8">
               <div className="flex flex-wrap gap-2 justify-center">
                  {categories.map((category) => (
                     <Button key={category} variant={selectedCategory === category ? 'default' : 'outline'} size="sm" onClick={() => setSelectedCategory(category)} className="transition-all duration-200">
                        {category}
                     </Button>
                  ))}
               </div>
            </div>

            {/* FAQ Items */}
            <div className="max-w-4xl mx-auto space-y-4">
               {filteredFAQ.map((item, index) => (
                  <Card key={index} className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200 dark:bg-card/80 dark:border-primary/30">
                     <CardHeader className="cursor-pointer pb-4" onClick={() => toggleItem(index)}>
                        <div className="flex items-center justify-between">
                           <CardTitle className="text-lg pr-4 text-foreground">{item.question}</CardTitle>
                           <Button variant="ghost" size="sm" className="p-1">
                              {openItems.includes(index) ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                           </Button>
                        </div>
                     </CardHeader>
                     {openItems.includes(index) && (
                        <CardContent className="pt-0">
                           <Separator className="mb-4" />
                           <p className="text-muted-foreground leading-relaxed">{item.answer}</p>
                        </CardContent>
                     )}
                  </Card>
               ))}
            </div>

            {/* Contact Section */}
            <div className="mt-16">
               <Separator className="bg-primary/20 dark:bg-primary/30 mb-8" />

               <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold mb-2 text-foreground">Masih Punya Pertanyaan?</h2>
                  <p className="text-muted-foreground">Tim support kami siap membantu Anda</p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
                  <Card className="text-center p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 dark:bg-card/80 dark:border-primary/30">
                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <MessageCircle className="h-8 w-8 text-white" />
                     </div>
                     <CardTitle className="mb-3 text-lg text-foreground">Telegram</CardTitle>
                     <p className="text-sm text-muted-foreground mb-4">Chat langsung dengan tim support kami</p>
                     <a href="https://t.me/tokosans" target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Button className="w-full">Hubungi via Telegram</Button>
                     </a>
                  </Card>

                  <Card className="text-center p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 dark:bg-card/80 dark:border-primary/30">
                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Clock className="h-8 w-8 text-white" />
                     </div>
                     <CardTitle className="mb-3 text-lg text-foreground">Jam Operasional</CardTitle>
                     <p className="text-sm text-muted-foreground mb-4">
                        Senin - Minggu
                        <br />
                        08:00 - 22:00 WIB
                     </p>
                     <Button variant="outline" className="w-full" disabled>
                        Waktu Indonesia
                     </Button>
                  </Card>

                  <Card className="text-center p-6 bg-card/80 backdrop-blur-sm border-primary/20 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1 dark:bg-card/80 dark:border-primary/30">
                     <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center mb-4 shadow-lg">
                        <Users className="h-8 w-8 text-white" />
                     </div>
                     <CardTitle className="mb-3 text-lg text-foreground">Komunitas</CardTitle>
                     <p className="text-sm text-muted-foreground mb-4">Bergabung dengan komunitas pengguna kami</p>
                     <a href="https://t.me/tokosans" target="_blank" rel="noopener noreferrer" className="inline-block">
                        <Button variant="outline" className="w-full">
                           Gabung Grup
                        </Button>
                     </a>
                  </Card>
               </div>
            </div>
         </div>

         <Footer />
      </div>
   );
}
