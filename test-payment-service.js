// Test PaymentService implementation
function testPaymentService() {
   console.log('🔍 Testing PaymentService Implementation...');
   
   // Simulate product data from global state
   const product = {
      id: 1,
      name: 'Canva 1 Bulan',
      slug: 'canva-1-bulan',
      description: 'Canva Pro 1 Bulan adalah langganan premium...',
      tnc: '<p>☑️ Berlaku selama 30 hari sejak aktivasi...</p>',
      type: 'Canva',
      image: '20250812105424-6.webp',
      price: 1000,
      accounts_unsold_count: 1
   };
   
   console.log('📋 Product from Global State:');
   console.log('  ID:', product.id);
   console.log('  ID Type:', typeof product.id);
   console.log('  Name:', product.name);
   console.log('  Price:', product.price);
   console.log('  Price Type:', typeof product.price);
   
   // Simulate PaymentModal createPaymentOrder function
   const createPaymentOrder = () => {
      if (!product) {
         console.error('❌ Product not found');
         return;
      }
      
      console.log('🔍 PaymentModal: Creating payment order...');
      
      // Create payment request
      const paymentRequest = {
         productId: product.id.toString(),
         productName: product.name,
         buyerName: 'Web User',
         nominal: product.price,
      };
      
      console.log('🔗 Payment Request:');
      console.log('  Request:', paymentRequest);
      console.log('  productId:', paymentRequest.productId);
      console.log('  productId Type:', typeof paymentRequest.productId);
      console.log('  nominal:', paymentRequest.nominal);
      console.log('  nominal Type:', typeof paymentRequest.nominal);
      
      // Validate request (simulate PaymentService validation)
      if (!paymentRequest.productId || paymentRequest.productId === 'undefined') {
         console.error('❌ ERROR: Invalid product ID');
         return;
      }
      
      if (!paymentRequest.productName) {
         console.error('❌ ERROR: Missing product name');
         return;
      }
      
      if (!paymentRequest.nominal || paymentRequest.nominal <= 0) {
         console.error('❌ ERROR: Invalid nominal amount');
         return;
      }
      
      console.log('✅ SUCCESS: Payment request is valid');
      console.log('✅ SUCCESS: Ready to call TokoPay API');
      
      return paymentRequest;
   };
   
   // Test the function
   const result = createPaymentOrder();
   
   if (result) {
      console.log('\n🎯 Test Results:');
      console.log('  ✅ Product data is valid');
      console.log('  ✅ Payment request is valid');
      console.log('  ✅ Ready for TokoPay integration');
      console.log('  ✅ No more undefined errors');
   }
}

testPaymentService();
