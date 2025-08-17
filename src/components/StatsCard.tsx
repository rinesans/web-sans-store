import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ShoppingCart, Package } from 'lucide-react';

interface StatsCardProps {
   title: string;
   value: number;
   icon: React.ReactNode;
   description?: string;
}

export function StatsCard({ title, value, icon, description }: StatsCardProps) {
   return (
      <Card className="hover:shadow-lg transition-shadow duration-300 border-primary/20 hover:border-primary/30 dark:border-primary/30 dark:hover:border-primary/40 bg-gradient-to-br from-white to-primary/5 dark:from-primary/10 dark:to-primary/5">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-primary dark:text-primary">{title}</CardTitle>
            <div className="h-4 w-4 text-primary dark:text-primary">{icon}</div>
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-bold text-primary dark:text-primary">{value.toLocaleString()}</div>
            {description && <p className="text-xs text-primary dark:text-primary mt-1">{description}</p>}
         </CardContent>
      </Card>
   );
}

export function StatsCards({ totalTransactions, totalCustomers, totalProducts }: { totalTransactions: number; totalCustomers: number; totalProducts: number }) {
   return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
         <StatsCard title="Total Transaksi" value={totalTransactions} icon={<ShoppingCart className="h-4 w-4" />} description="Transaksi berhasil" />
         <StatsCard title="Total Pelanggan" value={totalCustomers} icon={<Users className="h-4 w-4" />} description="Pelanggan aktif" />
         <StatsCard title="Total Produk" value={totalProducts} icon={<Package className="h-4 w-4" />} description="Produk tersedia" />
      </div>
   );
}
