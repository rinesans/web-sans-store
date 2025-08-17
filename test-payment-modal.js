// Simulate PaymentModal component behavior
function simulatePaymentModal() {
   console.log('🔍 Simulating PaymentModal Component...');

   // Simulate product data from API
   const product = {
      id: 1,
      name: 'Canva 1 Bulan',
      slug: 'canva-1-bulan',
      description: 'Canva Pro 1 Bulan adalah langganan premium...',
      tnc: '<p>☑️ Berlaku selama 30 hari sejak aktivasi...</p>',
      type: 'Canva',
      image: '20250812105424-6.webp',
      price: 1000,
      accounts_unsold_count: 1,
   };

   console.log('📋 Product Data:');
   console.log('  ID:', product.id);
   console.log('  ID Type:', typeof product.id);
   console.log('  Name:', product.name);
   console.log('  Price:', product.price);
   console.log('  Price Type:', typeof product.price);

   // Simulate createPaymentOrder function
   const nominal = product.price;
   const buyerName = 'Web User';

   console.log('\n🔗 URLSearchParams:');
   const params = new URLSearchParams({
      nominal: nominal.toString(),
      metode: 'QRIS',
      productId: product.id.toString(),
      productName: product.name,
      buyerName: buyerName,
   });

   console.log('  Params string:', params.toString());
   console.log('  productId in params:', params.get('productId'));
   console.log('  nominal in params:', params.get('nominal'));

   // Test if productId is undefined
   if (params.get('productId') === 'undefined') {
      console.log('❌ ERROR: productId is undefined!');
   } else {
      console.log('✅ SUCCESS: productId is correctly set to:', params.get('productId'));
   }
}

simulatePaymentModal();
