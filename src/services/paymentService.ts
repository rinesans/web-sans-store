// PaymentService now uses API routes for server-side environment variables

export interface PaymentRequest {
   productId: string;
   productName: string;
   buyerName: string;
   nominal: number;
}

export interface PaymentResponse {
   success: boolean;
   data?: unknown;
   error?: string;
}

export class PaymentService {
   static async createPayment(request: PaymentRequest): Promise<PaymentResponse> {
      try {
         console.log('🔍 PaymentService: Creating payment with request:', request);
         console.log('🔍 PaymentService: Request validation:');
         console.log('  - productId:', request.productId, '(type:', typeof request.productId, ')');
         console.log('  - productName:', request.productName, '(type:', typeof request.productName, ')');
         console.log('  - nominal:', request.nominal, '(type:', typeof request.nominal, ')');

         // Validate request
         if (!request.productId || request.productId === 'undefined') {
            console.error('❌ PaymentService: Invalid product ID:', request.productId);
            throw new Error('Invalid product ID');
         }

         if (!request.productName) {
            console.error('❌ PaymentService: Missing product name');
            throw new Error('Product name is required');
         }

         if (!request.nominal || request.nominal <= 0) {
            console.error('❌ PaymentService: Invalid nominal amount:', request.nominal);
            throw new Error('Invalid nominal amount');
         }

         console.log('✅ PaymentService: Request validation passed');

         // Create payment using API route (server-side environment variables)
         console.log('🔍 PaymentService: Calling API route for payment creation...');

         const params = new URLSearchParams({
            metode: 'QRIS',
            productId: request.productId,
            productName: request.productName,
            buyerName: request.buyerName,
            nominal: request.nominal.toString(),
         });

         const apiResponse = await fetch(`/api/payment?${params.toString()}`);
         const response = await apiResponse.json();

         console.log('✅ PaymentService: Payment created successfully:', response);

         return {
            success: true,
            data: response,
         };
      } catch (error) {
         console.error('❌ PaymentService: Payment creation failed:', error);
         return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
         };
      }
   }

   static async checkPaymentStatus(refId: string, nominal: number): Promise<PaymentResponse> {
      try {
         console.log('🔍 Checking payment status:', { refId, nominal });

         const params = new URLSearchParams({
            refId: refId,
            nominal: nominal.toString(),
         });

         const apiResponse = await fetch(`/api/payment?${params.toString()}`);
         const response = await apiResponse.json();

         return {
            success: true,
            data: response,
         };
      } catch (error) {
         console.error('❌ Payment status check failed:', error);
         return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
         };
      }
   }

   static async postTransactionToAPI(paymentData: { reference: string; merchant_ref: string }, productId: string, status: boolean): Promise<PaymentResponse> {
      try {
         console.log('🔍 Posting transaction to API:', { paymentData, productId, status });

         // Call the server-side service to post transaction and get account data
         const params = new URLSearchParams({
            action: 'post-transaction',
            reference: paymentData.reference,
            merchant_ref: paymentData.merchant_ref,
            productId: productId,
            status: status.toString(),
         });

         const apiResponse = await fetch(`/api/payment?${params.toString()}`);
         const response = await apiResponse.json();

         console.log('✅ Post transaction API response:', response);

         return {
            success: true,
            data: response,
         };
      } catch (error) {
         console.error('❌ Post transaction failed:', error);
         return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
         };
      }
   }
}
