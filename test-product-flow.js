import axios from 'axios';

async function testProductFlow() {
   try {
      console.log('🔍 Testing Complete Product Flow...');

      const API_BASE_URL = 'https://techexs.it.com/api';

      // Step 1: Fetch products from API
      console.log('\n🧪 Step 1: Fetching products from API...');
      const response = await axios.get(`${API_BASE_URL}/product-info`);

      if (!response.data.success) {
         console.error('❌ API response not successful');
         return;
      }

      // Step 2: Find product by slug (simulate page behavior)
      console.log('\n🧪 Step 2: Finding product by slug...');
      const productSlug = 'canva-1-bulan';
      const foundProduct = response.data.data.find((p) => p.slug === productSlug);

      if (!foundProduct) {
         console.error('❌ Product not found');
         return;
      }

      console.log('✅ Product found:', {
         id: foundProduct.id,
         idType: typeof foundProduct.id,
         name: foundProduct.name,
         price: foundProduct.price,
         priceType: typeof foundProduct.price,
         slug: foundProduct.slug,
      });

      // Step 3: Simulate PaymentModal params
      console.log('\n🧪 Step 3: Simulating PaymentModal params...');
      const nominal = foundProduct.price;
      const buyerName = 'Web User';

      const params = new URLSearchParams({
         nominal: nominal.toString(),
         metode: 'QRIS',
         productId: foundProduct.id.toString(),
         productName: foundProduct.name,
         buyerName: buyerName,
      });

      console.log('✅ URLSearchParams:', params.toString());
      console.log('  productId:', params.get('productId'));
      console.log('  nominal:', params.get('nominal'));

      // Step 4: Test if productId is undefined
      if (params.get('productId') === 'undefined') {
         console.log('❌ ERROR: productId is undefined!');
      } else {
         console.log('✅ SUCCESS: productId is correctly set to:', params.get('productId'));
      }
   } catch (error) {
      console.error('❌ Error:', error.response?.data || error.message);
   }
}

testProductFlow();
