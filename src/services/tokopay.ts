export interface PaymentOrder {
   refId: string;
   metode: string;
   nominal: number;
}

export interface PaymentResponse {
   status: string;
   data: {
      reference: string; // trx_id dari TokoPay
      merchant_ref: string; // ref_id yang kita kirim
      qr_url: string;
      pay_url: string;
      qr_string: string;
      total_bayar: number;
      total_diterima: number;
      status: string;
   };
}

export interface PaymentStatusResponse {
   success: boolean;
   data: {
      reference: string;
      status: 'PAID' | 'UNPAID';
      total_bayar: number;
      total_diterima: number;
   };
}

class TokoPayService {
   /**
    * Create a new payment order
    */
   async createOrder(order: PaymentOrder): Promise<PaymentResponse> {
      try {
         const params = new URLSearchParams({
            refId: order.refId,
            metode: order.metode,
            nominal: order.nominal.toString(),
         });

         const response = await fetch(`/api/payment?${params.toString()}`, {
            method: 'GET',
         });

         if (!response.ok) {
            throw new Error('Failed to create payment order');
         }

         const data = await response.json();
         return data;
      } catch (error) {
         console.error('Error creating TokoPay order:', error);
         throw new Error('Gagal membuat order pembayaran');
      }
   }

   /**
    * Check payment status
    */
   async checkPaymentStatus(refId: string, nominal: number): Promise<PaymentStatusResponse> {
      try {
         const response = await fetch(`/api/payment?refId=${refId}&nominal=${nominal}`, {
            method: 'GET',
            headers: {
               'Content-Type': 'application/json',
            },
         });

         if (!response.ok) {
            throw new Error('Failed to check payment status');
         }

         const data = await response.json();

         if (data.status === 'Success' && data.data) {
            return {
               success: true,
               data: {
                  reference: data.data.trx_id,
                  status: data.data.status === 'Success' ? 'PAID' : 'UNPAID',
                  total_bayar: data.data.total_bayar,
                  total_diterima: data.data.total_diterima,
               },
            };
         }

         return {
            success: false,
            data: {
               reference: refId,
               status: 'UNPAID',
               total_bayar: nominal,
               total_diterima: 0,
            },
         };
      } catch (error) {
         console.error('Error checking payment status:', error);
         throw new Error('Gagal memeriksa status pembayaran');
      }
   }

   /**
    * Generate unique reference ID for our system
    * This will be sent to TokoPay as merchant_ref
    */
   generateRefId(): string {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `WEB${timestamp}${random}`.toUpperCase();
   }
}

export const tokoPayService = new TokoPayService();
