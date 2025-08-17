export interface CardInfoResponse {
   success: boolean;
   data: {
      total_transactions: number;
      total_customers: number;
      total_products: number;
   };
}

export interface Product {
   id: number;
   name: string;
   slug: string;
   description: string;
   tnc: string;
   type: string;
   image: string;
   price: number;
   accounts_unsold_count: number;
}

export interface ProductInfoResponse {
   success: boolean;
   data: Product[];
}
