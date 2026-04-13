import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // 우리편 브랜드 컬러
        primary: {
          DEFAULT: '#0066FF',
          50: '#E5F0FF',
          100: '#CCE0FF',
          200: '#99C2FF',
          300: '#66A3FF',
          400: '#3385FF',
          500: '#0066FF',
          600: '#0052CC',
          700: '#003D99',
          800: '#002966',
          900: '#001433',
        },
        secondary: {
          DEFAULT: '#00C896',
          50: '#E5FFF7',
          500: '#00C896',
          600: '#00A078',
        },
        accent: {
          DEFAULT: '#FF6B2C',
          50: '#FFF0E8',
          500: '#FF6B2C',
          600: '#E55A1F',
        },
        navy: {
          DEFAULT: '#1A1A2E',
          light: '#16213E',
        },
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xl: '12px',
        '2xl': '16px',
      },
    },
  },
  plugins: [],
}

export default config
