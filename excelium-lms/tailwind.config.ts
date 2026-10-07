/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
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
        // Brand Colors
        navy: {
          DEFAULT: '#0A1F44',
          light: '#1E293B',
          50: '#E8EDF5',
          100: '#C5D0E4',
          200: '#9BAECF',
          300: '#708CB9',
          400: '#4B71A8',
          500: '#2D5896',
          600: '#1E4480',
          700: '#0A1F44',
          800: '#071830',
          900: '#03101F',
        },
        gold: {
          DEFAULT: '#C9A24B',
          50: '#FAF5E9',
          100: '#F2E5C3',
          200: '#E8D099',
          300: '#DEBA6D',
          400: '#D4A84E',
          500: '#C9A24B',
          600: '#B08A35',
          700: '#8C6D27',
          800: '#685019',
          900: '#43330D',
        },
        ivory: {
          DEFAULT: '#FAF8F3',
          50: '#FFFFFF',
          100: '#FAF8F3',
          200: '#F2EDE0',
          300: '#E8DFC8',
          400: '#D9CBA8',
        },
        slate: {
          DEFAULT: '#1E293B',
        },
        emerald: {
          DEFAULT: '#10B981',
        },
        // shadcn/ui compatible tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'fluid-sm': 'clamp(0.875rem, 1.5vw, 1rem)',
        'fluid-base': 'clamp(1rem, 2vw, 1.125rem)',
        'fluid-lg': 'clamp(1.125rem, 2.5vw, 1.375rem)',
        'fluid-xl': 'clamp(1.25rem, 3vw, 1.75rem)',
        'fluid-2xl': 'clamp(1.5rem, 4vw, 2.25rem)',
        'fluid-3xl': 'clamp(2rem, 5vw, 3rem)',
        'fluid-4xl': 'clamp(2.5rem, 6vw, 4rem)',
        'fluid-5xl': 'clamp(3rem, 8vw, 5.5rem)',
      },
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #C9A24B 0%, #E8D099 50%, #C9A24B 100%)',
        'gradient-navy': 'linear-gradient(135deg, #0A1F44 0%, #1E4480 100%)',
        'gradient-mesh':
          'radial-gradient(at 40% 20%, hsla(220,80%,15%,1) 0px, transparent 50%), radial-gradient(at 80% 0%, hsla(38,60%,40%,1) 0px, transparent 50%), radial-gradient(at 0% 50%, hsla(220,80%,10%,1) 0px, transparent 50%)',
        'noise':
          'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.03\'/%3E%3C/svg%3E")',
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'counter': 'counter 2s ease-out',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'marquee': 'marquee 25s linear infinite',
        'shimmer': 'shimmer 2s linear infinite',
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
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(201,162,75,0.4)' },
          '50%': { boxShadow: '0 0 0 12px rgba(201,162,75,0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(10, 31, 68, 0.15)',
        'glass-lg': '0 20px 60px 0 rgba(10, 31, 68, 0.2)',
        'gold': '0 4px 24px rgba(201, 162, 75, 0.3)',
        'gold-lg': '0 8px 40px rgba(201, 162, 75, 0.4)',
        'navy': '0 4px 24px rgba(10, 31, 68, 0.3)',
        'card': '0 2px 8px rgba(10, 31, 68, 0.08), 0 8px 32px rgba(10, 31, 68, 0.06)',
        'card-hover': '0 8px 24px rgba(10, 31, 68, 0.12), 0 20px 60px rgba(10, 31, 68, 0.08)',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
