/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Header } from '@/components/Header';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { AccountModal } from '@/components/AccountModal';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { apiService } from '@/services/api';
import { Product } from '@/types/api';
import { useProductStore } from '@/store/productStore';
import { PaymentService } from '@/services/paymentService';

import { QrCode, CreditCard, CheckCircle, XCircle, Clock, Copy, ExternalLink, Loader2, RefreshCw, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

interface AccountData {
   product: string;
   account: string;
   password: string;
}

type PaymentStatus = 'pending' | 'processing' | 'paid' | 'failed' | 'expired';

export default function PaymentPage() {
   const params = useParams();
   const router = useRouter();
   const [product, setProduct] = useState<Product | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [showAccountModal, setShowAccountModal] = useState(false);

   const [accountData, setAccountData] = useState<AccountData | null>(null);
   const [paymentData, setPaymentData] = useState<any>(null);
   const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>('pending');
   const [timeLeft, setTimeLeft] = useState(60);
   const [checkingStatus, setCheckingStatus] = useState(false);
   const [refId, setRefId] = useState<string | null>(null);

   const { setSelectedProduct } = useProductStore();

   useEffect(() => {
      const fetchProduct = async () => {
         try {
            setLoading(true);
            const productId = params.productId as string;

            // Fetch all products and find the one with matching ID
            const response = await apiService.getProductInfo();
            const foundProduct = response.data.find((p) => p.id.toString() === productId);

            if (!foundProduct) {
               setError('Produk tidak ditemukan');
               return;
            }

            setProduct(foundProduct);
            setSelectedProduct(foundProduct);

            // Create payment order immediately
            createPaymentOrder(foundProduct);
         } catch (err) {
            setError('Gagal memuat data produk. Silakan coba lagi.');
            console.error('Error fetching product:', err);
         } finally {
            setLoading(false);
         }
      };

      if (params.productId) {
         fetchProduct();
      }
   }, [params.productId]);

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

   const createPaymentOrder = async (product: Product) => {
      try {
         setError(null);

         const paymentRequest = {
            productId: product.id.toString(),
            productName: product.name,
            buyerName: 'Web User',
            nominal: product.price,
         };

         const response = await PaymentService.createPayment(paymentRequest);

         if (response.success && response.data) {
            setPaymentData(response.data);
            setRefId((response.data as { data?: { merchant_ref?: string } }).data?.merchant_ref || null);
            setPaymentStatus('pending');
            setTimeLeft(60);
         } else {
            throw new Error(response.error || 'Failed to create payment order');
         }
      } catch (err) {
         console.error('Payment error:', err);
         setError('Gagal membuat order pembayaran. Silakan coba lagi.');
      }
   };

   const checkPaymentStatus = async () => {
      if (!paymentData || !refId || !product) return;

      try {
         setCheckingStatus(true);

         const statusResponse = await PaymentService.checkPaymentStatus(refId, product.price);

         if (statusResponse.success && (statusResponse.data as { data?: { status?: string } })?.data?.status === 'PAID') {
            setPaymentStatus('paid');

            try {
               const apiResponse = await PaymentService.postTransactionToAPI(
                  {
                     reference: paymentData.data.reference,
                     merchant_ref: paymentData.data.merchant_ref,
                  },
                  product.id.toString(),
                  true
               );

               if (apiResponse.success && (apiResponse.data as { data?: { account?: any } })?.data?.account) {
                  const account = (apiResponse.data as { data?: { account?: any } }).data!.account;
                  const accountData = {
                     product: account.product?.name || product.name,
                     account: account.account,
                     password: account.password,
                  };

                  // Save to localStorage purchase_history
                  const existingHistory = localStorage.getItem('purchase_history');
                  const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
                  const transactionData = {
                     invoice: `WEB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                     status: true,
                     status_text: 'Lunas',
                     total_paid: product.price,
                     method: 'QRIS',
                     pay_time: new Date().toISOString(),
                     created_at: new Date().toISOString(),
                     buyer_name: 'Web User',
                     phone_number: null,
                     product: {
                        name: accountData.product,
                        price: product.price,
                        description: product.description,
                        is_manual_order: false,
                     },
                     account: {
                        account: accountData.account,
                        password: accountData.password,
                     },
                  };
                  historyArray.unshift(transactionData);
                  localStorage.setItem('purchase_history', JSON.stringify(historyArray));

                  setTimeout(() => {
                     setAccountData(accountData);
                     setShowAccountModal(true);
                  }, 2000);
               } else {
                  const fallbackData = {
                     product: product.name,
                     account: `account_${Date.now()}`,
                     password: `pass_${Math.random().toString(36).substring(2, 8)}`,
                  };

                  // Save to localStorage purchase_history
                  const existingHistory = localStorage.getItem('purchase_history');
                  const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
                  const transactionData = {
                     invoice: `WEB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                     status: true,
                     status_text: 'Lunas',
                     total_paid: product.price,
                     method: 'QRIS',
                     pay_time: new Date().toISOString(),
                     created_at: new Date().toISOString(),
                     buyer_name: 'Web User',
                     phone_number: null,
                     product: {
                        name: fallbackData.product,
                        price: product.price,
                        description: product.description,
                        is_manual_order: false,
                     },
                     account: {
                        account: fallbackData.account,
                        password: fallbackData.password,
                     },
                  };
                  historyArray.unshift(transactionData);
                  localStorage.setItem('purchase_history', JSON.stringify(historyArray));

                  setTimeout(() => {
                     setAccountData(fallbackData);
                     setShowAccountModal(true);
                  }, 2000);
               }
            } catch (apiError) {
               console.error('Error posting transaction to API:', apiError);
               const fallbackData = {
                  product: product.name,
                  account: `account_${Date.now()}`,
                  password: `pass_${Math.random().toString(36).substring(2, 8)}`,
               };

               // Save to localStorage purchase_history
               const existingHistory = localStorage.getItem('purchase_history');
               const historyArray = existingHistory ? JSON.parse(existingHistory) : [];
               const transactionData = {
                  invoice: `WEB${Date.now()}${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                  status: true,
                  status_text: 'Lunas',
                  total_paid: product.price,
                  method: 'QRIS',
                  pay_time: new Date().toISOString(),
                  created_at: new Date().toISOString(),
                  buyer_name: 'Web User',
                  phone_number: null,
                  product: {
                     name: fallbackData.product,
                     price: product.price,
                     description: product.description,
                     is_manual_order: false,
                  },
                  account: {
                     account: fallbackData.account,
                     password: fallbackData.password,
                  },
               };
               historyArray.unshift(transactionData);
               localStorage.setItem('purchase_history', JSON.stringify(historyArray));

               setTimeout(() => {
                  setAccountData(fallbackData);
                  setShowAccountModal(true);
               }, 2000);
            }
         }
      } catch (err) {
         console.error('Error checking payment status:', err);
      } finally {
         setCheckingStatus(false);
      }
   };

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

   const copyToClipboard = (text: string) => {
      navigator.clipboard.writeText(text);
   };

   const openPaymentUrl = () => {
      if (paymentData?.data.pay_url) {
         window.open(paymentData.data.pay_url, '_blank');
      }
   };

   const retryPayment = () => {
      setPaymentData(null);
      setRefId(null);
      setPaymentStatus('pending');
      setError(null);
      setTimeLeft(60);
      if (product) {
         createPaymentOrder(product);
      }
   };

   const handleCloseAccountModal = () => {
      setShowAccountModal(false);
      setAccountData(null);
      // Navigate back to product page
      router.push('/');
   };

   const handleViewHistory = () => {
      setShowAccountModal(false);
      // Navigate to history page
      router.push('/riwayat');
   };

   const handleResetPayment = () => {
      setShowAccountModal(false);
      setAccountData(null);
      // Navigate back to product page
      router.push('/');
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
               <LoadingSpinner />
            </div>
         </div>
      );
   }

   if (error || !product) {
      return (
         <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto px-4 py-8">
               <div className="flex flex-col items-center justify-center py-12">
                  <XCircle className="h-12 w-12 text-red-500 mb-4" />
                  <h2 className="text-xl font-semibold text-red-600 mb-2">Terjadi Kesalahan</h2>
                  <p className="text-muted-foreground text-center mb-6">{error || 'Produk tidak ditemukan'}</p>
                  <Button onClick={() => router.push('/')}>
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Kembali ke Beranda
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-background">
         <Header />

         <div className="container mx-auto px-4 py-8">
            {/* Back Button */}
            <Button variant="ghost" onClick={() => router.push('/')} className="mb-6">
               <ArrowLeft className="mr-2 h-4 w-4" />
               Kembali ke Beranda
            </Button>

            <div className="max-w-2xl mx-auto">
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
                           <span className="font-medium">{product.name}</span>
                        </div>
                        <div className="flex justify-between items-center">
                           <span className="text-sm text-muted-foreground">Total Bayar:</span>
                           <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                        </div>
                        {paymentData && (
                           <div className="flex justify-between items-center">
                              <span className="text-sm text-muted-foreground">Order ID:</span>
                              <div className="flex items-center gap-2">
                                 <span className="font-mono text-sm">{paymentData.data.reference}</span>
                                 <Button variant="ghost" size="sm" onClick={() => copyToClipboard(paymentData.data.reference)}>
                                    <Copy className="h-3 w-3" />
                                 </Button>
                              </div>
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* QR Code */}
                  {paymentData && paymentStatus === 'pending' && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <QrCode className="h-5 w-5" />
                              Scan QR Code
                           </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           <div className="flex justify-center">
                              <div className="relative">{paymentData.data.qr_url && <Image src={paymentData.data.qr_url} alt="QR Code Pembayaran" width={200} height={200} className="border rounded-lg" />}</div>
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
                  )}

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

                  {/* Status Messages */}
                  {paymentStatus === 'expired' && (
                     <Card className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950">
                        <CardContent className="pt-6">
                           <div className="flex flex-col items-center justify-center py-8">
                              <Clock className="h-12 w-12 text-orange-500 mb-4" />
                              <h3 className="text-lg font-medium text-orange-800 dark:text-orange-200 mb-2">Waktu pembayaran habis</h3>
                              <p className="text-sm text-orange-600 dark:text-orange-300 text-center mb-6">Pembayaran tidak selesai dalam waktu yang ditentukan. QR Code telah kadaluarsa dan tidak dapat digunakan lagi.</p>
                              <Button onClick={retryPayment} className="w-full">
                                 <RefreshCw className="mr-2 h-4 w-4" />
                                 Buat Order Baru
                              </Button>
                           </div>
                        </CardContent>
                     </Card>
                  )}

                  {paymentStatus === 'paid' && (
                     <Card className="border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950">
                        <CardContent className="pt-6">
                           <div className="flex flex-col items-center justify-center py-8">
                              <CheckCircle className="h-12 w-12 text-green-500 mb-4" />
                              <h3 className="text-lg font-medium text-green-800 dark:text-green-200 mb-2">Pembayaran Berhasil!</h3>
                              <p className="text-sm text-green-600 dark:text-green-300 text-center">Mengirimkan akun premium Anda...</p>
                              <Loader2 className="h-6 w-6 animate-spin text-primary mt-4" />
                           </div>
                        </CardContent>
                     </Card>
                  )}

                  {/* Action Buttons */}
                  {paymentStatus === 'pending' && paymentData && (
                     <div className="flex gap-3 pt-4">
                        <Button variant="outline" onClick={() => router.push('/')} className="flex-1">
                           Kembali
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
               </div>
            </div>
         </div>

         {/* Account Modal */}
         <AccountModal accountData={accountData} isOpen={showAccountModal} onClose={handleCloseAccountModal} onViewHistory={handleViewHistory} onResetPayment={handleResetPayment} />
      </div>
   );
}
