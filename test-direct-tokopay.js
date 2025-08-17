import 'dotenv/config';
import axios from 'axios';

// Test direct TokoPay API
async function testDirectTokoPay() {
   try {
      console.log('🔍 Testing Direct TokoPay API...');

      const merchantId = process.env.TOKOPAY_MERCHANT_ID;
      const secretKey = process.env.TOKOPAY_SECRET_KEY;

      console.log('📋 Environment Variables:');
      console.log('  Merchant ID:', merchantId ? 'SET' : 'MISSING');
      console.log('  Secret Key:', secretKey ? 'SET' : 'MISSING');

      if (!merchantId || !secretKey) {
         console.error('❌ Missing TokoPay credentials!');
         return;
      }

      const baseUrl = 'https://api.tokopay.id/v1';

      // Test 1: Create order
      console.log('\n🧪 Test 1: Creating order...');
      try {
         const refId = `TEST${Date.now()}`;
         const nominal = 1000;
         const metode = 'QRIS';

         const params = new URLSearchParams({
            merchant: merchantId,
            secret: secretKey,
            ref_id: refId,
            nominal: nominal.toString(),
            metode: metode,
         });

         console.log('  Parameters:', { refId, nominal, metode });
         console.log('  API URL:', `${baseUrl}/order?${params.toString()}`);

         const response = await axios.get(`${baseUrl}/order?${params.toString()}`);

         console.log('✅ Direct API response:', response.data);

         if (response.data.status === 'Success') {
            console.log('✅ Order created successfully!');
            console.log('  TRX ID:', response.data.data?.trx_id);
            console.log('  QR Link:', response.data.data?.qr_link);
            console.log('  Pay URL:', response.data.data?.pay_url);
         } else {
            console.error('❌ Order creation failed:', response.data);
         }
      } catch (error) {
         console.error('❌ Direct API error:', error.message);
         if (error.response) {
            console.error('  Response status:', error.response.status);
            console.error('  Response data:', error.response.data);
         }
      }
   } catch (error) {
      console.error('❌ General error:', error);
   }
}

// Run test
testDirectTokoPay();

