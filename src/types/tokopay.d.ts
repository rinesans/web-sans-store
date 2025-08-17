declare module 'tokopay' {
   interface TokoPayResponse {
      status: string;
      data: {
         trx_id: string;
         qr_link: string;
         pay_url: string;
         qr_string: string;
         total_bayar: number;
         total_diterima: number;
         status: string;
      };
   }

   class TokoPay {
      constructor(merchantId: string, secretKey: string);
      simpleOrder(refId: string, metode: string, nominal: number): Promise<TokoPayResponse>;
      info(): Promise<unknown>;
   }

   export = TokoPay;
}
