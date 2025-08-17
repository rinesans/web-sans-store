/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, Shield, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';

export default function SNKPage() {
   return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
         <Header />

         <div className="flex-1 container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <FileText className="h-8 w-8 text-primary" />
               </div>
               <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Syarat & Ketentuan</h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Silakan baca dengan seksama syarat dan ketentuan penggunaan layanan Toko Sans sebelum melakukan transaksi.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
               {/* Definisi */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        Definisi
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-2">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           <strong>1. Toko Sans</strong> adalah platform penjualan akun premium digital yang beroperasi melalui website resmi.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           <strong>2. Pengguna</strong> adalah individu yang mengakses dan menggunakan layanan Toko Sans.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           <strong>3. Produk</strong> adalah akun premium digital yang dijual melalui platform Toko Sans.
                        </p>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                           <strong>4. Transaksi</strong> adalah proses pembelian produk yang dilakukan oleh pengguna.
                        </p>
                     </div>
                  </CardContent>
               </Card>

               {/* Ketentuan Umum */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Ketentuan Umum
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Pengguna harus berusia minimal 17 tahun atau telah mendapat izin dari orang tua/wali untuk melakukan transaksi.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Pengguna wajib memberikan informasi yang akurat dan valid saat melakukan transaksi.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Pengguna dilarang menggunakan layanan untuk tujuan ilegal atau melanggar hukum yang berlaku.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Toko Sans berhak menolak atau membatalkan transaksi yang mencurigakan atau melanggar ketentuan.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Ketentuan Pembelian */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        Ketentuan Pembelian
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Pembayaran dilakukan melalui metode QRIS yang tersedia di platform.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Akun premium akan aktif setelah pembayaran berhasil dikonfirmasi.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Masa berlaku akun sesuai dengan paket yang dipilih (1 bulan atau lifetime).</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Stok produk dapat berubah sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Garansi dan Pengembalian */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Garansi dan Pengembalian
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Garansi penggantian akun berlaku selama 24 jam setelah pembelian jika terjadi masalah teknis.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Penggantian akun tidak berlaku jika masalah disebabkan oleh kesalahan pengguna.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Tidak ada pengembalian dana tunai untuk transaksi yang telah selesai.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Klaim garansi harus disertai bukti transaksi dan screenshot masalah yang dialami.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Pembatasan dan Larangan */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-red-600">
                        <AlertTriangle className="h-5 w-5" />
                        Pembatasan dan Larangan
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Dilarang menggunakan akun untuk aktivitas ilegal atau melanggar ToS platform asli.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Dilarang membagikan atau menjual kembali akun kepada pihak ketiga.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Dilarang melakukan penyalahgunaan atau eksploitasi terhadap layanan Toko Sans.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Dilarang melakukan transaksi dengan menggunakan metode pembayaran yang tidak sah.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Privasi dan Keamanan */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Privasi dan Keamanan
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Data pribadi pengguna akan dijaga kerahasiaannya dan tidak akan dibagikan ke pihak ketiga.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Informasi pembayaran diproses melalui sistem yang aman dan terenkripsi.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Pengguna bertanggung jawab atas keamanan akun yang dibeli.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Toko Sans tidak bertanggung jawab atas kerugian akibat kelalaian pengguna.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Perubahan Ketentuan */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Perubahan Ketentuan
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Toko Sans berhak mengubah syarat dan ketentuan sewaktu-waktu tanpa pemberitahuan terlebih dahulu.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Perubahan ketentuan akan diumumkan melalui website resmi Toko Sans.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Penggunaan layanan setelah perubahan ketentuan dianggap sebagai persetujuan terhadap ketentuan baru.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Kontak */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        Kontak dan Dukungan
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Untuk pertanyaan atau bantuan, silakan hubungi kami melalui Telegram @tokosans.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Jam operasional: Senin - Minggu, 08:00 - 22:00 WIB.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Email: support@tokosans.com</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Disclaimer */}
               <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                     <AlertTriangle className="h-6 w-6 text-yellow-600 mt-0.5 flex-shrink-0" />
                     <div>
                        <h3 className="font-semibold text-yellow-800 mb-2">Peringatan Penting</h3>
                        <p className="text-sm text-yellow-700 leading-relaxed">
                           Dengan menggunakan layanan Toko Sans, Anda menyetujui semua syarat dan ketentuan yang telah ditetapkan. Pastikan untuk membaca dengan seksama sebelum melakukan transaksi. Jika Anda tidak setuju dengan ketentuan
                           ini, mohon untuk tidak menggunakan layanan kami.
                        </p>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <Footer />
      </div>
   );
}
