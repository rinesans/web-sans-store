# Komponen Toko Sans

Dokumentasi komponen-komponen yang digunakan dalam proyek Toko Sans.

## 🎨 UI Components

### Button

Komponen tombol dengan berbagai variant dan ukuran.

```tsx
import { Button } from '@/components/ui/button';

<Button variant="default" size="lg">
   Click Me
</Button>;
```

**Props:**

-  `variant`: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
-  `size`: "default" | "sm" | "lg" | "icon"
-  `asChild`: boolean

### Card

Komponen card untuk menampilkan konten dalam container.

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

<Card>
   <CardHeader>
      <CardTitle>Title</CardTitle>
   </CardHeader>
   <CardContent>Content</CardContent>
</Card>;
```

### Badge

Komponen badge untuk menampilkan status atau label.

```tsx
import { Badge } from '@/components/ui/badge';

<Badge variant="secondary">Label</Badge>;
```

**Props:**

-  `variant`: "default" | "secondary" | "destructive" | "outline"

### Dialog

Komponen modal dialog untuk menampilkan konten overlay.

```tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

<Dialog>
   <DialogContent>
      <DialogHeader>
         <DialogTitle>Title</DialogTitle>
      </DialogHeader>
      Content
   </DialogContent>
</Dialog>;
```

## 🏗️ Layout Components

### Header

Header utama website dengan logo dan navigasi.

```tsx
import { Header } from '@/components/Header';

<Header />;
```

**Fitur:**

-  Logo dan brand name
-  Navigation menu
-  Shopping cart button
-  Responsive design

### Hero

Section hero dengan call-to-action utama.

```tsx
import { Hero } from '@/components/Hero';

<Hero />;
```

**Fitur:**

-  Headline dan description
-  Call-to-action buttons
-  Feature highlights
-  Responsive design

## 📊 Data Components

### StatsCards

Menampilkan statistik toko dalam bentuk cards.

```tsx
import { StatsCards } from '@/components/StatsCard';

<StatsCards totalTransactions={471} totalCustomers={219} totalProducts={12} />;
```

**Props:**

-  `totalTransactions`: number
-  `totalCustomers`: number
-  `totalProducts`: number

### ProductGrid

Grid produk dengan card yang menarik.

```tsx
import { ProductGrid } from '@/components/ProductCard';

<ProductGrid products={products} onBuyNow={handleBuyNow} />;
```

**Props:**

-  `products`: Product[]
-  `onBuyNow`: (product: Product) => void

### ProductCard

Card individual untuk menampilkan produk.

```tsx
import { ProductCard } from '@/components/ProductCard';

<ProductCard product={product} onBuyNow={handleBuyNow} />;
```

**Props:**

-  `product`: Product
-  `onBuyNow`: (product: Product) => void

### ProductModal

Modal untuk menampilkan detail produk.

```tsx
import { ProductModal } from '@/components/ProductModal';

<ProductModal product={product} onBuyNow={handleBuyNow}>
   <Button>View Details</Button>
</ProductModal>;
```

**Props:**

-  `product`: Product
-  `onBuyNow`: (product: Product) => void
-  `children`: React.ReactNode

## 📝 Content Components

### Testimonials

Section testimoni pelanggan.

```tsx
import { Testimonials } from '@/components/Testimonials';

<Testimonials />;
```

**Fitur:**

-  Customer reviews
-  Star ratings
-  Product categories
-  Responsive grid

### FAQ

Section pertanyaan yang sering diajukan.

```tsx
import { FAQ } from '@/components/FAQ';

<FAQ />;
```

**Fitur:**

-  Expandable questions
-  Smooth animations
-  Contact CTA
-  Responsive design

### CTA (Call to Action)

Section untuk mendorong pembelian.

```tsx
import { CTA } from '@/components/CTA';

<CTA />;
```

**Fitur:**

-  Compelling headline
-  Feature highlights
-  Action buttons
-  Social proof

## 🔧 Utility Components

### LoadingSpinner

Komponen loading untuk UX yang lebih baik.

```tsx
import { LoadingSpinner } from '@/components/LoadingSpinner';

<LoadingSpinner size="lg" />;
```

**Props:**

-  `size`: "sm" | "default" | "lg"

### LoadingCard

Skeleton loading untuk card.

```tsx
import { LoadingCard } from '@/components/LoadingSpinner';

<LoadingCard />;
```

## 📱 Responsive Design

Semua komponen didesain responsif dengan breakpoints:

-  **Mobile**: < 768px (1 kolom)
-  **Tablet**: 768px - 1024px (2 kolom)
-  **Desktop**: > 1024px (3 kolom)

## 🎨 Styling

Komponen menggunakan:

-  **Tailwind CSS** untuk styling
-  **CSS Variables** untuk theming
-  **shadcn/ui** design system
-  **Lucide React** untuk icons

## 🔄 State Management

Komponen menggunakan:

-  **React Hooks** untuk local state
-  **Props** untuk data flow
-  **Event handlers** untuk interactions

## ♿ Accessibility

Komponen mengikuti:

-  **ARIA labels** untuk screen readers
-  **Keyboard navigation** support
-  **Focus management** untuk modals
-  **Semantic HTML** structure
