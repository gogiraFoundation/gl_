import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    container: {
      center: true,
      padding: '1rem',
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1400px',
      },
    },
    extend: {
      maxWidth: {
        content: '1200px',
        shell: '1400px',
      },
      spacing: {
        section: '4rem', // 64px for section spacing
        inner: '1.5rem', // 24px for inner padding
      },
      colors: {
        brutal: {
          bg: '#FFFFFF',
          ink: '#111111',
          muted: '#4A4A4A',
        },
        primary: {
          50: '#faf5ff',
          100: '#f3e8ff',
          200: '#e9d5ff',
          300: '#d8b4fe',
          400: '#c4b5fd',
          500: '#a78bfa',
          600: '#8b5cf6',
          700: '#7c3aed',
          800: '#6d28d9',
          900: '#5b21b6',
        },
        secondary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Times New Roman', 'Garamond', 'Georgia', 'serif'],
        mono: [
          'ui-monospace',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          'Liberation Mono',
          'Courier New',
          'monospace',
        ],
      },
      backgroundImage: {
        'gradient-primary': 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
        'gradient-secondary': 'linear-gradient(135deg, #1a1a2e 0%, #0a0a0a 100%)',
        'gradient-card':
          'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
        'gradient-mesh':
          'radial-gradient(at 0% 0%, rgba(139, 92, 246, 0.3) 0px, transparent 50%), radial-gradient(at 100% 0%, rgba(59, 130, 246, 0.3) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(139, 92, 246, 0.2) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)',
      },
      boxShadow: {
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.3)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)',
        'glow-white': '0 0 20px rgba(255, 255, 255, 0.3), 0 0 40px rgba(255, 255, 255, 0.1)',
        'glow-orange': '0 0 18px rgba(255, 69, 0, 0.45), 0 0 36px rgba(255, 99, 71, 0.25)',
        'glow-orange-lg': '0 0 28px rgba(255, 69, 0, 0.55), 0 0 52px rgba(255, 140, 0, 0.3)',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        glow: 'glow 2s ease-in-out infinite',
        'gradient-shift': 'gradient-shift 3s ease infinite',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.6s ease-out',
        'slide-in-right': 'slideInRight 0.6s ease-out',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'solar-orbit': 'solarOrbit 80s linear infinite',
        'solar-counter': 'solarCounter 80s linear infinite',
        'solar-pulse': 'solarPulse 3.5s ease-in-out infinite',
        'solar-ring': 'solarRing 20s linear infinite',
        'testimonial-marquee': 'testimonialMarquee 42s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(139, 92, 246, 0.5)' },
          '50%': {
            boxShadow: '0 0 40px rgba(139, 92, 246, 0.5), 0 0 60px rgba(139, 92, 246, 0.3)',
          },
        },
        gradientShift: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(50px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        solarOrbit: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        solarCounter: {
          from: { transform: 'translate(-50%, -50%) rotate(0deg)' },
          to: { transform: 'translate(-50%, -50%) rotate(-360deg)' },
        },
        solarPulse: {
          '0%, 100%': {
            boxShadow: '0 0 22px rgba(255, 69, 0, 0.5), 0 0 44px rgba(255, 99, 71, 0.22)',
          },
          '50%': {
            boxShadow: '0 0 36px rgba(255, 69, 0, 0.7), 0 0 58px rgba(255, 140, 0, 0.32)',
          },
        },
        solarRing: {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
        testimonialMarquee: {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
