import 'dotenv/config';
import { tokoPayServerService } from './src/services/tokopay-server.ts';

async function testServerService() {
   try {
      console.log('🔍 Testing Server-Side TokoPay Service...');

      // Test environment variables
      console.log('\n📋 Environment Variables Check:');
      console.log('  Merchant ID:', process.env.TOKOPAY_MERCHANT_ID ? 'SET' : 'MISSING');
      console.log('  Secret Key:', process.env.TOKOPAY_SECRET_KEY ? 'SET' : 'MISSING');
      console.log('  JWT Token:', process.env.JWT_TOKEN ? 'SET' : 'MISSING');

      // Simulate product data
      const product = {
         id: 1,
         name: 'Canva 1 Bulan',
         price: 1000,
      };

      console.log('\n📋 Product Data:');
      console.log('  ID:', product.id);
      console.log('  Name:', product.name);
      console.log('  Price:', product.price);

      // Test complete payment flow
      console.log('\n🧪 Testing Complete Payment Flow...');

      const response = await tokoPayServerService.processPaymentFlow(product.id.toString(), product.name, product.price, 'Web User');

      console.log('✅ Payment Flow Result:', response);

      if (response.status === 'Success') {
         console.log('✅ Payment flow successful!');
         console.log('  Reference:', response.data.reference);
         console.log('  Merchant Ref:', response.data.merchant_ref);
         console.log('  QR URL:', response.data.qr_url);
      } else {
         console.log('❌ Payment flow failed:', response);
      }
   } catch (error) {
      console.error('❌ Test failed:', error.message);
      if (error.response) {
         console.error('  Status:', error.response.status);
         console.error('  Data:', error.response.data);
      }
   }
}

testServerService();
