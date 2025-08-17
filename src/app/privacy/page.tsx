'use client';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Eye, Lock, Users, FileText, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

export default function PrivacyPage() {
   return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
         <Header />

         <div className="flex-1 container mx-auto px-4 py-8">
            {/* Header Section */}
            <div className="text-center mb-12">
               <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                  <Shield className="h-8 w-8 text-primary" />
               </div>
               <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">Kebijakan Privasi</h1>
               <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Kebijakan privasi ini menjelaskan bagaimana Toko Sans mengumpulkan, menggunakan, dan melindungi informasi pribadi Anda.</p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
               {/* Pengumpulan Informasi */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Eye className="h-5 w-5" />
                        Informasi yang Kami Kumpulkan
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Informasi Pribadi:</strong> Nama, alamat email, nomor telepon yang Anda berikan saat transaksi.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Informasi Transaksi:</strong> Detail pembelian, metode pembayaran, dan riwayat transaksi.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Informasi Teknis:</strong> Alamat IP, jenis browser, sistem operasi, dan data penggunaan website.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Cookies:</strong> Data kecil yang disimpan di perangkat Anda untuk meningkatkan pengalaman browsing.
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Penggunaan Informasi */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Lock className="h-5 w-5" />
                        Bagaimana Kami Menggunakan Informasi
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Memproses dan menyelesaikan transaksi pembelian Anda.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Mengirimkan informasi akun premium yang telah dibeli.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Memberikan dukungan pelanggan dan menangani keluhan.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Meningkatkan layanan dan pengalaman pengguna website.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Mencegah penipuan dan memastikan keamanan transaksi.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Berbagi Informasi */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        Berbagi Informasi
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Penyedia Pembayaran:</strong> Informasi pembayaran dibagikan dengan penyedia layanan pembayaran untuk memproses transaksi.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Layanan Hukum:</strong> Kami dapat membagikan informasi jika diminta oleh hukum atau untuk melindungi hak kami.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Keamanan:</strong> Kami tidak akan menjual, menyewakan, atau membagikan informasi pribadi Anda kepada pihak ketiga tanpa izin.
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Keamanan Data */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Shield className="h-5 w-5" />
                        Keamanan Data
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Menggunakan enkripsi SSL untuk melindungi data yang ditransmisikan.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Menyimpan data di server yang aman dengan akses terbatas.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Melakukan pemantauan keamanan secara berkala untuk mencegah pelanggaran data.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Memberikan pelatihan keamanan kepada karyawan yang menangani data pribadi.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Hak Pengguna */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <FileText className="h-5 w-5" />
                        Hak Pengguna
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Hak Akses:</strong> Anda berhak mengetahui informasi pribadi apa yang kami kumpulkan.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Hak Perbaikan:</strong> Anda dapat meminta perbaikan data pribadi yang tidak akurat.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Hak Penghapusan:</strong> Anda dapat meminta penghapusan data pribadi dalam kondisi tertentu.
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Hak Pembatasan:</strong> Anda dapat meminta pembatasan penggunaan data pribadi.
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Cookies */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Eye className="h-5 w-5" />
                        Penggunaan Cookies
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Cookies digunakan untuk mengingat preferensi Anda dan meningkatkan pengalaman browsing.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Anda dapat mengatur browser untuk menolak cookies, namun ini dapat mempengaruhi fungsionalitas website.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Cookies tidak mengumpulkan informasi pribadi yang dapat mengidentifikasi Anda secara langsung.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Perubahan Kebijakan */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Clock className="h-5 w-5" />
                        Perubahan Kebijakan Privasi
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Kami dapat memperbarui kebijakan privasi ini dari waktu ke waktu.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Perubahan akan diumumkan melalui website dan email jika diperlukan.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Tanggal terakhir diperbarui akan ditampilkan di bagian bawah halaman ini.</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Kontak */}
               <Card className="border-primary/20 bg-card/80 backdrop-blur-sm shadow-lg dark:bg-card/80 dark:border-primary/30">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-primary">
                        <Users className="h-5 w-5" />
                        Hubungi Kami
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">Jika Anda memiliki pertanyaan tentang kebijakan privasi ini, silakan hubungi kami.</p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Telegram:</strong> @tokosans
                           </p>
                        </div>
                        <div className="flex items-start gap-3">
                           <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                           <p className="text-sm text-muted-foreground">
                              <strong>Email:</strong> privacy@tokosans.com
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Disclaimer */}
               <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                     <AlertTriangle className="h-6 w-6 text-blue-600 mt-0.5 flex-shrink-0" />
                     <div>
                        <h3 className="font-semibold text-blue-800 mb-2">Informasi Penting</h3>
                        <p className="text-sm text-blue-700 leading-relaxed">
                           Kebijakan privasi ini berlaku mulai tanggal 1 Januari 2024. Dengan menggunakan layanan Toko Sans, Anda menyetujui pengumpulan dan penggunaan informasi sesuai dengan kebijakan privasi ini.
                        </p>
                        <p className="text-sm text-blue-700 mt-2">
                           <strong>Terakhir diperbarui:</strong> 1 Januari 2024
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
