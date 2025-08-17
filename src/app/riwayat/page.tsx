'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, User, Calendar, CreditCard, Package, XCircle, RefreshCw } from 'lucide-react';
import { TransactionService, TransactionData } from '@/services/transactionService';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

// Interface for localStorage purchase history data
interface PurchaseHistoryItem {
   invoice?: string;
   order_id?: string;
   status?: boolean | null;
   payment_status?: boolean | null;
   status_text?: string;
   total_paid?: number;
   amount?: number;
   method?: string;
   payment_method?: string;
   pay_time?: string | null;
   payment_time?: string | null;
   created_at?: string;
   order_date?: string;
   buyer_name?: string;
   customer_name?: string;
   phone_number?: string | null;
   customer_phone?: string | null;
   product?: {
      name?: string;
      price?: number;
      description?: string;
      is_manual_order?: boolean;
   };
   product_name?: string;
   product_price?: number;
   product_description?: string;
   is_manual_order?: boolean;
   account?: {
      account?: string;
      password?: string;
   };
   account_email?: string;
   account_username?: string;
   account_password?: string;
}

export default function RiwayatPage() {
   const [transactions, setTransactions] = useState<TransactionData[]>([]);
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   // Set page title
   useEffect(() => {
      document.title = 'Riwayat Transaksi - Toko Sans';
   }, []);

   useEffect(() => {
      fetchTransactionHistory();
   }, []);

   const fetchTransactionHistory = async () => {
      try {
         setLoading(true);
         setError(null);

         // Get purchase history from localStorage
         const purchaseHistory = localStorage.getItem('purchase_history');

         if (!purchaseHistory) {
            setTransactions([]);
            return;
         }

         const historyData = JSON.parse(purchaseHistory);

         console.log('📋 Raw localStorage data:', historyData);

         // Transform localStorage data to match TransactionData interface
         const transformedTransactions: TransactionData[] = historyData.map((item: PurchaseHistoryItem) => ({
            invoice: item.invoice || item.order_id || `WEB${Date.now()}`,
            status: item.status || item.payment_status || null,
            status_text: item.status_text || (item.status ? 'Lunas' : item.status === false ? 'Gagal' : 'Menunggu Pembayaran'),
            total_paid: item.total_paid || item.amount || 0,
            method: item.method || item.payment_method || 'QRIS',
            pay_time: item.pay_time || item.payment_time || null,
            created_at: item.created_at || item.order_date || new Date().toISOString(),
            buyer_name: item.buyer_name || item.customer_name || 'Web User',
            phone_number: item.phone_number || item.customer_phone || null,
            product: {
               name: item.product?.name || item.product_name || 'Unknown Product',
               price: item.product?.price || item.product_price || 0,
               description: item.product?.description || item.product_description || 'Product description not available',
               is_manual_order: item.product?.is_manual_order || item.is_manual_order || false,
            },
            ...(item.status &&
               item.account && {
                  account: {
                     account: item.account.account || item.account_email || item.account_username || '',
                     password: item.account.password || item.account_password || '',
                  },
               }),
         }));

         setTransactions(transformedTransactions);
      } catch (err) {
         setError('Gagal memuat riwayat transaksi dari localStorage');
         console.error('History error:', err);
      } finally {
         setLoading(false);
      }
   };

   const getStatusBadge = (status: boolean | null) => {
      if (status === true) return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Lunas</Badge>;
      if (status === false) return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Gagal</Badge>;
      return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Menunggu</Badge>;
   };

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-background dark:via-background dark:to-muted/20">
         <Header />
         <div className="py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
               {/* Header */}
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Riwayat Pembelian</h1>
                  <p className="text-muted-foreground">Lihat semua transaksi pembelian Anda</p>
               </div>

               {/* Refresh Button & LocalStorage Info */}
               <div className="flex justify-between items-center mb-6">
                  <div className="text-sm text-muted-foreground">
                     Data dari localStorage: <code className="bg-muted px-2 py-1 rounded text-foreground">purchase_history</code>
                  </div>
                  <Button onClick={fetchTransactionHistory} disabled={loading} variant="outline">
                     <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                     {loading ? 'Memuat...' : 'Refresh'}
                  </Button>
               </div>

               {/* Error Message */}
               {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                     <XCircle className="h-4 w-4 text-red-600" />
                     <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                  </Alert>
               )}

               {/* Loading State */}
               {loading && (
                  <div className="text-center py-12">
                     <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
                     <p className="text-muted-foreground">Memuat riwayat transaksi...</p>
                  </div>
               )}

               {/* Transactions List */}
               {!loading && transactions.length === 0 && (
                  <Card className="text-center py-12">
                     <CardContent>
                        <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="text-lg font-semibold text-foreground mb-2">Belum ada transaksi</h3>
                        <p className="text-muted-foreground">Anda belum memiliki riwayat pembelian</p>
                     </CardContent>
                  </Card>
               )}

               {!loading && transactions.length > 0 && (
                  <div className="space-y-6">
                     {transactions.map((transaction) => (
                        <Card key={transaction.invoice} className="hover:shadow-md transition-shadow bg-card/80 backdrop-blur-sm dark:bg-card/80">
                           <CardHeader>
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <FileText className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                       <CardTitle className="text-lg text-foreground">{transaction.invoice}</CardTitle>
                                       <CardDescription>{TransactionService.formatDate(transaction.created_at)}</CardDescription>
                                    </div>
                                 </div>
                                 {getStatusBadge(transaction.status)}
                              </div>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              {/* Product Info */}
                              <div className="flex items-center justify-between">
                                 <div className="flex items-center gap-3">
                                    <Package className="h-5 w-5 text-muted-foreground" />
                                    <div>
                                       <h4 className="font-semibold text-foreground">{transaction.product.name}</h4>
                                       <p className="text-sm text-muted-foreground">{transaction.product.description}</p>
                                       {transaction.product.is_manual_order && <Badge className="mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100 dark:bg-blue-900/30 dark:text-blue-200">Manual Order</Badge>}
                                    </div>
                                 </div>
                                 <div className="text-right">
                                    <p className="font-semibold text-lg text-foreground">{TransactionService.formatCurrency(transaction.product.price)}</p>
                                    <p className="text-sm text-muted-foreground">Total: {TransactionService.formatCurrency(transaction.total_paid)}</p>
                                 </div>
                              </div>

                              {/* Customer & Payment Info */}
                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
                                 <div className="flex items-center gap-2">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{transaction.buyer_name}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{transaction.method}</span>
                                 </div>
                                 <div className="flex items-center gap-2">
                                    <Calendar className="h-4 w-4 text-muted-foreground" />
                                    <span className="text-sm">{transaction.pay_time ? TransactionService.formatDate(transaction.pay_time) : 'Belum dibayar'}</span>
                                 </div>
                              </div>

                              {/* Account Info (if paid) */}
                              {transaction.status && transaction.account && (
                                 <div className="pt-4 border-t bg-green-50 rounded-lg p-4">
                                    <h5 className="font-semibold text-green-800 mb-2">Informasi Akun</h5>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div>
                                          <label className="text-sm font-medium text-green-700">Email/Username</label>
                                          <p className="font-mono bg-white p-2 rounded border text-sm">{transaction.account.account}</p>
                                       </div>
                                       <div>
                                          <label className="text-sm font-medium text-green-700">Password</label>
                                          <p className="font-mono bg-white p-2 rounded border text-sm">{transaction.account.password}</p>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </CardContent>
                        </Card>
                     ))}
                  </div>
               )}
            </div>
         </div>
         <Footer />
      </div>
   );
}
