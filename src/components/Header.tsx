'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCircle, History, Search, Menu, X } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import Link from 'next/link';

export function Header() {
   const [isMenuOpen, setIsMenuOpen] = useState(false);

   const toggleMenu = () => {
      setIsMenuOpen(!isMenuOpen);
   };

   const closeMenu = () => {
      setIsMenuOpen(false);
   };

   return (
      <>
         <header className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 border-b-gray-300">
            <div className="container mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <Link href="/" onClick={closeMenu}>
                     <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                           <Logo size="lg" />
                           <div>
                              <h1 className="text-xl font-bold">Toko Sans</h1>
                              <p className="text-sm text-muted-foreground">Akses Premium Apps</p>
                           </div>
                        </div>
                     </div>
                  </Link>

                  {/* Desktop Navigation */}
                  <div className="hidden md:flex items-center space-x-4">
                     <Link href="/search-transaction">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary dark:hover:text-primary">
                           <Search className="mr-2 h-4 w-4" />
                           Cari Transaksi
                        </Button>
                     </Link>
                     <Link href="/riwayat">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary dark:hover:text-primary">
                           <History className="mr-2 h-4 w-4" />
                           Riwayat
                        </Button>
                     </Link>
                     <Link href="/faq">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary dark:hover:text-primary">
                           <HelpCircle className="mr-2 h-4 w-4" />
                           FAQ
                        </Button>
                     </Link>
                     <ThemeToggle />
                  </div>

                  {/* Mobile Menu Button */}
                  <div className="md:hidden flex items-center space-x-2">
                     <ThemeToggle />
                     <Button variant="ghost" size="sm" onClick={toggleMenu} className="p-2">
                        {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                     </Button>
                  </div>
               </div>

               {/* Mobile Navigation */}
               {isMenuOpen && (
                  <div className="md:hidden mt-4 pb-4 border-t border-border/50 pt-4">
                     <div className="flex flex-col space-y-2">
                        <Link href="/search-transaction" onClick={closeMenu}>
                           <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary dark:hover:text-primary">
                              <Search className="mr-2 h-4 w-4" />
                              Cari Transaksi
                           </Button>
                        </Link>
                        <Link href="/riwayat" onClick={closeMenu}>
                           <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary dark:hover:text-primary">
                              <History className="mr-2 h-4 w-4" />
                              Riwayat
                           </Button>
                        </Link>
                        <Link href="/faq" onClick={closeMenu}>
                           <Button variant="ghost" className="w-full justify-start text-muted-foreground hover:text-primary dark:hover:text-primary">
                              <HelpCircle className="mr-2 h-4 w-4" />
                              FAQ
                           </Button>
                        </Link>
                     </div>
                  </div>
               )}
            </div>
            {/* Subtle bottom border */}
            <div className="h-px bg-gradient-to-r from-transparent via-border/30 to-transparent"></div>
         </header>
      </>
   );
}
