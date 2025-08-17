'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Search, FileText, User, Phone, Calendar, CreditCard, Package, CheckCircle, XCircle, Clock } from 'lucide-react';
import { TransactionService, TransactionData } from '@/services/transactionService';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

export default function SearchTransactionPage() {
   const [invoice, setInvoice] = useState('');
   const [loading, setLoading] = useState(false);
   const [transaction, setTransaction] = useState<TransactionData | null>(null);
   const [error, setError] = useState<string | null>(null);

   // Set page title
   useEffect(() => {
      document.title = 'Cari Transaksi - Toko Sans';
   }, []);

   const handleSearch = async () => {
      if (!invoice.trim()) {
         setError('Masukkan nomor invoice untuk mencari transaksi');
         return;
      }

      setLoading(true);
      setError(null);
      setTransaction(null);

      try {
         const result = await TransactionService.searchByInvoice(invoice.trim());

         if (result.success && result.data) {
            setTransaction(result.data);
         } else {
            setError(result.error || 'Gagal mencari transaksi');
         }
      } catch (err) {
         setError('Terjadi kesalahan saat mencari transaksi');
         console.error('Search error:', err);
      } finally {
         setLoading(false);
      }
   };

   const handleKeyPress = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
         handleSearch();
      }
   };

   const getStatusIcon = (status: boolean | null) => {
      if (status === true) return <CheckCircle className="h-4 w-4 text-green-500" />;
      if (status === false) return <XCircle className="h-4 w-4 text-red-500" />;
      return <Clock className="h-4 w-4 text-yellow-500" />;
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
            <div className="max-w-4xl mx-auto">
               {/* Header */}
               <div className="text-center mb-8">
                  <h1 className="text-3xl font-bold text-foreground mb-2">Cari Transaksi</h1>
                  <p className="text-muted-foreground">Masukkan nomor invoice untuk melihat detail transaksi</p>
               </div>

               {/* Search Form */}
               <Card className="mb-8 bg-card/80 backdrop-blur-sm dark:bg-card/80">
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2 text-foreground">
                        <Search className="h-5 w-5" />
                        Cari Transaksi
                     </CardTitle>
                     <CardDescription>Masukkan nomor invoice yang ingin Anda cari</CardDescription>
                  </CardHeader>
                  <CardContent>
                     <div className="flex gap-4">
                        <Input type="text" placeholder="Contoh: WEB1755145013763032DSP" value={invoice} onChange={(e) => setInvoice(e.target.value)} onKeyPress={handleKeyPress} className="flex-1" />
                        <Button onClick={handleSearch} disabled={loading} className="min-w-[120px]">
                           {loading ? 'Mencari...' : 'Cari'}
                        </Button>
                     </div>
                  </CardContent>
               </Card>

               {/* Error Message */}
               {error && (
                  <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/30">
                     <XCircle className="h-4 w-4 text-red-600" />
                     <AlertDescription className="text-red-800 dark:text-red-200">{error}</AlertDescription>
                  </Alert>
               )}

               {/* Transaction Result */}
               {transaction && (
                  <Card>
                     <CardHeader>
                        <div className="flex items-center justify-between">
                           <CardTitle className="flex items-center gap-2">
                              <FileText className="h-5 w-5" />
                              Detail Transaksi
                           </CardTitle>
                           {getStatusBadge(transaction.status)}
                        </div>
                     </CardHeader>
                     <CardContent className="space-y-6">
                        {/* Invoice & Status */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Invoice</label>
                              <p className="text-lg font-mono bg-gray-50 p-2 rounded">{transaction.invoice}</p>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Status</label>
                              <div className="flex items-center gap-2">
                                 {getStatusIcon(transaction.status)}
                                 <span className="text-lg">{transaction.status_text}</span>
                              </div>
                           </div>
                        </div>

                        {/* Payment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                 <CreditCard className="h-4 w-4" />
                                 Total Bayar
                              </label>
                              <p className="text-lg font-semibold text-green-600">{TransactionService.formatCurrency(transaction.total_paid)}</p>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Metode Pembayaran</label>
                              <p className="text-lg">{transaction.method}</p>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Waktu Pembayaran</label>
                              <p className="text-sm">{transaction.pay_time ? TransactionService.formatDate(transaction.pay_time) : 'Belum dibayar'}</p>
                           </div>
                        </div>

                        {/* Customer Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                 <User className="h-4 w-4" />
                                 Nama Pembeli
                              </label>
                              <p className="text-lg">{transaction.buyer_name}</p>
                           </div>
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                 <Phone className="h-4 w-4" />
                                 Nomor Telepon
                              </label>
                              <p className="text-lg">{transaction.phone_number}</p>
                           </div>
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                           <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                              <Package className="h-4 w-4" />
                              Produk
                           </label>
                           <Card className="bg-gray-50">
                              <CardContent className="pt-4">
                                 <div className="flex items-center justify-between">
                                    <div>
                                       <h4 className="font-semibold">{transaction.product.name}</h4>
                                       <p className="text-sm text-gray-600">{transaction.product.description}</p>
                                       {transaction.product.is_manual_order && <Badge className="mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100">Manual Order</Badge>}
                                    </div>
                                    <p className="font-semibold text-lg">{TransactionService.formatCurrency(transaction.product.price)}</p>
                                 </div>
                              </CardContent>
                           </Card>
                        </div>

                        {/* Account Info (if paid) */}
                        {transaction.status && transaction.account && (
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500">Informasi Akun</label>
                              <Card className="bg-green-50 border-green-200">
                                 <CardContent className="pt-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                       <div>
                                          <label className="text-sm font-medium text-gray-600">Email/Username</label>
                                          <p className="font-mono bg-white p-2 rounded border">{transaction.account.account}</p>
                                       </div>
                                       <div>
                                          <label className="text-sm font-medium text-gray-600">Password</label>
                                          <p className="font-mono bg-white p-2 rounded border">{transaction.account.password}</p>
                                       </div>
                                    </div>
                                 </CardContent>
                              </Card>
                           </div>
                        )}

                        {/* Timestamps */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                           <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-500 flex items-center gap-1">
                                 <Calendar className="h-4 w-4" />
                                 Waktu Dibuat
                              </label>
                              <p className="text-sm">{TransactionService.formatDate(transaction.created_at)}</p>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               )}
            </div>
         </div>
         <Footer />
      </div>
   );
}
