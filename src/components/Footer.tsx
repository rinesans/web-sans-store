'use client';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { HelpCircle, MessageCircle, FileText, Mail, Phone } from 'lucide-react';
import { Logo } from './Logo';
import Link from 'next/link';

export function Footer() {
   return (
      <footer className="bg-background border-t mt-16">
         <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
               {/* Brand Section */}
               <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                     <Logo size="md" />
                     <div>
                        <h3 className="text-lg font-bold">Toko Sans</h3>
                        <p className="text-sm text-muted-foreground">Akses Premium Apps</p>
                     </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Platform terpercaya untuk membeli akun premium berbagai aplikasi dengan harga terjangkau dan kualitas terjamin.</p>
               </div>

               {/* Quick Links */}
               <div className="space-y-4">
                  <h4 className="font-semibold">Layanan</h4>
                  <div className="space-y-2">
                     <Link href="/search-transaction">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
                           Cari Transaksi
                        </Button>
                     </Link>
                     <Link href="/riwayat">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
                           Riwayat Pembelian
                        </Button>
                     </Link>
                     <Link href="/faq">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
                           <HelpCircle className="mr-2 h-4 w-4" />
                           FAQ
                        </Button>
                     </Link>
                  </div>
               </div>

               {/* Support */}
               <div className="space-y-4">
                  <h4 className="font-semibold">Dukungan</h4>
                  <div className="space-y-2">
                     <a href="https://t.me/tokosans" target="_blank" rel="noopener noreferrer">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
                           <MessageCircle className="mr-2 h-4 w-4" />
                           Telegram
                        </Button>
                     </a>
                     <Link href="/snk">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
                           <FileText className="mr-2 h-4 w-4" />
                           Syarat & Ketentuan
                        </Button>
                     </Link>
                     <Link href="/privacy">
                        <Button variant="ghost" size="sm" className="w-full justify-start text-muted-foreground hover:text-primary">
                           <FileText className="mr-2 h-4 w-4" />
                           Kebijakan Privasi
                        </Button>
                     </Link>
                  </div>
               </div>

               {/* Contact */}
               <div className="space-y-4">
                  <h4 className="font-semibold">Kontak</h4>
                  <div className="space-y-2">
                     <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span>support@tokosans.com</span>
                     </div>
                     <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>+62 812-3456-7890</span>
                     </div>
                  </div>
               </div>
            </div>

            <Separator className="my-8" />

            {/* Bottom Section */}
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
               <p className="text-sm text-muted-foreground">© 2025Toko Sans. Semua hak dilindungi.</p>
               <div className="flex items-center space-x-4 text-sm text-muted-foreground"></div>
            </div>
         </div>
      </footer>
   );
}
