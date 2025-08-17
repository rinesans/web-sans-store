const tokopay = require('tokopay');

// Test configuration
const MERCHANT_ID = process.env.NEXT_PUBLIC_TOKOPAY_MERCHANT_ID || 'your_merchant_id';
const SECRET_KEY = process.env.NEXT_PUBLIC_TOKOPAY_SECRET_KEY || 'your_secret_key';

const client = new tokopay(MERCHANT_ID, SECRET_KEY);

async function testTokoPay() {
   console.log('🧪 Testing TokoPay Integration...\n');

   try {
      // Test 1: Get account info
      console.log('1️⃣ Testing account info...');
      const accountInfo = await client.info();
      console.log('✅ Account info:', accountInfo);
      console.log('');

      // Test 2: Create simple order
      console.log('2️⃣ Testing order creation...');
      const refId = 'TEST' + Date.now();
      const order = await client.simpleOrder(refId, 'QRIS', 10000);
      console.log('✅ Order created:', {
         refId: order.data?.trx_id,
         qr_link: order.data?.qr_link,
         pay_url: order.data?.pay_url,
         status: order.data?.status,
      });
      console.log('');

      // Test 3: Check payment status
      console.log('3️⃣ Testing payment status...');
      const status = await client.simpleOrder(refId, 'QRIS', 10000);
      console.log('✅ Payment status:', {
         reference: status.data?.trx_id,
         status: status.data?.status,
         total_bayar: status.data?.total_bayar,
      });
      console.log('');

      console.log('🎉 All tests passed! TokoPay integration is working correctly.');
      console.log('\n📝 Next steps:');
      console.log('1. Update your .env.local with real credentials');
      console.log('2. Test with real payment flow');
      console.log('3. Deploy to production');
   } catch (error) {
      console.error('❌ Test failed:', error.message);
      console.log('\n🔧 Troubleshooting:');
      console.log('1. Check your Merchant ID and Secret Key');
      console.log('2. Verify your TokoPay account is active');
      console.log('3. Check your internet connection');
   }
}

// Run test
testTokoPay();


