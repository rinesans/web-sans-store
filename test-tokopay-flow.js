import 'dotenv/config';
import axios from 'axios';

// Test correct TokoPay flow
async function testTokoPayFlow() {
   try {
      console.log('🔍 Testing Correct TokoPay Flow...');

      const merchantId = process.env.TOKOPAY_MERCHANT_ID;
      const secretKey = process.env.TOKOPAY_SECRET_KEY;
      const jwtToken = process.env.JWT_TOKEN;

      if (!merchantId || !secretKey || !jwtToken) {
         console.error('❌ Missing required credentials!');
         return;
      }

      console.log('📋 Environment Variables:');
      console.log('  Merchant ID:', merchantId ? 'SET' : 'MISSING');
      console.log('  Secret Key:', secretKey ? 'SET' : 'MISSING');
      console.log('  JWT Token:', jwtToken ? 'SET' : 'MISSING');

      const baseUrl = 'https://api.tokopay.id/v1';
      const apiBaseUrl = 'https://techexs.it.com';

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

      // Step 1: Generate ref_id
      const refId = `WEB${Date.now()}${Math.random().toString(36).substring(2, 8)}`.toUpperCase();
      console.log('\n🔍 Step 1: Generated ref_id:', refId);

      // Step 2: Pre-payment validation (backend API) - memerlukan productId
      console.log('\n🧪 Step 2: Pre-payment validation (Backend API)...');
      try {
         const validationPayload = {
            invoice: refId,
            product_idnumber: product.id.toString(),
            id_telegram: String(Math.floor(Math.random() * 900000000) + 100000000),
            buyer_name: 'Web User',
            method: 'QRIS',
         };

         console.log('  Validation payload:', validationPayload);

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

      // Step 3: Create TokoPay order - TIDAK memerlukan productId
      console.log('\n🧪 Step 3: Creating TokoPay order...');
      try {
         const params = new URLSearchParams({
            merchant: merchantId,
            secret: secretKey,
            ref_id: refId,
            nominal: product.price.toString(),
            metode: 'QRIS',
         });

         console.log('  TokoPay params:', params.toString());
         console.log('  Note: TokoPay TIDAK memerlukan productId!');

         const orderResponse = await axios.get(`${baseUrl}/order?${params.toString()}`);

         console.log('✅ TokoPay order response:', orderResponse.data);

         if (orderResponse.data.status === 'Success') {
            console.log('✅ Order created successfully!');
            console.log('  TRX ID:', orderResponse.data.data?.trx_id);
            console.log('  QR Link:', orderResponse.data.data?.qr_link);
         } else {
            console.error('❌ Order creation failed:', orderResponse.data);
         }
      } catch (error) {
         console.error('❌ TokoPay order error:', error.response?.data || error.message);
      }
   } catch (error) {
      console.error('❌ General error:', error);
   }
}

testTokoPayFlow();
