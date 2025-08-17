/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle, Copy, ExternalLink } from 'lucide-react';
import { toastMessages, showToast } from '@/lib/toast-config';

interface PaymentSuccessNotificationProps {
   isOpen: boolean;
   onClose: () => void;
   accountData?: {
      account: string;
      password: string;
      product?: string;
   };
}

export function PaymentSuccessNotification({ isOpen, onClose, accountData }: PaymentSuccessNotificationProps) {
   const [copiedField, setCopiedField] = useState<string | null>(null);

   const copyToClipboard = async (text: string, field: string) => {
      try {
         await navigator.clipboard.writeText(text);
         setCopiedField(field);
         setTimeout(() => setCopiedField(null), 2000);

         // Show toast notification
         showToast.success(`${field === 'account' ? 'Username' : 'Password'} ${toastMessages.copySuccess}`, 2000);
      } catch (err) {
         console.error('Failed to copy:', err);
         showToast.error(toastMessages.copyFailed);
      }
   };

   return (
      <Dialog open={isOpen} onOpenChange={onClose}>
         <DialogContent className="max-w-lg w-[95vw] max-h-[90vh] overflow-y-auto mx-4 bg-background border-border">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2 text-green-600 dark:text-green-400 text-xl sm:text-2xl">
                  <CheckCircle className="h-6 w-6 sm:h-7 sm:w-7" />
                  Pembayaran Berhasil!
               </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
               <div className="text-center">
                  <p className="text-muted-foreground mb-6 text-base sm:text-lg">Akun premium Anda telah aktif dan siap digunakan.</p>

                  {accountData && (
                     <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                        <CardContent className="pt-6 pb-6">
                           <div className="space-y-4">
                              <div>
                                 <label className="text-sm font-medium text-green-700 dark:text-green-300 block mb-2">Email/Username</label>
                                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <code className="flex-1 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm break-all min-h-[44px] flex items-center text-foreground">{accountData.account}</code>
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => copyToClipboard(accountData.account, 'account')}
                                       className="shrink-0 h-[44px] px-4 border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-950/50"
                                    >
                                       <Copy className="h-4 w-4 mr-1 sm:mr-0" />
                                       <span className="sm:hidden">Salin</span>
                                    </Button>
                                 </div>
                                 {copiedField === 'account' && <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Disalin!</p>}
                              </div>

                              <div>
                                 <label className="text-sm font-medium text-green-700 dark:text-green-300 block mb-2">Password</label>
                                 <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                                    <code className="flex-1 bg-white dark:bg-gray-800 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm break-all min-h-[44px] flex items-center text-foreground">{accountData.password}</code>
                                    <Button
                                       size="sm"
                                       variant="outline"
                                       onClick={() => copyToClipboard(accountData.password, 'password')}
                                       className="shrink-0 h-[44px] px-4 border-green-300 dark:border-green-600 hover:bg-green-50 dark:hover:bg-green-950/50"
                                    >
                                       <Copy className="h-4 w-4 mr-1 sm:mr-0" />
                                       <span className="sm:hidden">Salin</span>
                                    </Button>
                                 </div>
                                 {copiedField === 'password' && <p className="text-xs text-green-600 dark:text-green-400 mt-2">✓ Disalin!</p>}
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  )}
               </div>

               <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={onClose} className="flex-1 h-12 text-base font-medium bg-primary hover:bg-primary/90" size="lg">
                     Tutup
                  </Button>
               </div>
            </div>
         </DialogContent>
      </Dialog>
   );
}
