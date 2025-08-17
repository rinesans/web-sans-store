import { create } from 'zustand';
import { Product } from '@/types/api';

interface ProductState {
   // Current selected product
   selectedProduct: Product | null;

   // All products from API
   products: Product[];

   // Loading states
   isLoading: boolean;
   isPaymentLoading: boolean;

   // Payment data
   paymentData: unknown;
   paymentStatus: 'pending' | 'processing' | 'paid' | 'failed' | 'expired';

   // Actions
   setSelectedProduct: (product: Product) => void;
   setProducts: (products: Product[]) => void;
   setLoading: (loading: boolean) => void;
   setPaymentLoading: (loading: boolean) => void;
   setPaymentData: (data: unknown) => void;
   setPaymentStatus: (status: 'pending' | 'processing' | 'paid' | 'failed' | 'expired') => void;
   clearPaymentData: () => void;
   reset: () => void;
}

export const useProductStore = create<ProductState>((set) => ({
   // Initial state
   selectedProduct: null,
   products: [],
   isLoading: false,
   isPaymentLoading: false,
   paymentData: null,
   paymentStatus: 'pending',

   // Actions
   setSelectedProduct: (product) => set({ selectedProduct: product }),
   setProducts: (products) => set({ products }),
   setLoading: (loading) => set({ isLoading: loading }),
   setPaymentLoading: (loading) => set({ isPaymentLoading: loading }),
   setPaymentData: (data) => set({ paymentData: data }),
   setPaymentStatus: (status) => set({ paymentStatus: status }),
   clearPaymentData: () =>
      set({
         paymentData: null,
         paymentStatus: 'pending',
         isPaymentLoading: false,
      }),
   reset: () =>
      set({
         selectedProduct: null,
         products: [],
         isLoading: false,
         isPaymentLoading: false,
         paymentData: null,
         paymentStatus: 'pending',
      }),
}));
