import axios from 'axios';

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

export interface ValidationResponse {
   success: boolean;
   message?: string;
   data?: Record<string, unknown>;
}

class TokoPayServerService {
   private baseUrl = 'https://api.tokopay.id/v1';
   private apiBaseUrl = 'https://techexs.it.com';
   private merchantId: string;
   private secretKey: string;
   private jwtToken: string;

   constructor() {
      // Server-side environment variables
      this.merchantId = process.env.TOKOPAY_MERCHANT_ID || '';
      this.secretKey = process.env.TOKOPAY_SECRET_KEY || '';
      this.jwtToken = process.env.JWT_TOKEN || '';

      console.log('🔍 TokoPayServerService Environment Check:');
      console.log('  Merchant ID:', this.merchantId ? 'SET' : 'MISSING');
      console.log('  Secret Key:', this.secretKey ? 'SET' : 'MISSING');
      console.log('  JWT Token:', this.jwtToken ? 'SET' : 'MISSING');

      if (!this.merchantId || !this.secretKey || !this.jwtToken) {
         console.error('❌ Missing required environment variables!');
      }
   }

   /**
    * Generate random Telegram ID for web users
    */
   generateTelegramId(): string {
      return String(Math.floor(Math.random() * 900000000) + 100000000); // 9-digit random number
   }

   /**
    * Pre-payment validation (booking product)
    */
   async validateTransactionBeforePayment(productId: string, refId: string, buyerName: string): Promise<ValidationResponse> {
      try {
         const telegramId = this.generateTelegramId();

         const payload = {
            invoice: refId,
            product_idnumber: String(productId),
            id_telegram: String(telegramId),
            buyer_name: buyerName,
            method: 'QRIS',
         };

         console.log('🔍 Pre-payment validation payload:', payload);
         console.log('🔍 JWT Token being used:', this.jwtToken ? 'PRESENT' : 'MISSING');

         const response = await axios.post(`${this.apiBaseUrl}/api/transaction-telegram`, payload, {
            headers: {
               Authorization: `Bearer ${this.jwtToken}`,
               'Content-Type': 'application/json',
            },
         });

         console.log('✅ Pre-payment validation response:', response.data);

         if (response.data && response.data.success) {
            return {
               success: true,
               data: response.data.data,
               message: response.data.message || 'Validation successful',
            };
         } else {
            return {
               success: false,
               message: response.data.message || 'Validation failed',
            };
         }
      } catch (error) {
         console.error('❌ Error validating transaction:', error instanceof Error ? error.message : 'Unknown error');
         if (axios.isAxiosError(error)) {
            console.error('❌ Axios error details:', error.response?.data);
            console.error('❌ Status code:', error.response?.status);
            console.error('❌ Headers sent:', error.config?.headers);
         }
         return {
            success: false,
            message: axios.isAxiosError(error) ? error.response?.data?.message || 'Validation error occurred' : 'Validation error occurred',
         };
      }
   }

   /**
    * Create a new payment order using direct API call
    */
   async createOrder(order: PaymentOrder): Promise<PaymentResponse> {
      try {
         const params = new URLSearchParams({
            merchant: this.merchantId,
            secret: this.secretKey,
            ref_id: order.refId,
            nominal: order.nominal.toString(),
            metode: order.metode,
         });

         console.log('🔍 Direct API call to TokoPay:', `${this.baseUrl}/order?${params.toString()}`);

         const response = await axios.get(`${this.baseUrl}/order?${params.toString()}`);

         console.log('✅ TokoPay direct response:', response.data);

         if (response.data.status === 'Success' && response.data.data) {
            return {
               status: response.data.status,
               data: {
                  reference: response.data.data.trx_id || '',
                  merchant_ref: order.refId,
                  qr_url: response.data.data.qr_link || '',
                  pay_url: response.data.data.pay_url || '',
                  qr_string: response.data.data.qr_string || '',
                  total_bayar: response.data.data.total_bayar || order.nominal,
                  total_diterima: response.data.data.total_diterima || 0,
                  status: 'Unpaid', // Default status for new order
               },
            };
         } else {
            throw new Error(response.data.error || 'Failed to create order');
         }
      } catch (error) {
         console.error('❌ Error creating TokoPay order (direct):', error);
         if (axios.isAxiosError(error)) {
            console.error('❌ Axios error details:', error.response?.data);
         }
         throw new Error('Gagal membuat order pembayaran');
      }
   }

   /**
    * Check payment status using direct API call
    */
   async checkPaymentStatus(refId: string, nominal: number): Promise<PaymentStatusResponse> {
      try {
         const params = new URLSearchParams({
            merchant: this.merchantId,
            secret: this.secretKey,
            ref_id: refId,
            nominal: nominal.toString(),
            metode: 'QRIS',
         });

         const response = await axios.get(`${this.baseUrl}/order?${params.toString()}`);

         console.log('✅ TokoPay status check response:', response.data);

         if (response.data.status === 'Success' && response.data.data) {
            return {
               success: true,
               data: {
                  reference: response.data.data.trx_id || refId,
                  status: response.data.data.status === 'Success' ? 'PAID' : 'UNPAID',
                  total_bayar: response.data.data.total_bayar || nominal,
                  total_diterima: response.data.data.total_diterima || 0,
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
         console.error('❌ Error checking payment status (direct):', error);
         throw new Error('Gagal memeriksa status pembayaran');
      }
   }

   /**
    * Post transaction to API after successful payment
    */
   async postTransactionToAPI(paymentData: Record<string, unknown>, productId: string, status: boolean = true): Promise<Record<string, unknown>> {
      try {
         // Use merchant_ref (ref_id) instead of reference (trx_id)
         const invoice = paymentData.merchant_ref;
         const endpoint = `${this.apiBaseUrl}/api/transactions/${invoice}/after-payment-telegram`;

         const payload = {
            status: status,
         };

         console.log('🔍 Post-payment API call:', endpoint, payload);

         const response = await axios.post(endpoint, payload, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${this.jwtToken}`,
            },
         });

         console.log('✅ Post-payment API response:', response.data);
         return response.data;
      } catch (error) {
         console.error('❌ Error posting transaction to API:', error instanceof Error ? error.message : 'Unknown error');
         if (axios.isAxiosError(error)) {
            console.error('❌ Axios error details:', error.response?.data);
         }
         throw error;
      }
   }

   /**
    * Create TokoPay order for existing transaction (without validation)
    */
   async createTokoPayOrderForExistingTransaction(price: number, productId?: string, originalInvoice?: string): Promise<PaymentResponse> {
      try {
         console.log('🔍 createTokoPayOrderForExistingTransaction: Creating TokoPay order for existing transaction...');
         console.log('  - price:', price);
         console.log('  - productId:', productId);
         console.log('  - originalInvoice:', originalInvoice);

         // Step 1: Use original invoice as refId if provided, otherwise generate new one
         const refId = originalInvoice || this.generateRefId();
         console.log('  - Using refId:', refId);

         // Step 2: Create TokoPay order directly (no validation needed)
         console.log('🔍 Step 2: Creating TokoPay order...');
         const order = {
            refId,
            metode: 'QRIS',
            nominal: price,
         };
         console.log('  - TokoPay order params:', order);

         const paymentResponse = await this.createOrder(order);
         console.log('✅ TokoPay order created:', paymentResponse);

         // Step 3: Start monitoring payment with 15-minute timeout
         console.log('🔍 Step 3: Starting payment monitoring...');
         this.startPaymentMonitoringForExistingTransaction(refId, price, paymentResponse.data, productId);

         return paymentResponse;
      } catch (error) {
         console.error('❌ Create TokoPay order error:', error);
         throw error;
      }
   }

   /**
    * Complete payment flow: validate -> create order -> monitor -> post success
    */
   async processPaymentFlow(productId: string, productName: string, price: number, buyerName: string): Promise<PaymentResponse> {
      try {
         console.log('🔍 processPaymentFlow: Starting payment flow...');
         console.log('  - productId:', productId);
         console.log('  - productName:', productName);
         console.log('  - price:', price);
         console.log('  - buyerName:', buyerName);

         // Step 1: Generate ref ID
         const refId = this.generateRefId();
         console.log('  - Generated refId:', refId);

         // Step 2: Pre-payment validation (booking) - hanya untuk backend API
         console.log('🔍 Step 2: Pre-payment validation...');
         const validation = await this.validateTransactionBeforePayment(productId, refId, buyerName);
         if (!validation.success) {
            console.error('❌ Validation failed:', validation.message);
            throw new Error(validation.message || 'Product validation failed');
         }
         console.log('✅ Validation successful');

         // Step 3: Create TokoPay order (TIDAK perlu productId)
         console.log('🔍 Step 3: Creating TokoPay order...');
         const order = {
            refId,
            metode: 'QRIS',
            nominal: price,
         };
         console.log('  - TokoPay order params:', order);

         const paymentResponse = await this.createOrder(order);
         console.log('✅ TokoPay order created:', paymentResponse);

         // Step 4: Start monitoring payment with 15-minute timeout
         this.startPaymentMonitoring(refId, price, productId, paymentResponse.data);

         return paymentResponse;
      } catch (error) {
         console.error('❌ Payment flow error:', error);
         throw error;
      }
   }

   /**
    * Monitor payment status with 15-minute timeout
    */
   private async startPaymentMonitoring(refId: string, nominal: number, productId: string, paymentData: Record<string, unknown>): Promise<void> {
      const TIMEOUT_MINUTES = 15; // 15 minutes timeout for production
      const CHECK_INTERVAL_SECONDS = 10; // Check every 10 seconds
      const maxChecks = (TIMEOUT_MINUTES * 60) / CHECK_INTERVAL_SECONDS;
      let checkCount = 0;

      console.log(`🔍 Starting payment monitoring for ${TIMEOUT_MINUTES} minutes...`);
      console.log(`  - Ref ID: ${refId}`);
      console.log(`  - Check interval: ${CHECK_INTERVAL_SECONDS} seconds`);
      console.log(`  - Max checks: ${maxChecks}`);

      const monitorInterval = setInterval(async () => {
         checkCount++;
         console.log(`🔍 Payment check #${checkCount}/${maxChecks} for ${refId}...`);

         try {
            const statusResponse = await this.checkPaymentStatus(refId, nominal);

            if (statusResponse.success && statusResponse.data?.status === 'PAID') {
               console.log(`✅ Payment completed for ${refId}!`);
               clearInterval(monitorInterval);

               // Send success status to API
               await this.postTransactionToAPI(paymentData, productId, true);
            } else if (checkCount >= maxChecks) {
               console.log(`⏰ Payment timeout after ${TIMEOUT_MINUTES} minutes for ${refId}`);
               clearInterval(monitorInterval);

               // Send failure status to API
               await this.postTransactionToAPI(paymentData, productId, false);
            } else {
               console.log(`⏳ Payment still pending for ${refId} (${checkCount}/${maxChecks} checks)`);
            }
         } catch (error) {
            console.error(`❌ Error checking payment status for ${refId}:`, error);

            if (checkCount >= maxChecks) {
               console.log(`⏰ Payment timeout after ${TIMEOUT_MINUTES} minutes for ${refId} (with errors)`);
               clearInterval(monitorInterval);

               // Send failure status to API even if there were errors
               try {
                  await this.postTransactionToAPI(paymentData, productId, false);
               } catch (postError) {
                  console.error(`❌ Error posting failure status for ${refId}:`, postError);
               }
            }
         }
      }, CHECK_INTERVAL_SECONDS * 1000);

      // Store interval reference for potential cleanup
      this.activeMonitors.set(refId, monitorInterval);
   }

   /**
    * Monitor payment status with 15-minute timeout for existing transactions
    */
   private async startPaymentMonitoringForExistingTransaction(refId: string, nominal: number, paymentData: Record<string, unknown>, productId?: string): Promise<void> {
      const TIMEOUT_MINUTES = 15; // 15 minutes timeout for production
      const CHECK_INTERVAL_SECONDS = 10; // Check every 10 seconds
      const maxChecks = (TIMEOUT_MINUTES * 60) / CHECK_INTERVAL_SECONDS;
      let checkCount = 0;

      console.log(`🔍 Starting payment monitoring for existing transaction ${refId} for ${TIMEOUT_MINUTES} minutes...`);
      console.log(`  - Check interval: ${CHECK_INTERVAL_SECONDS} seconds`);
      console.log(`  - Max checks: ${maxChecks}`);

      const monitorInterval = setInterval(async () => {
         checkCount++;
         console.log(`🔍 Payment check #${checkCount}/${maxChecks} for existing transaction ${refId}...`);

         try {
            const statusResponse = await this.checkPaymentStatus(refId, nominal);

            if (statusResponse.success && statusResponse.data?.status === 'PAID') {
               console.log(`✅ Payment completed for existing transaction ${refId}!`);
               clearInterval(monitorInterval);

               // Send success status to API
               await this.postTransactionToAPI(paymentData, productId || '', true);
            } else if (checkCount >= maxChecks) {
               console.log(`⏰ Payment timeout after ${TIMEOUT_MINUTES} minutes for existing transaction ${refId}`);
               clearInterval(monitorInterval);

               // Send failure status to API
               await this.postTransactionToAPI(paymentData, productId || '', false);
            } else {
               console.log(`⏳ Payment still pending for existing transaction ${refId} (${checkCount}/${maxChecks} checks)`);
            }
         } catch (error) {
            console.error(`❌ Error checking payment status for existing transaction ${refId}:`, error);

            if (checkCount >= maxChecks) {
               console.log(`⏰ Payment timeout after ${TIMEOUT_MINUTES} minutes for existing transaction ${refId} (with errors)`);
               clearInterval(monitorInterval);

               // Send failure status to API even if there were errors
               try {
                  await this.postTransactionToAPI(paymentData, productId || '', false);
               } catch (postError) {
                  console.error(`❌ Error posting failure status for existing transaction ${refId}:`, postError);
               }
            }
         }
      }, CHECK_INTERVAL_SECONDS * 1000);

      // Store interval reference for potential cleanup
      this.activeMonitors.set(refId, monitorInterval);
   }

   // Store active monitoring intervals
   private activeMonitors = new Map<string, NodeJS.Timeout>();

   /**
    * Stop monitoring for a specific payment (if needed)
    */
   stopPaymentMonitoring(refId: string): void {
      const interval = this.activeMonitors.get(refId);
      if (interval) {
         clearInterval(interval);
         this.activeMonitors.delete(refId);
         console.log(`🛑 Stopped monitoring for ${refId}`);
      }
   }

   /**
    * Generate unique reference ID for our system
    */
   generateRefId(): string {
      const timestamp = Date.now();
      const random = Math.random().toString(36).substring(2, 8);
      return `WEB${timestamp}${random}`.toUpperCase();
   }
}

export const tokoPayServerService = new TokoPayServerService();
