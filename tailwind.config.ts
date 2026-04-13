import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3182F6',
          50: '#EBF4FF',
          100: '#D0E4FF',
          200: '#A1C9FF',
          300: '#6EADFF',
          400: '#4A97FF',
          500: '#3182F6',
          600: '#1B64DA',
          700: '#1553B5',
          800: '#0F3D85',
          900: '#0A2A5C',
        },
        gray: {
          50: '#F9FAFB',
          100: '#F2F4F6',
          200: '#E5E8EB',
          300: '#D1D6DB',
          400: '#B0B8C1',
          500: '#8B95A1',
          600: '#6B7684',
          700: '#4E5968',
          800: '#333D4B',
          900: '#191F28',
          950: '#0F1114',
        },
        secondary: {
          DEFAULT: '#00C896',
          50: '#ECFDF5',
          500: '#00C896',
          600: '#00A67B',
        },
        accent: {
          DEFAULT: '#F04452',
          50: '#FFF1F2',
          500: '#F04452',
          600: '#D93644',
        },
        navy: {
          DEFAULT: '#191F28',
          light: '#333D4B',
        },
      },
      fontFamily: {
        sans: [
          'Pretendard Variable',
          'Pretendard',
          '-apple-system',
          'BlinkMacSystemFont',
          'system-ui',
          'Helvetica Neue',
          'Arial',
          'sans-serif',
        ],
      },
      fontSize: {
        'display-1': ['72px', { lineHeight: '1.1', letterSpacing: '-0.03em', fontWeight: '800' }],
        'display-2': ['56px', { lineHeight: '1.15', letterSpacing: '-0.02em', fontWeight: '700' }],
        'display-3': ['44px', { lineHeight: '1.2', letterSpacing: '-0.02em', fontWeight: '700' }],
        'heading-1': ['36px', { lineHeight: '1.3', letterSpacing: '-0.01em', fontWeight: '700' }],
        'heading-2': ['28px', { lineHeight: '1.35', letterSpacing: '-0.01em', fontWeight: '600' }],
        'heading-3': ['22px', { lineHeight: '1.4', fontWeight: '600' }],
        'body-1': ['18px', { lineHeight: '1.7', fontWeight: '400' }],
        'body-2': ['16px', { lineHeight: '1.7', fontWeight: '400' }],
        'caption': ['14px', { lineHeight: '1.6', fontWeight: '400' }],
        'small': ['13px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '40': '10rem',
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(0,0,0,0.04)',
        'card': '0 4px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 40px rgba(0,0,0,0.1)',
        'elevated': '0 12px 48px rgba(0,0,0,0.12)',
      },
      transitionTimingFunction: {
        'toss': 'cubic-bezier(0.33, 1, 0.68, 1)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s cubic-bezier(0.33, 1, 0.68, 1) forwards',
        'fade-in': 'fadeIn 0.5s ease forwards',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

export default config
