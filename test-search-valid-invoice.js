import 'dotenv/config';
import axios from 'axios';

async function testSearchValidInvoice() {
   try {
      console.log('🔍 Testing Search with Valid Invoice...');

      const jwtToken = process.env.JWT_TOKEN;
      const apiBaseUrl = 'https://techexs.it.com';

      console.log('JWT Token present:', jwtToken ? 'YES' : 'NO');

      // First, let's try to get some transaction data to find a valid invoice
      console.log('\n🧪 Step 1: Trying to get transaction list...');

      try {
         const listResponse = await axios.get(`${apiBaseUrl}/api/transactions`, {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${jwtToken}`,
            },
         });

         console.log('✅ Transaction list response:', JSON.stringify(listResponse.data, null, 2));

         if (listResponse.data.success && listResponse.data.data && listResponse.data.data.length > 0) {
            const firstTransaction = listResponse.data.data[0];
            console.log('\n📋 Found transaction:', firstTransaction.invoice);

            // Now test search with this invoice
            console.log('\n🧪 Step 2: Testing search with found invoice...');
            const searchResponse = await axios.get(`${apiBaseUrl}/api/transaction/${firstTransaction.invoice}`, {
               headers: {
                  'Content-Type': 'application/json',
                  Authorization: `Bearer ${jwtToken}`,
               },
            });

            console.log('✅ Search response:', JSON.stringify(searchResponse.data, null, 2));
         }
      } catch (listError) {
         console.log('❌ Could not get transaction list:', listError.response?.data || listError.message);

         // Try alternative endpoints
         const alternativeEndpoints = ['/api/transaction-list', '/api/transactions/list', '/api/orders', '/api/orders/list'];

         for (const altEndpoint of alternativeEndpoints) {
            try {
               console.log(`\n🧪 Trying alternative endpoint: ${altEndpoint}`);
               const altResponse = await axios.get(`${apiBaseUrl}${altEndpoint}`, {
                  headers: {
                     'Content-Type': 'application/json',
                     Authorization: `Bearer ${jwtToken}`,
                  },
               });

               console.log('✅ Alternative endpoint response:', JSON.stringify(altResponse.data, null, 2));
               break;
            } catch (altError) {
               console.log(`❌ ${altEndpoint} failed:`, altError.response?.data || altError.message);
            }
         }
      }
   } catch (error) {
      console.error('❌ Test failed:', error.message);
   }
}

// Run test
testSearchValidInvoice();
