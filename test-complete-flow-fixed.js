import 'dotenv/config';
import axios from 'axios';

// Test complete payment flow with same ref_id
async function testCompleteFlowFixed() {
   try {
      console.log('🔍 Testing Complete Payment Flow (Fixed)...');

      const merchantId = process.env.TOKOPAY_MERCHANT_ID;
      const secretKey = process.env.TOKOPAY_SECRET_KEY;
      const jwtToken = process.env.JWT_TOKEN;

      console.log('📋 Environment Variables:');
      console.log('  Merchant ID:', merchantId ? 'SET' : 'MISSING');
      console.log('  Secret Key:', secretKey ? 'SET' : 'MISSING');
      console.log('  JWT Token:', jwtToken ? 'SET' : 'MISSING');

      if (!merchantId || !secretKey || !jwtToken) {
         console.error('❌ Missing required credentials!');
         return;
      }

      const baseUrl = 'https://api.tokopay.id/v1';
      const apiBaseUrl = 'https://techexs.it.com';

      // Use same ref_id for both validation and order
      const refId = `TEST${Date.now()}`;
      const productId = '1'; // Test product ID
      const telegramId = Math.floor(Math.random() * 900000000) + 100000000;

      // Test 1: Pre-payment validation
      console.log('\n🧪 Test 1: Pre-payment validation...');
      try {
         const validationPayload = {
            invoice: refId,
            product_idnumber: String(productId),
            id_telegram: String(telegramId),
            buyer_name: 'Test Web User',
            method: 'QRIS',
         };

         console.log('  Validation payload:', validationPayload);

         const validationResponse = await axios.post(`${apiBaseUrl}/api/transaction-telegram`, validationPayload, {
            headers: {
               Authorization: `Bearer ${jwtToken}`,
               'Content-Type': 'application/json',
            },
         });

         console.log('✅ Validation response:', validationResponse.data);

         if (validationResponse.data.success) {
            console.log('✅ Pre-payment validation successful!');
         } else {
            console.error('❌ Pre-payment validation failed:', validationResponse.data);
            return;
         }
      } catch (error) {
         console.error('❌ Validation error:', error.response?.data || error.message);
         return;
      }

      // Test 2: Create TokoPay order with same ref_id
      console.log('\n🧪 Test 2: Creating TokoPay order...');
      try {
         const nominal = 1000;
         const metode = 'QRIS';

         const params = new URLSearchParams({
            merchant: merchantId,
            secret: secretKey,
            ref_id: refId, // Use same ref_id
            nominal: nominal.toString(),
            metode: metode,
         });

         console.log('  Order parameters:', { refId, nominal, metode });

         const orderResponse = await axios.get(`${baseUrl}/order?${params.toString()}`);

         console.log('✅ Order response:', orderResponse.data);

         if (orderResponse.data.status === 'Success') {
            console.log('✅ Order created successfully!');
            console.log('  TRX ID:', orderResponse.data.data?.trx_id);
            console.log('  QR Link:', orderResponse.data.data?.qr_link);

            // Test 3: Post-payment API using same ref_id
            console.log('\n🧪 Test 3: Post-payment API call...');
            try {
               // Use ref_id (not trx_id) for post-payment
               const postPayload = {
                  status: true,
               };

               console.log('  Post-payment payload:', postPayload);
               console.log('  Using ref_id for post-payment:', refId);

               const postResponse = await axios.post(`${apiBaseUrl}/api/transactions/${refId}/after-payment-telegram`, postPayload, {
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${jwtToken}`,
                  },
               });

               console.log('✅ Post-payment response:', postResponse.data);

               if (postResponse.data.success) {
                  console.log('✅ Post-payment API successful!');
                  if (postResponse.data.data?.account) {
                     console.log('  Account delivered:', postResponse.data.data.account);
                  }
               } else {
                  console.error('❌ Post-payment API failed:', postResponse.data);
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

// Run test
testCompleteFlowFixed();

