/* eslint-disable react-hooks/exhaustive-deps */

/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useProductStore } from '@/store/productStore';
import { PaymentService } from '@/services/paymentService';
import { HistoryService } from '@/services/historyService';

interface AccountData {
   product: string;
   account: string;
   password: string;
}
import { QrCode, CreditCard, CheckCircle, XCircle, Clock, Copy, ExternalLink, Loader2, RefreshCw } from 'lucide-react';
import Image from 'next/image';

interface PaymentModalProps {
   isOpen: boolean;
   onClose: () => void;
   onSuccess: (accountData: AccountData) => void;
}

export function PaymentModal({ isOpen, onClose, onSuccess }: PaymentModalProps) {
   // Reset state when modal closes
   useEffect(() => {
      if (!isOpen) {
         // Don't reset immediately, let the success flow complete
         setTimeout(() => {
            clearPaymentData();
            setRefId(null);
            setPaymentStatus('pending');
            setError(null);
            setTimeLeft(60);
         }, 3000);
      }
   }, [isOpen]);
   // Get product from global state
   const { selectedProduct: product, paymentData, paymentStatus, isPaymentLoading: loading, setPaymentData, setPaymentStatus, setPaymentLoading, clearPaymentData } = useProductStore();

   const [error, setError] = useState<string | null>(null);
   const [timeLeft, setTimeLeft] = useState(60); // 1 minute in seconds for testing
   const [checkingStatus, setCheckingStatus] = useState(false);
   const [refId, setRefId] = useState<string | null>(null);

   const formatPrice = (price: number) => {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
         minimumFractionDigits: 0,
      }).format(price);
   };

   const formatTime = (seconds: number) => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
   };

   // Create payment order when modal opens
   useEffect(() => {
      if (isOpen && !paymentData && product) {
         setRefId(null);
         createPaymentOrder();
      }
   }, [isOpen, product]);

   // Countdown timer
   useEffect(() => {
      if (paymentStatus === 'pending' && timeLeft > 0) {
         const timer = setTimeout(() => {
            setTimeLeft(timeLeft - 1);
         }, 1000);

         return () => clearTimeout(timer);
      } else if (timeLeft === 0) {
         setPaymentStatus('expired');
      }
   }, [timeLeft, paymentStatus]);

   // Auto check payment status every 15 seconds
   useEffect(() => {
      if (paymentStatus === 'pending' && paymentData) {
         const interval = setInterval(() => {
            checkPaymentStatus();
         }, 15000);

         return () => clearInterval(interval);
      }
   }, [paymentStatus, paymentData]);

   const createPaymentOrder = async () => {
      if (!product) {
         setError('Produk tidak ditemukan');
         return;
      }

      try {
         setPaymentLoading(true);
         setError(null);

         console.log('🔍 PaymentModal Debug:', {
            productId: product?.id,
            productIdType: typeof product?.id,
            productName: product?.name,
            productPrice: product?.price,
         });

         // Use PaymentService directly (bypass API route)
         const paymentRequest = {
            productId: product?.id?.toString() || '',
            productName: product?.name || 'Unknown Product',
            buyerName: 'Web User',
            nominal: product?.price || 0,
         };

         console.log('🔗 Payment Request:', paymentRequest);

         const response = await PaymentService.createPayment(paymentRequest);

         if (response.success && response.data) {
            console.log('✅ Payment created successfully:', response.data);
            setPaymentData(response.data);
            const paymentData = response.data as { data?: { merchant_ref?: string } };
            setRefId(paymentData.data?.merchant_ref || null);
            setPaymentStatus('pending');
            setTimeLeft(60); // Reset timer to 1 minute for testing
         } else {
            console.error('❌ Payment failed:', response.error);
            throw new Error(response.error || 'Failed to create payment order');
         }
      } catch (err) {
         console.error('❌ Payment error:', err);
         setError('Gagal membuat order pembayaran. Silakan coba lagi.');
      } finally {
         setPaymentLoading(false);
      }
   };

   const checkPaymentStatus = async () => {
      if (!paymentData || !refId || !product) return;

      try {
         setCheckingStatus(true);

         // Use PaymentService to check status
         const statusResponse = await PaymentService.checkPaymentStatus(refId, product?.price || 0);

         const statusData = statusResponse.data as { data?: { status?: string } };
         if (statusResponse.success && statusData.data?.status === 'PAID') {
            setPaymentStatus('paid');

            // Post transaction to API to get account
            try {
               const currentPaymentData = paymentData as { data?: { reference?: string; merchant_ref?: string } };
               const apiResponse = await PaymentService.postTransactionToAPI(
                  {
                     reference: currentPaymentData.data?.reference || '',
                     merchant_ref: currentPaymentData.data?.merchant_ref || '',
                  },
                  product?.id?.toString() || '',
                  true
               );

               console.log('🔍 API Response for account data:', JSON.stringify(apiResponse, null, 2));

               const apiData = apiResponse.data as { data?: { account?: { product?: { name?: string }; account?: string; password?: string } } };
               if (apiResponse.success && apiData.data?.account) {
                  const account = apiData.data.account;
                  console.log('✅ Account data received:', account);

                  // Use data directly from backend response
                  const accountData = {
                     product: account.product?.name || product?.name || 'Unknown Product',
                     account: account.account || '', // Use account.account directly
                     password: account.password || '', // Use account.password directly
                  };

                  console.log('🔍 Account data to send:', accountData);

                  // Save to history
                  HistoryService.savePurchase(accountData);

                  setTimeout(() => {
                     onSuccess(accountData);
                  }, 2000);
               } else {
                  console.warn('⚠️ No account data in API response, using fallback');
                  // Fallback to simulated account
                  const fallbackData = {
                     product: product?.name || 'Unknown Product',
                     account: `account_${Date.now()}`,
                     password: `pass_${Math.random().toString(36).substring(2, 8)}`,
                  };

                  // Save to history
                  HistoryService.savePurchase(fallbackData);

                  setTimeout(() => {
                     onSuccess(fallbackData);
                  }, 2000);
               }
            } catch (apiError) {
               console.error('Error posting transaction to API:', apiError);
               // Fallback to simulated account
               const fallbackData = {
                  product: product?.name || 'Unknown Product',
                  account: `account_${Date.now()}`,
                  password: `pass_${Math.random().toString(36).substring(2, 8)}`,
               };

               // Save to history
               HistoryService.savePurchase(fallbackData);

               setTimeout(() => {
                  onSuccess(fallbackData);
               }, 2000);
            }
         }
      } catch (err) {
         console.error('Error checking payment status:', err);
      } finally {
         setCheckingStatus(false);
      }
   };

   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
   };

   const openPaymentUrl = () => {
      const paymentDataTyped = paymentData as { data?: { pay_url?: string } };
      if (paymentDataTyped?.data?.pay_url) {
         window.open(paymentDataTyped.data.pay_url, '_blank');
      }
   };

   const retryPayment = () => {
      clearPaymentData();
      setRefId(null);
      setPaymentStatus('pending');
      setError(null);
      setTimeLeft(60); // Reset to 1 minute for testing
      createPaymentOrder();
   };

   const renderPaymentContent = () => {
      if (loading) {
         return (
            <div className="flex flex-col items-center justify-center py-12">
               <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
               <p className="text-lg font-medium">Membuat order pembayaran...</p>
               <p className="text-sm text-muted-foreground mt-2">Mohon tunggu sebentar</p>
            </div>
         );
      }

      if (error) {
         return (
            <div className="flex flex-col items-center justify-center py-12">
               <XCircle className="h-12 w-12 text-red-500 mb-4" />
               <p className="text-lg font-medium text-red-600">Gagal membuat pembayaran</p>
               <p className="text-sm text-muted-foreground mt-2 text-center">{error}</p>
               <div className="flex gap-2 mt-4">
                  <Button onClick={retryPayment} className="flex-1">
                     <RefreshCw className="mr-2 h-4 w-4" />
                     Coba Lagi
                  </Button>
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                     Tutup
                  </Button>
               </div>
            </div>
         );
      }

      if (paymentStatus === 'expired') {
         return (
            <div className="flex flex-col items-center justify-center py-12">
               <Clock className="h-12 w-12 text-orange-500 mb-4" />
               <p className="text-lg font-medium text-orange-600">Waktu pembayaran habis</p>
               <p className="text-sm text-muted-foreground mt-2 text-center">Pembayaran tidak selesai dalam waktu yang ditentukan. QR Code telah kadaluarsa dan tidak dapat digunakan lagi.</p>
               <div className="mt-6 space-y-3">
                  <Button onClick={retryPayment} className="w-full">
                     <RefreshCw className="mr-2 h-4 w-4" />
                     Buat Order Baru
                  </Button>
                  <Button variant="outline" onClick={handleClose} className="w-full">
                     Tutup
                  </Button>
               </div>
            </div>
         );
      }

      if (paymentStatus === 'paid') {
         return (
            <div className="flex flex-col items-center justify-center py-12">
               <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
               <p className="text-lg font-medium text-green-600">Pembayaran Berhasil!</p>
               <p className="text-sm text-muted-foreground mt-2 text-center">Mengirimkan akun premium Anda...</p>
               <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
            </div>
         );
      }

      if (!paymentData) {
         return null;
      }

      return (
         <div className="space-y-6">
            {/* Payment Info */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <CreditCard className="h-5 w-5" />
                     Informasi Pembayaran
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground">Produk:</span>
                     <span className="font-medium">{product?.name || 'Unknown Product'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground">Total Bayar:</span>
                     <span className="text-lg font-bold text-primary">{formatPrice(product?.price || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                     <span className="text-sm text-muted-foreground">Order ID:</span>
                     <div className="flex items-center gap-2">
                        <span className="font-mono text-sm">{(paymentData as { data?: { reference?: string } })?.data?.reference || 'N/A'}</span>
                        <Button variant="ghost" size="sm" onClick={() => copyToClipboard((paymentData as { data?: { reference?: string } })?.data?.reference || '')}>
                           <Copy className="h-3 w-3" />
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>

            {/* QR Code */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <QrCode className="h-5 w-5" />
                     Scan QR Code
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="flex justify-center">
                     <div className="relative">
                        {(paymentData as { data?: { qr_url?: string } })?.data?.qr_url && (
                           <Image src={(paymentData as { data?: { qr_url?: string } })?.data?.qr_url || ''} alt="QR Code Pembayaran" width={200} height={200} className="border rounded-lg" />
                        )}
                     </div>
                  </div>

                  <div className="text-center space-y-2">
                     <p className="text-sm text-muted-foreground">Scan QR Code di atas menggunakan aplikasi e-wallet atau mobile banking Anda</p>

                     <div className="flex items-center justify-center gap-2">
                        <Badge variant={timeLeft <= 30 ? 'destructive' : 'outline'} className="text-xs">
                           <Clock className="h-3 w-3 mr-1" />
                           {formatTime(timeLeft)}
                        </Badge>
                        {checkingStatus && (
                           <Badge variant="secondary" className="text-xs">
                              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                              Memeriksa status...
                           </Badge>
                        )}
                     </div>

                     {timeLeft <= 30 && timeLeft > 0 && (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                           <p className="text-orange-800 text-sm font-medium">⚠️ Waktu hampir habis! Selesaikan pembayaran dalam {timeLeft} detik.</p>
                        </div>
                     )}
                  </div>

                  <Separator />

                  <div className="text-center">
                     <Button variant="outline" onClick={openPaymentUrl} className="w-full">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Buka di Browser
                     </Button>
                  </div>
               </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
               <CardHeader>
                  <CardTitle className="text-base">Cara Pembayaran</CardTitle>
               </CardHeader>
               <CardContent>
                  <div className="space-y-2 text-sm">
                     <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">1</span>
                        <span>Buka aplikasi e-wallet atau mobile banking Anda</span>
                     </div>
                     <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">2</span>
                        <span>Pilih fitur "Scan QR" atau "Pay QR"</span>
                     </div>
                     <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">3</span>
                        <span>Arahkan kamera ke QR Code di atas</span>
                     </div>
                     <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">4</span>
                        <span>Konfirmasi pembayaran sesuai nominal yang tertera</span>
                     </div>
                     <div className="flex items-start gap-2">
                        <span className="bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center text-xs font-medium">5</span>
                        <span>Tunggu konfirmasi otomatis dan akun akan dikirim</span>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      );
   };

   const handleClose = () => {
      onClose();
      // Reset state when modal is closed manually
      clearPaymentData();
      setRefId(null);
      setPaymentStatus('pending');
      setError(null);
      setTimeLeft(60);
   };

   return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="text-2xl font-bold">Pembayaran QRIS</DialogTitle>
               <DialogDescription>Selesaikan pembayaran untuk mendapatkan akun premium {product?.name || 'Produk'}</DialogDescription>
            </DialogHeader>

            {renderPaymentContent()}

            {paymentStatus === 'pending' && !loading && !error && (
               <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={handleClose} className="flex-1">
                     Tutup
                  </Button>
                  <Button onClick={checkPaymentStatus} disabled={checkingStatus} className="flex-1">
                     {checkingStatus ? (
                        <>
                           <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                           Memeriksa...
                        </>
                     ) : (
                        <>
                           <RefreshCw className="mr-2 h-4 w-4" />
                           Periksa Status
                        </>
                     )}
                  </Button>
               </div>
            )}
         </DialogContent>
      </Dialog>
   );
}
