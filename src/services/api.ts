import axios from 'axios';
import { CardInfoResponse, ProductInfoResponse } from '@/types/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://techexs.it.com/api';

export const apiService = {
   async getCardInfo(): Promise<CardInfoResponse> {
      const response = await axios.get(`${API_BASE_URL}/card-info`);
      return response.data;
   },

   async getProductInfo(): Promise<ProductInfoResponse> {
      const response = await axios.get(`${API_BASE_URL}/product-info`);
      return response.data;
   },
};
