export interface TransactionData {
   invoice: string;
   status: boolean | null;
   status_text: string;
   total_paid: number;
   method: string;
   pay_time: string | null;
   created_at: string;
   buyer_name: string;
   phone_number: string;
   product: {
      name: string;
      price: number;
      description: string;
      is_manual_order: boolean;
   };
   account?: {
      account: string;
      password: string;
   };
   tokoPay?: {
      reference: string;
      merchant_ref: string;
      qr_url: string;
      qr_string: string;
      pay_url: string;
   };
}

export interface SearchTransactionResponse {
   success: boolean;
   data?: TransactionData;
   error?: string;
}

// Generate random Telegram ID for web users
function generateTelegramId(): string {
   return String(Math.floor(Math.random() * 900000000) + 100000000); // 9-digit random number
}

export class TransactionService {
   /**
    * Search transaction by invoice number
    * Note: Invoice must be registered in backend first via before-payment endpoint
    */
   static async searchByInvoice(invoice: string): Promise<SearchTransactionResponse> {
      try {
         console.log('🔍 TransactionService: Searching transaction by invoice:', invoice);

         // Call backend directly
         const response = await fetch('https://techexs.it.com/api/transaction/search-by-invoice', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ invoice }),
         });

         const data = await response.json();

         console.log('✅ TransactionService: Search response:', data);

         if (data.success) {
            return {
               success: true,
               data: data.data,
            };
         } else {
            return {
               success: false,
               error: data.error || 'Gagal mencari transaksi',
            };
         }
      } catch (error) {
         console.error('❌ TransactionService: Search error:', error);
         return {
            success: false,
            error: 'Terjadi kesalahan saat mencari transaksi',
         };
      }
   }

   /**
    * Validate transaction before payment (required before searching)
    */
   static async validateBeforePayment(productId: string, invoice: string, buyerName: string): Promise<SearchTransactionResponse> {
      try {
         console.log('🔍 TransactionService: Validating before payment:', { productId, invoice, buyerName });

         // Get JWT token from environment
         const jwtToken = process.env.NEXT_PUBLIC_JWT_TOKEN;
         if (!jwtToken) {
            console.error('❌ JWT token not found in environment variables');
            return {
               success: false,
               error: 'Server configuration error - JWT token missing',
            };
         }

         // Call backend directly with JWT token
         const response = await fetch('https://techexs.it.com/api/transaction-telegram', {
            method: 'POST',
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
               product_idnumber: productId,
               id_telegram: generateTelegramId(),
               invoice: invoice,
               buyer_name: buyerName,
               method: 'QRIS',
            }),
         });

         const data = await response.json();

         console.log('✅ TransactionService: Validation response:', data);

         if (data.success) {
            return {
               success: true,
               data: data.data,
            };
         } else {
            return {
               success: false,
               error: data.error || 'Validasi transaksi gagal',
            };
         }
      } catch (error) {
         console.error('❌ TransactionService: Validation error:', error);
         return {
            success: false,
            error: 'Terjadi kesalahan saat validasi transaksi',
         };
      }
   }

   /**
    * Format currency for display
    */
   static formatCurrency(amount: number): string {
      return new Intl.NumberFormat('id-ID', {
         style: 'currency',
         currency: 'IDR',
      }).format(amount);
   }

   /**
    * Format date for display
    */
   static formatDate(dateString: string): string {
      return new Date(dateString).toLocaleString('id-ID', {
         year: 'numeric',
         month: 'long',
         day: 'numeric',
         hour: '2-digit',
         minute: '2-digit',
      });
   }

   /**
    * Get status text based on status value
    */
   static getStatusText(status: boolean | null): string {
      if (status === true) return 'Lunas';
      if (status === false) return 'Gagal';
      return 'Menunggu Pembayaran';
   }

   /**
    * Get status color class for styling
    */
   static getStatusColor(status: boolean | null): string {
      if (status === true) return 'text-green-600';
      if (status === false) return 'text-red-600';
      return 'text-yellow-600';
   }

   /**
    * Get status badge color class
    */
   static getStatusBadgeColor(status: boolean | null): string {
      if (status === true) return 'bg-green-100 text-green-800 hover:bg-green-100';
      if (status === false) return 'bg-red-100 text-red-800 hover:bg-red-100';
      return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
   }
}
