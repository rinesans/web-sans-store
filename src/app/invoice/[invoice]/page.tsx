/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

/* eslint-disable react-hooks/exhaustive-deps */

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, User, Phone, CreditCard, Package, CheckCircle, XCircle, Clock, QrCode, Copy, ArrowLeft, RefreshCw, ShoppingCart } from 'lucide-react';
import { TransactionService, TransactionData } from '@/services/transactionService';
import { Header } from '@/components/Header';
import { PaymentSuccessNotification } from '@/components/PaymentSuccessNotification';
import { toastMessages, showToast } from '@/lib/toast-config';
import { Footer } from '@/components/Footer';

// SVG Components for payment status
const PaymentSuccessSVG = () => (
   <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="96" cy="96" r="88" fill="#dcfce7" stroke="#22c55e" strokeWidth="4" />
      <path d="M64 96L88 120L128 80" stroke="#22c55e" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="96" cy="96" r="40" fill="#22c55e" opacity="0.1" />
   </svg>
);

const PaymentFailedSVG = () => (
   <svg width="192" height="192" viewBox="0 0 192 192" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="96" cy="96" r="88" fill="#fef2f2" stroke="#ef4444" strokeWidth="4" />
      <path d="M64 64L128 128M128 64L64 128" stroke="#ef4444" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="96" cy="96" r="40" fill="#ef4444" opacity="0.1" />
   </svg>
);

export default function InvoiceDetailPage() {
   const params = useParams();
   const router = useRouter();
   const invoice = params.invoice as string;

   const [transaction, setTransaction] = useState<TransactionData | null>(null);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);
   const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
   const [isQrExpired, setIsQrExpired] = useState(false);
   const [timeLeft, setTimeLeft] = useState<number>(0);
   const [autoRefreshInterval, setAutoRefreshInterval] = useState<NodeJS.Timeout | null>(null);
   const [lastRefreshTime, setLastRefreshTime] = useState<Date>(new Date());
   const [showSuccessNotification, setShowSuccessNotification] = useState(false);
   const [accountData, setAccountData] = useState<{ account: string; password: string; product?: string } | undefined>(undefined);
   const [isGeneratingQRIS, setIsGeneratingQRIS] = useState(false);
   const [qrExpiredMessage, setQrExpiredMessage] = useState('');
   const [showRegenerateButton, setShowRegenerateButton] = useState(false);

   // Set page title
   useEffect(() => {
      const title = transaction ? `Invoice ${invoice} - ${transaction.product?.name || 'Detail Transaksi'}` : `Invoice ${invoice} - Toko Sans`;
      document.title = title;
   }, [invoice, transaction]);

   useEffect(() => {
      if (invoice) {
         fetchTransactionDetail();
      }
   }, [invoice]);

   // Auto-generate QRIS for pending transactions
   useEffect(() => {
      if (transaction && !transaction.status && !transaction.tokoPay && !isQrExpired) {
         console.log('🔄 Auto-generating TokoPay QRIS for pending transaction...');
         generateTokoPayQRIS();
      }
   }, [transaction?.status, transaction?.tokoPay, isQrExpired]);

   // Handle QRIS expiration and auto-refresh
   useEffect(() => {
      if (isQrExpired && !transaction?.status) {
         console.log('⏰ QRIS expired, showing expired message');
         // Auto-refresh transaction status after QRIS expires
         const refreshTimer = setTimeout(() => {
            console.log('🔄 Auto-refreshing transaction status after QRIS expiration...');
            fetchTransactionDetail(true);
         }, 5000); // Wait 5 seconds before auto-refresh

         return () => clearTimeout(refreshTimer);
      }
   }, [isQrExpired, transaction?.status]);

   // Generate TokoPay QRIS for pending transactions
   const generateTokoPayQRIS = async () => {
      if (!transaction || transaction.status || isGeneratingQRIS) return;

      try {
         setIsGeneratingQRIS(true);
         console.log('🔄 Generating TokoPay QRIS for invoice:', invoice);

         // Reset expired state when generating new QRIS
         setIsQrExpired(false);
         setQrExpiredMessage('');
         setShowRegenerateButton(false);

         // Get product ID from transaction info
         const transactionInfo = sessionStorage.getItem(`transaction_info_${invoice}`);
         let productId = '1'; // Default fallback
         if (transactionInfo) {
            const info = JSON.parse(transactionInfo);
            productId = info.productId;
         }

         // Call TokoPay API for existing transaction (no validation needed)
         const paymentResponse = await fetch(
            `/api/payment?${new URLSearchParams({
               action: 'create-qris',
               nominal: transaction.product.price.toString(),
               productId: productId,
               originalInvoice: invoice, // Pass the original invoice
            })}`
         );

         if (!paymentResponse.ok) {
            console.error('❌ TokoPay API error:', paymentResponse.status, paymentResponse.statusText);
            showToast.error('Gagal membuat QRIS. Silakan coba lagi.');
            return;
         }

         const paymentData = await paymentResponse.json();

         if (!paymentData.status || paymentData.status !== 'Success') {
            console.error('❌ TokoPay order failed:', paymentData);
            showToast.error('Gagal membuat QRIS. Silakan coba lagi.');
            return;
         }

         console.log('✅ TokoPay QRIS generated successfully:', paymentData);

         // Save TokoPay data to sessionStorage
         const tokoPayData = {
            invoice: invoice,
            tokoPay: {
               reference: paymentData.data.reference,
               merchant_ref: paymentData.data.merchant_ref,
               qr_url: paymentData.data.qr_url,
               qr_string: paymentData.data.qr_string,
               pay_url: paymentData.data.pay_url,
            },
            created_at: new Date().toISOString(), // Update creation time for new QRIS
         };
         sessionStorage.setItem(`tokoPay_${invoice}`, JSON.stringify(tokoPayData));

         // Update transaction with TokoPay data and new creation time
         const updatedTransaction = {
            ...transaction,
            tokoPay: tokoPayData.tokoPay,
            created_at: tokoPayData.created_at,
         };
         setTransaction(updatedTransaction);

         // Check QR validity with new data
         checkQrValidity(updatedTransaction);

         showToast.success('QRIS berhasil dibuat!');
      } catch (error) {
         console.error('❌ Error generating TokoPay QRIS:', error);
         showToast.error('Gagal membuat QRIS. Silakan coba lagi.');
      } finally {
         setIsGeneratingQRIS(false);
      }
   };

   // Auto-refresh effect for pending payments
   useEffect(() => {
      if (transaction && !transaction.status && !isQrExpired) {
         // Start auto-refresh every 10 seconds for pending payments
         const interval = setInterval(() => {
            console.log('🔄 Auto-refreshing transaction status...');
            fetchTransactionDetail(true); // silent refresh
         }, 10000);

         // Show auto-refresh started toast only once
         if (!autoRefreshInterval) {
            showToast.info(toastMessages.autoRefreshActive);
         }

         setAutoRefreshInterval(interval);

         return () => {
            if (interval) clearInterval(interval);
         };
      } else {
         // Stop auto-refresh if payment is completed or QR expired
         if (autoRefreshInterval) {
            clearInterval(autoRefreshInterval);
            setAutoRefreshInterval(null);
         }
      }
   }, [transaction?.status, isQrExpired]);

   // Countdown timer effect
   useEffect(() => {
      if (timeLeft > 0 && !isQrExpired) {
         const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
               if (prevTime <= 1) {
                  setIsQrExpired(true);
                  setQrCodeUrl(null);
                  return 0;
               }
               return prevTime - 1;
            });
         }, 1000);

         return () => clearInterval(timer);
      }
   }, [timeLeft, isQrExpired]);

   const fetchTransactionDetail = async (silent: boolean = false) => {
      try {
         if (!silent) {
            setLoading(true);
         }
         setError(null);

         // First try to get from localStorage (for completed transactions only)
         const purchaseHistory = localStorage.getItem('purchase_history');
         let localTransaction = null;

         if (purchaseHistory) {
            const historyData = JSON.parse(purchaseHistory);
            localTransaction = historyData.find((item: TransactionData) => item.invoice === invoice);
         }

         if (localTransaction) {
            console.log('✅ Found completed transaction in localStorage:', localTransaction);
            setTransaction(localTransaction);
            checkQrValidity(localTransaction);
         } else {
            // Transaction not in localStorage - try backend API
            console.log('🔍 Transaction not found in localStorage, trying backend API...');
            const result = await TransactionService.searchByInvoice(invoice);

            if (result.success && result.data) {
               console.log('✅ Found transaction via API:', result.data);

               // Get TokoPay data from sessionStorage if available
               const tokoPayData = sessionStorage.getItem(`tokoPay_${invoice}`);
               if (tokoPayData) {
                  const parsedTokoPayData = JSON.parse(tokoPayData);
                  console.log('✅ Found TokoPay data in sessionStorage:', parsedTokoPayData);

                  // Merge TokoPay data with API response
                  result.data.tokoPay = parsedTokoPayData.tokoPay;
               } else {
                  console.log('⚠️ No TokoPay data found in sessionStorage for invoice:', invoice);
               }

               // Only save successful payments to localStorage
               if (result.data.status === true) {
                  console.log('🎉 Payment successful! Saving to localStorage...');
                  console.log('📋 Account data available:', !!result.data.account);
                  console.log('📋 Account details:', result.data.account);

                  // Save successful transaction to localStorage
                  const existingHistory = localStorage.getItem('purchase_history');
                  const historyArray = existingHistory ? JSON.parse(existingHistory) : [];

                  // Check if transaction already exists in localStorage
                  const existingIndex = historyArray.findIndex((item: TransactionData) => item.invoice === invoice);

                  if (existingIndex >= 0) {
                     // Update existing transaction
                     historyArray[existingIndex] = result.data;
                  } else {
                     // Add new successful transaction
                     historyArray.unshift(result.data);
                  }

                  localStorage.setItem('purchase_history', JSON.stringify(historyArray));
                  console.log('✅ Successful transaction saved to localStorage');

                  // Show success notification with account data
                  if (result.data.account) {
                     console.log('🎯 Setting account data for notification:', {
                        account: result.data.account.account,
                        password: result.data.account.password,
                        product: result.data.product.name,
                     });

                     setAccountData({
                        account: result.data.account.account,
                        password: result.data.account.password,
                        product: result.data.product.name,
                     });
                     setShowSuccessNotification(true);

                     // Show toast notification
                     showToast.success(toastMessages.paymentSuccess);
                  } else {
                     console.log('⚠️ No account data available for successful payment');
                     // Fallback notification if no account data
                     showToast.success(toastMessages.paymentSuccess);
                  }
               } else if (result.data.status === false) {
                  console.log('❌ Payment failed - not saving to localStorage');
                  showToast.error('Pembayaran gagal');
               } else {
                  console.log('⏳ Payment still pending - not saving to localStorage');

                  // For pending payments, check if we have TokoPay data for QR display
                  if (tokoPayData) {
                     const parsedTokoPayData = JSON.parse(tokoPayData);
                     result.data.tokoPay = parsedTokoPayData.tokoPay;
                  }
               }

               setTransaction(result.data);
               checkQrValidity(result.data);
            } else {
               setError(result.error || 'Invoice tidak ditemukan');
            }
         }

         setLastRefreshTime(new Date());
      } catch (err) {
         setError('Gagal memuat detail transaksi');
         console.error('Invoice detail error:', err);

         // Show error toast
         showToast.error(toastMessages.loadError);
      } finally {
         if (!silent) {
            setLoading(false);
         }
      }
   };

   const checkQrValidity = (transactionData: TransactionData) => {
      // QRIS expires after 15 minutes from creation
      const createdAt = new Date(transactionData.created_at);
      const now = new Date();
      const timeDiff = now.getTime() - createdAt.getTime();
      const minutesDiff = Math.floor(timeDiff / (1000 * 60));

      console.log('🔍 Checking QR validity:', {
         createdAt: createdAt.toISOString(),
         now: now.toISOString(),
         timeDiff: timeDiff,
         minutesDiff: minutesDiff,
         isExpired: minutesDiff >= 15,
      });

      if (minutesDiff >= 15) {
         console.log('⏰ QRIS has expired');
         setIsQrExpired(true);
         setQrCodeUrl(null);
         setTimeLeft(0);
         setQrExpiredMessage('Kode QRIS telah expired. Silakan buat pesanan baru.');
         setShowRegenerateButton(true);

         // Show QRIS expired toast
         showToast.error('QRIS telah expired. Silakan buat pesanan baru.');
         return;
      }

      // QRIS is still valid
      setIsQrExpired(false);
      setQrExpiredMessage('');
      setShowRegenerateButton(false);

      if (transactionData.tokoPay?.qr_url) {
         setQrCodeUrl(transactionData.tokoPay.qr_url);
         const remainingMinutes = 15 - minutesDiff;
         const remainingSeconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
         setTimeLeft(remainingMinutes * 60 + remainingSeconds);
      } else {
         setQrCodeUrl(null);
         setTimeLeft(0);
      }
   };

   const copyInvoiceToClipboard = () => {
      if (transaction?.invoice) {
         navigator.clipboard.writeText(transaction.invoice);
         showToast.success(toastMessages.invoiceCopied, 2000);
      }
   };

   const getStatusBadge = (status: boolean | null) => {
      if (status === true) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>;
      if (status === false) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gagal</Badge>;
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>;
   };

   const formatTime = (seconds: number): string => {
      const minutes = Math.floor(seconds / 60);
      const remainingSeconds = seconds % 60;
      return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
   };

   // Force refresh from API (bypass localStorage)
   const forceRefreshFromAPI = async () => {
      try {
         console.log('🔄 Force refreshing from API...');
         showToast.info(toastMessages.forceRefresh);

         const result = await TransactionService.searchByInvoice(invoice);

         if (result.success && result.data) {
            console.log('✅ Force refresh successful:', result.data);

            // Only save successful payments to localStorage
            if (result.data.status === true) {
               console.log('🎉 Payment successful via force refresh! Saving to localStorage...');
               console.log('📋 Account data available:', !!result.data.account);
               console.log('📋 Account details:', result.data.account);

               // Save successful transaction to localStorage
               const existingHistory = localStorage.getItem('purchase_history');
               const historyArray = existingHistory ? JSON.parse(existingHistory) : [];

               // Check if transaction already exists in localStorage
               const existingIndex = historyArray.findIndex((item: TransactionData) => item.invoice === invoice);

               if (existingIndex >= 0) {
                  // Update existing transaction
                  historyArray[existingIndex] = result.data;
               } else {
                  // Add new successful transaction
                  historyArray.unshift(result.data);
               }

               localStorage.setItem('purchase_history', JSON.stringify(historyArray));
               console.log('✅ Successful transaction saved to localStorage via force refresh');

               // Show success notification with account data
               if (result.data.account) {
                  console.log('🎯 Setting account data for notification (force refresh):', {
                     account: result.data.account.account,
                     password: result.data.account.password,
                     product: result.data.product.name,
                  });

                  setAccountData({
                     account: result.data.account.account,
                     password: result.data.account.password,
                     product: result.data.product.name,
                  });
                  setShowSuccessNotification(true);

                  // Show toast notification
                  showToast.success(toastMessages.paymentSuccess);
               } else {
                  console.log('⚠️ No account data available for successful payment (force refresh)');
                  showToast.success(toastMessages.paymentSuccess);
               }
            } else if (result.data.status === false) {
               console.log('❌ Payment failed via force refresh - not saving to localStorage');
               showToast.error('Pembayaran gagal');
            } else {
               console.log('⏳ Payment still pending via force refresh - not saving to localStorage');
            }

            setTransaction(result.data);
            checkQrValidity(result.data);

            // Show success toast for force refresh
            showToast.success(toastMessages.forceRefreshSuccess, 2000);
         } else {
            console.error('❌ Force refresh failed:', result.error);
            showToast.error(toastMessages.forceRefreshError);
         }
      } catch (err) {
         console.error('❌ Force refresh error:', err);
         showToast.error(toastMessages.forceRefreshError);
      }
   };

   if (loading) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
            <Header />
            <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
               <div className="max-w-4xl mx-auto">
                  <div className="text-center py-8 sm:py-12">
                     <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                     <p className="text-muted-foreground text-sm sm:text-base">Memuat detail invoice...</p>
                  </div>
               </div>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
            <Header />
            <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
               <div className="max-w-4xl mx-auto">
                  <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                     <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                     <AlertDescription className="text-red-800 dark:text-red-200 text-sm sm:text-base">{error}</AlertDescription>
                  </Alert>
                  <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     Kembali
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   if (!transaction) {
      return (
         <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
            <Header />
            <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
               <div className="max-w-4xl mx-auto">
                  <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                     <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                     <AlertDescription className="text-red-800 dark:text-red-200 text-sm sm:text-base">Invoice tidak ditemukan</AlertDescription>
                  </Alert>
                  <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto">
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     Kembali
                  </Button>
               </div>
            </div>
         </div>
      );
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
         <Header />

         {/* Payment Success Notification */}
         <PaymentSuccessNotification isOpen={showSuccessNotification} onClose={() => setShowSuccessNotification(false)} accountData={accountData} />
         <div className="py-6 sm:py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
               {/* Header */}
               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                  <div className="flex-1 min-w-0">
                     <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 sm:mb-2 break-words">Detail Invoice</h1>
                     <p className="text-xs sm:text-sm lg:text-base text-muted-foreground">Informasi lengkap transaksi pembelian</p>
                  </div>
                  <Button onClick={() => router.back()} variant="outline" className="w-full sm:w-auto shrink-0">
                     <ArrowLeft className="h-4 w-4 mr-2" />
                     Kembali
                  </Button>
               </div>

               {/* Invoice & Status */}
               <Card className="mb-6 bg-card/80 backdrop-blur-sm dark:bg-card/80">
                  <CardHeader>
                     <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                           <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-muted-foreground shrink-0 mt-0.5" />
                           <div className="min-w-0 flex-1">
                              <CardTitle className="text-sm sm:text-lg lg:text-xl break-all leading-tight">{transaction.invoice}</CardTitle>
                              <CardDescription className="text-xs sm:text-sm mt-1">Dibuat pada {TransactionService.formatDate(transaction.created_at)}</CardDescription>
                           </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                           {getStatusBadge(transaction.status)}
                           <Button onClick={copyInvoiceToClipboard} variant="outline" size="sm" className="shrink-0">
                              <Copy className="h-4 w-4 mr-1 sm:mr-2" />
                              <span className="hidden sm:inline">Salin</span>
                           </Button>
                        </div>
                     </div>
                  </CardHeader>
               </Card>

               {/* QRIS Payment Section */}
               {!transaction.status && !isQrExpired && (
                  <Card className="mb-6 border-2 border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                           <QrCode className="h-5 w-5" />
                           Pembayaran QRIS
                        </CardTitle>
                        <CardDescription className="text-green-700 dark:text-green-300">{isGeneratingQRIS ? 'Sedang membuat QRIS pembayaran...' : 'Scan QRIS code di bawah ini untuk melakukan pembayaran'}</CardDescription>
                     </CardHeader>
                     <CardContent className="text-center">
                        <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded-lg inline-block mb-4">
                           {isGeneratingQRIS ? (
                              <div className="flex flex-col items-center justify-center h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                                 <RefreshCw className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 animate-spin text-green-600 dark:text-green-400 mb-3 sm:mb-4" />
                                 <p className="text-xs sm:text-sm text-green-600 dark:text-green-400">Membuat QRIS...</p>
                              </div>
                           ) : qrCodeUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={qrCodeUrl} alt="QRIS Code" className="w-32 h-32 sm:w-40 sm:h-40 lg:w-48 lg:h-48" />
                           ) : (
                              <div className="flex flex-col items-center justify-center h-32 w-32 sm:h-40 sm:w-40 lg:h-48 lg:w-48">
                                 <QrCode className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-muted-foreground mb-3 sm:mb-4" />
                                 <p className="text-xs sm:text-sm text-muted-foreground">QRIS tidak tersedia</p>
                                 <Button onClick={generateTokoPayQRIS} disabled={isGeneratingQRIS} variant="outline" size="sm" className="mt-2">
                                    {isGeneratingQRIS ? (
                                       <>
                                          <RefreshCw className="mr-2 h-3 w-3 animate-spin" />
                                          Membuat...
                                       </>
                                    ) : (
                                       <>
                                          <QrCode className="mr-2 h-3 w-3" />
                                          Coba Lagi
                                       </>
                                    )}
                                 </Button>
                              </div>
                           )}
                        </div>
                        <div className="space-y-2">
                           <p className="text-base sm:text-lg font-semibold text-green-800 dark:text-green-200">{TransactionService.formatCurrency(transaction.product.price)}</p>
                           {!isGeneratingQRIS && qrCodeUrl && (
                              <div className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2">
                                 <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 dark:text-green-400" />
                                 <p className="text-xs sm:text-sm text-green-600 dark:text-green-400 text-center">
                                    QRIS akan expired dalam <span className="font-mono font-bold text-red-600 dark:text-red-400">{formatTime(timeLeft)}</span>
                                 </p>
                              </div>
                           )}
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Payment Status Section - Shows SVG icons for completed/failed payments */}
               {transaction.status !== null && (
                  <Card className={`mb-6 border-2 ${transaction.status ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/30' : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30'}`}>
                     <CardHeader>
                        <CardTitle className={`flex items-center gap-2 ${transaction.status ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                           {transaction.status ? <CheckCircle className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                           {transaction.status ? 'Pembayaran Berhasil' : 'Pembayaran Gagal'}
                        </CardTitle>
                        <CardDescription className={transaction.status ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}>
                           {transaction.status ? 'Transaksi telah selesai dan akun telah aktif' : 'Transaksi gagal atau tidak dapat diproses'}
                        </CardDescription>
                     </CardHeader>
                     <CardContent className="text-center">
                        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg inline-block mb-4">
                           <div className="w-40 h-40 sm:w-48 sm:h-48">{transaction.status ? <PaymentSuccessSVG /> : <PaymentFailedSVG />}</div>
                        </div>
                        <div className="space-y-2">
                           <p className={`text-lg font-semibold ${transaction.status ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'}`}>
                              {TransactionService.formatCurrency(transaction.total_paid || transaction.product.price)}
                           </p>
                           <p className={`text-sm ${transaction.status ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                              {transaction.status ? 'Pembayaran berhasil diproses' : 'Pembayaran tidak dapat diproses'}
                           </p>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* QRIS Expired Message */}
               {!transaction.status && isQrExpired && (
                  <Card className="mb-6 border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-red-800 dark:text-red-200">
                           <XCircle className="h-5 w-5" />
                           QRIS Expired
                        </CardTitle>
                        <CardDescription className="text-red-700 dark:text-red-300">{qrExpiredMessage || 'Kode QRIS telah expired. Silakan buat pesanan baru.'}</CardDescription>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-3">
                           <Button onClick={() => router.push('/')} className="flex-1">
                              <ShoppingCart className="mr-2 h-4 w-4" />
                              Buat Pesanan Baru
                           </Button>
                           {showRegenerateButton && (
                              <Button onClick={generateTokoPayQRIS} disabled={isGeneratingQRIS} variant="outline" className="flex-1">
                                 {isGeneratingQRIS ? (
                                    <>
                                       <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                       Membuat QRIS Baru...
                                    </>
                                 ) : (
                                    <>
                                       <QrCode className="mr-2 h-4 w-4" />
                                       Buat QRIS Baru
                                    </>
                                 )}
                              </Button>
                           )}
                        </div>
                        <div className="text-center">
                           <p className="text-xs sm:text-sm text-red-600 dark:text-red-400 px-2">⚠️ QRIS hanya berlaku 15 menit. Jika sudah expired, Anda perlu membuat pesanan baru.</p>
                        </div>
                     </CardContent>
                  </Card>
               )}

               {/* Transaction Details */}
               <Card className="mb-6 bg-card/80 backdrop-blur-sm dark:bg-card/80">
                  <CardHeader>
                     <CardTitle className="text-foreground">Detail Transaksi</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                     {/* Product Info */}
                     <div className="space-y-2">
                        <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                           <Package className="h-4 w-4" />
                           Produk
                        </label>
                        <Card className="bg-muted/50 dark:bg-muted/30">
                           <CardContent className="pt-4">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                 <div className="flex-1">
                                    <h4 className="font-semibold text-base sm:text-lg text-foreground">{transaction.product.name}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{transaction.product.description}</p>
                                    {transaction.product.is_manual_order && <Badge className="mt-2 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200">Manual Order</Badge>}
                                 </div>
                                 <p className="font-semibold text-lg sm:text-xl text-right text-foreground">{TransactionService.formatCurrency(transaction.product.price)}</p>
                              </div>
                           </CardContent>
                        </Card>
                     </div>

                     {/* Payment Details */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="space-y-2">
                           <label className="text-xs sm:text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <CreditCard className="h-3 w-3 sm:h-4 sm:w-4" />
                              Total Bayar
                           </label>
                           <p className="text-sm sm:text-base lg:text-lg font-semibold text-green-600 dark:text-green-400">
                              {transaction.status ? TransactionService.formatCurrency(transaction.total_paid) : TransactionService.formatCurrency(transaction.product.price)}
                           </p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-xs sm:text-sm font-medium text-muted-foreground">Metode Pembayaran</label>
                           <p className="text-sm sm:text-base lg:text-lg text-foreground">{transaction.method}</p>
                        </div>
                        <div className="space-y-2 sm:col-span-2 lg:col-span-1">
                           <label className="text-xs sm:text-sm font-medium text-muted-foreground">Waktu Pembayaran</label>
                           <p className="text-xs sm:text-sm text-foreground">{transaction.pay_time ? TransactionService.formatDate(transaction.pay_time) : 'Belum dibayar'}</p>
                        </div>
                     </div>

                     {/* Customer Info */}
                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <User className="h-4 w-4" />
                              Nama Pembeli
                           </label>
                           <p className="text-base sm:text-lg text-foreground">{transaction.buyer_name}</p>
                        </div>
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-muted-foreground flex items-center gap-1">
                              <Phone className="h-4 w-4" />
                              Nomor Telepon
                           </label>
                           <p className="text-base sm:text-lg text-foreground">{transaction.phone_number || '-'}</p>
                        </div>
                     </div>

                     {/* Account Info (if paid) */}
                     {transaction.status && transaction.account && (
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-muted-foreground">Informasi Akun</label>
                           <Card className="bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800">
                              <CardContent className="pt-4">
                                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                       <label className="text-sm font-medium text-green-700 dark:text-green-300">Email/Username</label>
                                       <p className="font-mono bg-white dark:bg-gray-800 p-3 rounded border text-sm break-all text-foreground">{transaction.account.account}</p>
                                    </div>
                                    <div>
                                       <label className="text-sm font-medium text-green-700 dark:text-green-300">Password</label>
                                       <p className="font-mono bg-white dark:bg-gray-800 p-3 rounded border text-sm break-all text-foreground">{transaction.account.password}</p>
                                    </div>
                                 </div>
                              </CardContent>
                           </Card>
                        </div>
                     )}
                  </CardContent>
               </Card>

               {/* Refresh Button & Status */}
               <div className="flex flex-col items-center gap-4">
                  <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                     <Button
                        onClick={() => {
                           fetchTransactionDetail();
                           showToast.info(toastMessages.refreshStatus, 2000);
                        }}
                        variant="outline"
                        className="w-full sm:w-auto"
                     >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh Status
                     </Button>

                     {/* <Button onClick={forceRefreshFromAPI} variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 w-full sm:w-auto">
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Force Refresh
                     </Button> */}
                  </div>

                  {/* Auto-refresh indicator */}
                  {!transaction?.status && !isQrExpired && (
                     <div className="text-center text-sm text-muted-foreground">
                        <div className="flex items-center justify-center gap-2">
                           <RefreshCw className="h-3 w-3 animate-spin" />
                           <span>Auto-refresh setiap 10 detik</span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">Terakhir diperbarui: {lastRefreshTime.toLocaleTimeString()}</p>
                     </div>
                  )}

                  {/* Payment completed indicator */}
                  {transaction?.status && (
                     <div className="text-center text-sm text-green-600 dark:text-green-400">
                        <div className="flex items-center justify-center gap-2">
                           <CheckCircle className="h-4 w-4" />
                           <span>Pembayaran berhasil! Akun telah aktif.</span>
                        </div>
                     </div>
                  )}

                  {/* Payment pending but might be completed indicator */}
                  {!transaction?.status && !isQrExpired && (
                     <div className="text-center text-sm text-blue-600 dark:text-blue-400">
                        <div className="flex items-center justify-center gap-2">
                           <Clock className="h-4 w-4" />
                           <span>Status pembayaran sedang diperbarui...</span>
                        </div>
                        <p className="text-xs text-blue-500 dark:text-blue-400 mt-1">Jika sudah bayar tapi status belum berubah, klik &quot;Force Refresh&quot;</p>
                     </div>
                  )}
               </div>
            </div>
         </div>
         <Footer />
      </div>
   );
}
