/** @type {import('tailwindcss').Config} */
module.exports = {
   darkMode: ['class'],
   content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
   prefix: '',
   theme: {
      container: {
         center: true,
         padding: '2rem',
         screens: {
            '2xl': '1400px',
         },
      },
      extend: {
         colors: {
            border: 'oklch(var(--border))',
            input: 'oklch(var(--input))',
            ring: 'var(--ring)',
            background: 'oklch(var(--background))',
            foreground: 'oklch(var(--foreground))',
            primary: {
               DEFAULT: 'var(--primary)',
               foreground: 'oklch(var(--primary-foreground))',
            },
            secondary: {
               DEFAULT: 'oklch(var(--secondary))',
               foreground: 'oklch(var(--secondary-foreground))',
            },
            destructive: {
               DEFAULT: 'oklch(var(--destructive))',
               foreground: 'oklch(var(--destructive-foreground))',
            },
            muted: {
               DEFAULT: 'oklch(var(--muted))',
               foreground: 'oklch(var(--muted-foreground))',
            },
            accent: {
               DEFAULT: 'oklch(var(--accent))',
               foreground: 'oklch(var(--accent-foreground))',
            },
            popover: {
               DEFAULT: 'oklch(var(--popover))',
               foreground: 'oklch(var(--popover-foreground))',
            },
            card: {
               DEFAULT: 'oklch(var(--card))',
               foreground: 'oklch(var(--card-foreground))',
            },
            // Custom purple color
            purple: {
               DEFAULT: '#C68EFD',
               50: '#fdf4ff',
               100: '#fae8ff',
               200: '#f5d0fe',
               300: '#f0abfc',
               400: '#e879f9',
               500: '#C68EFD',
               600: '#a855f7',
               700: '#9333ea',
               800: '#7c3aed',
               900: '#6b21a8',
            },
         },
         borderRadius: {
            lg: 'var(--radius)',
            md: 'calc(var(--radius) - 2px)',
            sm: 'calc(var(--radius) - 4px)',
         },
         keyframes: {
            'accordion-down': {
               from: { height: '0' },
               to: { height: 'var(--radix-accordion-content-height)' },
            },
            'accordion-up': {
               from: { height: 'var(--radix-accordion-content-height)' },
               to: { height: '0' },
            },
         },
         animation: {
            'accordion-down': 'accordion-down 0.2s ease-out',
            'accordion-up': 'accordion-up 0.2s ease-out',
         },
      },
   },
   plugins: [require('tailwindcss-animate')],
};
