import 'dotenv/config';
import axios from 'axios';

async function testServerEnvironment() {
   try {
      console.log('🔍 Testing Server Environment Variables...');

      const merchantId = process.env.TOKOPAY_MERCHANT_ID;
      const secretKey = process.env.TOKOPAY_SECRET_KEY;
      const jwtToken = process.env.JWT_TOKEN;

      console.log('\n📋 Environment Variables:');
      console.log('  Merchant ID:', merchantId ? 'SET' : 'MISSING');
      console.log('  Secret Key:', secretKey ? 'SET' : 'MISSING');
      console.log('  JWT Token:', jwtToken ? 'SET' : 'MISSING');

      if (!merchantId || !secretKey || !jwtToken) {
         console.error('❌ Missing environment variables!');
         return;
      }

      // Test backend API call with JWT token
      console.log('\n🧪 Testing Backend API with JWT Token...');

      const refId = `TEST${Date.now()}`;
      const payload = {
         invoice: refId,
         product_idnumber: '1',
         id_telegram: String(Math.floor(Math.random() * 900000000) + 100000000),
         buyer_name: 'Test User',
         method: 'QRIS',
      };

      console.log('  Payload:', payload);
      console.log('  JWT Token present:', jwtToken ? 'YES' : 'NO');

      const response = await axios.post('https://techexs.it.com/api/transaction-telegram', payload, {
         headers: {
            Authorization: `Bearer ${jwtToken}`,
            'Content-Type': 'application/json',
         },
      });

      console.log('✅ Backend API Response:', response.data);

      if (response.data.success) {
         console.log('✅ Backend API call successful!');
      } else {
         console.log('❌ Backend API call failed:', response.data.message);
      }
   } catch (error) {
      console.error('❌ Test failed:', error.message);
      if (error.response) {
         console.error('  Status:', error.response.status);
         console.error('  Data:', error.response.data);
         console.error('  Headers sent:', error.config?.headers);
      }
   }
}

testServerEnvironment();
