export interface PurchaseHistory {
   id: string;
   product: string;
   account: string;
   password: string;
   purchaseDate: string;
   expiryDate: string;
}

export class HistoryService {
   private static STORAGE_KEY = 'purchase_history';
   private static EXPIRY_DAYS = 30;

   /**
    * Save purchase to history
    */
   static savePurchase(accountData: { product: string; account: string; password: string }): void {
      try {
         const history = this.getHistory();

         const purchase: PurchaseHistory = {
            id: `purchase_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            product: accountData.product,
            account: accountData.account,
            password: accountData.password,
            purchaseDate: new Date().toISOString(),
            expiryDate: new Date(Date.now() + this.EXPIRY_DAYS * 24 * 60 * 60 * 1000).toISOString(),
         };

         history.push(purchase);
         this.saveHistory(history);

         console.log('✅ Purchase saved to history:', purchase);
      } catch (error) {
         console.error('❌ Error saving purchase to history:', error);
      }
   }

   /**
    * Get all valid purchases from history
    */
   static getHistory(): PurchaseHistory[] {
      try {
         const stored = localStorage.getItem(this.STORAGE_KEY);
         if (!stored) return [];

         const history: PurchaseHistory[] = JSON.parse(stored);
         const now = new Date();

         // Filter out expired purchases
         const validHistory = history.filter((purchase) => {
            const expiryDate = new Date(purchase.expiryDate);
            return expiryDate > now;
         });

         // If some purchases were expired, update storage
         if (validHistory.length !== history.length) {
            this.saveHistory(validHistory);
         }

         return validHistory;
      } catch (error) {
         console.error('❌ Error getting history:', error);
         return [];
      }
   }

   /**
    * Delete a specific purchase from history
    */
   static deletePurchase(purchaseId: string): void {
      try {
         const history = this.getHistory();
         const filteredHistory = history.filter((purchase) => purchase.id !== purchaseId);
         this.saveHistory(filteredHistory);

         console.log('✅ Purchase deleted from history:', purchaseId);
      } catch (error) {
         console.error('❌ Error deleting purchase from history:', error);
      }
   }

   /**
    * Clear all history
    */
   static clearHistory(): void {
      try {
         localStorage.removeItem(this.STORAGE_KEY);
         console.log('✅ History cleared');
      } catch (error) {
         console.error('❌ Error clearing history:', error);
      }
   }

   /**
    * Check if a purchase is expired
    */
   static isExpired(purchase: PurchaseHistory): boolean {
      const now = new Date();
      const expiryDate = new Date(purchase.expiryDate);
      return expiryDate <= now;
   }

   /**
    * Get days remaining until expiry
    */
   static getDaysRemaining(purchase: PurchaseHistory): number {
      const now = new Date();
      const expiryDate = new Date(purchase.expiryDate);
      const diffTime = expiryDate.getTime() - now.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return Math.max(0, diffDays);
   }

   private static saveHistory(history: PurchaseHistory[]): void {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(history));
   }
}
