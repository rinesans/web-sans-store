import { NextRequest, NextResponse } from 'next/server';
import { tokoPayServerService } from '@/services/tokopay-server';

export async function GET(request: NextRequest) {
   try {
      const { searchParams } = new URL(request.url);
      const refId = searchParams.get('refId');
      const nominal = searchParams.get('nominal');
      const metode = searchParams.get('metode');
      const productId = searchParams.get('productId');
      const productName = searchParams.get('productName');
      const buyerName = searchParams.get('buyerName');
      const action = searchParams.get('action');
      const reference = searchParams.get('reference');
      const merchant_ref = searchParams.get('merchant_ref');
      const status = searchParams.get('status');
      const originalInvoice = searchParams.get('originalInvoice');

      console.log('Payment API request:', { refId, nominal, metode, productId, productName, buyerName, action, reference, merchant_ref, status });

      // Handle post-transaction action
      if (action === 'post-transaction') {
         if (!reference || !merchant_ref || !productId) {
            return NextResponse.json({ error: 'Missing required parameters for post-transaction' }, { status: 400 });
         }

         console.log('Posting transaction to API:', { reference, merchant_ref, productId, status });
         const response = await tokoPayServerService.postTransactionToAPI({ reference, merchant_ref }, productId, status === 'true');
         return NextResponse.json(response);
      }

      // Handle create QRIS for existing transaction
      if (action === 'create-qris') {
         if (!nominal) {
            return NextResponse.json({ error: 'Missing nominal parameter for create-qris' }, { status: 400 });
         }

         console.log('Creating QRIS for existing transaction:', { nominal: parseInt(nominal), productId, originalInvoice });
         const response = await tokoPayServerService.createTokoPayOrderForExistingTransaction(parseInt(nominal), productId || undefined, originalInvoice || undefined);
         return NextResponse.json(response);
      }

      if (!nominal) {
         // Only nominal is strictly required for initial check
         return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
      }

      if (metode) {
         // Create order with complete flow
         if (productId && productName && buyerName) {
            console.log('Creating order with complete flow:', { productId, productName, buyerName, nominal: parseInt(nominal) });
            const response = await tokoPayServerService.processPaymentFlow(productId, productName, parseInt(nominal), buyerName);
            return NextResponse.json(response);
         } else {
            // Fallback to simple order creation
            if (!refId) {
               // refId is required for simple order creation
               return NextResponse.json({ error: 'refId is required for simple order creation' }, { status: 400 });
            }
            console.log('Creating simple order with params:', { refId, metode, nominal: parseInt(nominal) });
            const response = await tokoPayServerService.createOrder({
               refId,
               metode,
               nominal: parseInt(nominal),
            });
            return NextResponse.json(response);
         }
      } else {
         // Check status
         if (!refId) {
            // refId is required for status check
            return NextResponse.json({ error: 'refId is required for status check' }, { status: 400 });
         }
         console.log('Checking status with params:', { refId, nominal: parseInt(nominal) });
         const response = await tokoPayServerService.checkPaymentStatus(refId, parseInt(nominal));
         return NextResponse.json(response);
      }
   } catch (error) {
      console.error('Payment API error:', error);
      return NextResponse.json({ error: 'Failed to process payment request' }, { status: 500 });
   }
}
