import axios from 'axios';

async function debugProduct() {
   try {
      console.log('🔍 Debugging Product Data...');

      const API_BASE_URL = 'https://techexs.it.com/api';

      const response = await axios.get(`${API_BASE_URL}/product-info`);

      if (response.data.success && response.data.data.length > 0) {
         const firstProduct = response.data.data[0];
         console.log('\n📋 Product Data Structure:');
         console.log('  Raw product:', firstProduct);
         console.log('  ID type:', typeof firstProduct.id);
         console.log('  ID value:', firstProduct.id);
         console.log('  ID.toString():', firstProduct.id.toString());
         console.log('  All fields:', Object.keys(firstProduct));

         // Test URLSearchParams
         const params = new URLSearchParams({
            nominal: '1000',
            metode: 'QRIS',
            productId: firstProduct.id.toString(),
            productName: firstProduct.name,
            buyerName: 'Web User',
         });

         console.log('\n🔗 URLSearchParams result:');
         console.log('  Params string:', params.toString());
         console.log('  productId in params:', params.get('productId'));
      }
   } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
   }
}

debugProduct();
