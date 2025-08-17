import 'dotenv/config';
import tokopay from 'tokopay';

// Test TokoPay connection
async function testTokoPayConnection() {
   try {
      console.log('🔍 Testing TokoPay Connection...');

      const merchantId = process.env.TOKOPAY_MERCHANT_ID;
      const secretKey = process.env.TOKOPAY_SECRET_KEY;

      console.log('📋 Environment Variables:');
      console.log('  Merchant ID:', merchantId ? 'SET' : 'MISSING');
      console.log('  Secret Key:', secretKey ? 'SET' : 'MISSING');

      if (!merchantId || !secretKey) {
         console.error('❌ Missing TokoPay credentials!');
         return;
      }

      // Initialize client
      const client = new tokopay(merchantId, secretKey);
      console.log('✅ TokoPay client initialized');

      // Test 1: Get account info
      console.log('\n🧪 Test 1: Getting account info...');
      try {
         const accountInfo = await client.info();
         console.log('✅ Account info response:', accountInfo);
      } catch (error) {
         console.error('❌ Account info error:', error.message);
      }

      // Test 2: Create simple order
      console.log('\n🧪 Test 2: Creating simple order...');
      try {
         const refId = `TEST${Date.now()}`;
         const nominal = 1000;
         const metode = 'QRIS';

         console.log('  Parameters:', { refId, nominal, metode });

         const orderResponse = await client.simpleOrder(refId, metode, nominal);
         console.log('✅ Order response:', orderResponse);

         if (orderResponse) {
            console.log('  Response type:', typeof orderResponse);
            console.log('  Response keys:', Object.keys(orderResponse));
            console.log('  Response structure:', JSON.stringify(orderResponse, null, 2));
         } else {
            console.error('❌ Order response is undefined!');
         }
      } catch (error) {
         console.error('❌ Order creation error:', error.message);
         if (error.response) {
            console.error('  Response data:', error.response.data);
         }
      }

      // Test 3: Check payment status
      console.log('\n🧪 Test 3: Checking payment status...');
      try {
         const refId = `TEST${Date.now()}`;
         const nominal = 1000;

         console.log('  Parameters:', { refId, nominal });

         const statusResponse = await client.simpleOrder(refId, 'QRIS', nominal);
         console.log('✅ Status response:', statusResponse);
      } catch (error) {
         console.error('❌ Status check error:', error.message);
      }
   } catch (error) {
      console.error('❌ General error:', error);
   }
}

// Run test
testTokoPayConnection();

