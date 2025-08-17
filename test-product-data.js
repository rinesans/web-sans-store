import axios from 'axios';

async function testProductData() {
   try {
      console.log('🔍 Testing Product Data Structure...');

      const API_BASE_URL = 'https://techexs.it.com/api';

      const response = await axios.get(`${API_BASE_URL}/product-info`);

      console.log('✅ Product data response:', JSON.stringify(response.data, null, 2));

      if (response.data.success && response.data.data.length > 0) {
         const firstProduct = response.data.data[0];
         console.log('\n📋 First product structure:');
         console.log('  ID:', firstProduct.id);
         console.log('  Name:', firstProduct.name);
         console.log('  Slug:', firstProduct.slug);
         console.log('  Price:', firstProduct.price);
         console.log('  All fields:', Object.keys(firstProduct));
      }
   } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
   }
}

testProductData();
