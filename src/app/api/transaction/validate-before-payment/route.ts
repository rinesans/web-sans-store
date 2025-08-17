import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// Generate random Telegram ID for web users
function generateTelegramId(): string {
   return String(Math.floor(Math.random() * 900000000) + 100000000); // 9-digit random number
}

export async function POST(request: NextRequest) {
   try {
      const body = await request.json();
      const { productId, invoice, buyerName } = body;

      if (!productId || !invoice || !buyerName) {
         return NextResponse.json(
            {
               success: false,
               error: 'Missing required parameters',
            },
            { status: 400 }
         );
      }

      console.log('🔍 Validating before payment:', { productId, invoice, buyerName });

      // Get JWT token from environment (server-side)
      const jwtToken = process.env.JWT_TOKEN;
      if (!jwtToken) {
         console.error('❌ JWT token not found in environment variables');
         return NextResponse.json(
            {
               success: false,
               error: 'Server configuration error - JWT token missing',
            },
            { status: 500 }
         );
      }

      // Call backend API for validation
      const response = await axios.post(
         'https://techexs.it.com/api/transaction-telegram',
         {
            product_idnumber: productId,
            id_telegram: generateTelegramId(),
            invoice: invoice,
            buyer_name: buyerName,
            method: 'QRIS',
         },
         {
            headers: {
               'Content-Type': 'application/json',
               Authorization: `Bearer ${jwtToken}`,
            },
         }
      );

      console.log('✅ Validation response:', response.data);

      if (response.data && response.data.success) {
         return NextResponse.json({
            success: true,
            data: response.data.data,
         });
      } else {
         return NextResponse.json(
            {
               success: false,
               error: response.data.message || 'Validation failed',
            },
            { status: 400 }
         );
      }
   } catch (error) {
      console.error('❌ Error validating transaction:', error);

      if (axios.isAxiosError(error)) {
         console.error('❌ Axios error details:', error.response?.data);
         return NextResponse.json(
            {
               success: false,
               error: error.response?.data?.message || 'Validation error occurred',
            },
            { status: error.response?.status || 500 }
         );
      }

      return NextResponse.json(
         {
            success: false,
            error: 'Terjadi kesalahan saat validasi transaksi',
         },
         { status: 500 }
      );
   }
}
