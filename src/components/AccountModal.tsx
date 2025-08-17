'use client';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Copy, Download, Key, Mail, History, Shield } from 'lucide-react';

interface AccountData {
   product: string;
   account: string;
   password: string;
}

interface AccountModalProps {
   accountData: AccountData | null;
   isOpen: boolean;
   onClose: () => void;
   onViewHistory?: () => void;
   onResetPayment?: () => void;
}

export function AccountModal({ accountData, isOpen, onClose, onViewHistory, onResetPayment }: AccountModalProps) {
   if (!accountData) return null;

   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
   };

   const downloadAccountInfo = () => {
      const content = `Akun Premium ${accountData.product}

Email: ${accountData.account}
Password: ${accountData.password}

Tanggal Pembelian: ${new Date().toLocaleDateString('id-ID')}
Waktu: ${new Date().toLocaleTimeString('id-ID')}

Simpan informasi ini dengan aman dan jangan bagikan kepada siapapun.

Terima kasih telah membeli produk premium kami!`;

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `akun_${accountData.product}_${Date.now()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
   };

   const getProductIcon = (productName: string) => {
      if (productName.includes('Canva')) return '🎨';
      if (productName.includes('Spotify')) return '🎵';
      if (productName.includes('Netflix')) return '🎬';
      if (productName.includes('YouTube')) return '📺';
      return '⭐';
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-2xl">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                  <CheckCircle className="h-6 w-6 text-green-500" />
                  Pembayaran Berhasil!
               </DialogTitle>
               <DialogDescription>Akun premium Anda telah siap digunakan. Simpan informasi di bawah ini dengan aman.</DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               {/* Success Message */}
               <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                  <CardContent className="pt-6">
                     <div className="flex items-center gap-3">
                        <div className="text-3xl">{getProductIcon(accountData.product)}</div>
                        <div>
                           <h3 className="font-semibold text-green-800 dark:text-green-200">{accountData.product}</h3>
                           <p className="text-sm text-green-600 dark:text-green-300">Akun premium Anda telah aktif dan siap digunakan</p>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Account Details */}
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Informasi Akun
                     </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                     <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                           <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Email:</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{accountData.account}</span>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(accountData.account)}>
                                 <Copy className="h-3 w-3" />
                              </Button>
                           </div>
                        </div>

                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                           <div className="flex items-center gap-2">
                              <Shield className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm font-medium">Password:</span>
                           </div>
                           <div className="flex items-center gap-2">
                              <span className="font-mono text-sm">{accountData.password}</span>
                              <Button variant="ghost" size="sm" onClick={() => copyToClipboard(accountData.password)}>
                                 <Copy className="h-3 w-3" />
                              </Button>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Instructions */}
               <Card>
                  <CardHeader>
                     <CardTitle className="text-base">Cara Menggunakan</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                           <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">1</span>
                           <span>Buka aplikasi atau website {accountData.product}</span>
                        </div>
                        <div className="flex items-start gap-2">
                           <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">2</span>
                           <span>Klik &quot;Login&quot; atau &quot;Sign In&quot;</span>
                        </div>
                        <div className="flex items-start gap-2">
                           <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">3</span>
                           <span>Masukkan email dan password di atas</span>
                        </div>
                        <div className="flex items-start gap-2">
                           <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">4</span>
                           <span>Nikmati fitur premium yang telah Anda beli</span>
                        </div>
                     </div>
                  </CardContent>
               </Card>

               {/* Important Notes */}
               <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                  <CardHeader>
                     <CardTitle className="text-base text-orange-800 dark:text-orange-200">⚠️ Penting!</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <div className="space-y-2 text-sm text-orange-700 dark:text-orange-300">
                        <p>• Simpan informasi akun ini dengan aman</p>
                        <p>• Jangan bagikan kepada siapapun</p>
                        <p>• Akun ini adalah akun premium yang aktif</p>
                        <p>• Jika ada masalah, hubungi customer service kami</p>
                     </div>
                  </CardContent>
               </Card>

               {/* Action Buttons */}
               <div className="flex gap-3 pt-4">
                  <Button onClick={downloadAccountInfo} className="flex-1">
                     <Download className="mr-2 h-4 w-4" />
                     Download Info
                  </Button>
                  {onViewHistory && (
                     <Button variant="outline" onClick={onViewHistory} className="flex-1">
                        <History className="mr-2 h-4 w-4" />
                        Lihat Riwayat
                     </Button>
                  )}
                  <Button
                     variant="outline"
                     onClick={() => {
                        onClose();
                        if (onResetPayment) {
                           onResetPayment();
                        }
                     }}
                     className="flex-1"
                  >
                     Selesai
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
