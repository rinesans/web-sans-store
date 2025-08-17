import 'dotenv/config';
import axios from 'axios';

// Test web app payment flow
async function testWebFlow() {
   try {
      console.log('🔍 Testing Web App Payment Flow...');

      const merchantId = process.env.TOKOPAY_MERCHANT_ID;
      const secretKey = process.env.TOKOPAY_SECRET_KEY;
      const jwtToken = process.env.JWT_TOKEN;

      if (!merchantId || !secretKey || !jwtToken) {
         console.error('❌ Missing required credentials!');
         return;
      }

      // Simulate web app request to /api/payment
      console.log('\n🧪 Test 1: Web app payment request...');

      const webParams = new URLSearchParams({
         nominal: '1000',
         metode: 'QRIS',
         productId: '1', // Using product.id from API
         productName: 'Canva 1 Bulan',
         buyerName: 'Web User',
      });

      console.log('  Web app params:', webParams.toString());

      // Simulate the API call that web app would make
      const baseUrl = 'https://api.tokopay.id/v1';
      const apiBaseUrl = 'https://techexs.it.com';

      // Step 1: Generate ref_id
      const refId = `WEB${Date.now()}`;
      const productId = '1';
      const telegramId = Math.floor(Math.random() * 900000000) + 100000000;

      // Step 2: Pre-payment validation
      console.log('\n🧪 Test 2: Pre-payment validation...');
      try {
         const validationPayload = {
            invoice: refId,
            product_idnumber: productId,
            id_telegram: String(telegramId),
            buyer_name: 'Web User',
            method: 'QRIS',
         };

         const validationResponse = await axios.post(`${apiBaseUrl}/api/transaction-telegram`, validationPayload, {
            headers: {
               Authorization: `Bearer ${jwtToken}`,
               'Content-Type': 'application/json',
            },
         });

         console.log('✅ Validation successful:', validationResponse.data.success);
      } catch (error) {
         console.error('❌ Validation failed:', error.response?.data || error.message);
         return;
      }

      // Step 3: Create TokoPay order
      console.log('\n🧪 Test 3: Creating TokoPay order...');
      try {
         const params = new URLSearchParams({
            merchant: merchantId,
            secret: secretKey,
            ref_id: refId,
            nominal: '1000',
            metode: 'QRIS',
         });

         const orderResponse = await axios.get(`${baseUrl}/order?${params.toString()}`);

         if (orderResponse.data.status === 'Success') {
            console.log('✅ Order created successfully!');
            console.log('  TRX ID:', orderResponse.data.data?.trx_id);
            console.log('  QR Link:', orderResponse.data.data?.qr_link);
            console.log('  Merchant Ref:', orderResponse.data.data?.merchant_ref);

            // Step 4: Simulate successful payment
            console.log('\n🧪 Test 4: Simulating successful payment...');
            try {
               const postPayload = { status: true };
               const postResponse = await axios.post(`${apiBaseUrl}/api/transactions/${refId}/after-payment-telegram`, postPayload, {
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${jwtToken}`,
                  },
               });

               if (postResponse.data.success) {
                  console.log('✅ Payment processed successfully!');
                  if (postResponse.data.data?.account) {
                     console.log('  Account delivered:', postResponse.data.data.account.account);
                  }
               } else {
                  console.error('❌ Payment processing failed:', postResponse.data);
               }
            } catch (postError) {
               console.error('❌ Post-payment error:', postError.response?.data || postError.message);
            }
         } else {
            console.error('❌ Order creation failed:', orderResponse.data);
         }
      } catch (error) {
         console.error('❌ Order creation error:', error.response?.data || error.message);
      }
   } catch (error) {
      console.error('❌ General error:', error);
   }
}

testWebFlow();
