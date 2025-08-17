'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
   const { theme, setTheme } = useTheme();
   const [mounted, setMounted] = useState(false);

   useEffect(() => {
      setMounted(true);
   }, []);

   const toggleTheme = () => {
      if (theme === 'light') {
         setTheme('dark');
      } else {
         setTheme('light');
      }
   };

   if (!mounted) {
      return (
         <Button variant="outline" size="icon" className="w-9 h-9">
            <Sun className="h-4 w-4" />
         </Button>
      );
   }

   return (
      <Button variant="outline" size="icon" className="w-9 h-9 border-purple-200 hover:border-purple-300 dark:border-purple-800 dark:hover:border-purple-700" onClick={toggleTheme} aria-label="Toggle theme">
         {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
         <span className="sr-only">Toggle theme</span>
      </Button>
   );
}
