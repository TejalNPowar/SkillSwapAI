/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563EB',
          dark: '#1D4ED8',
          light: '#3B82F6',
        },
        secondary: {
          DEFAULT: '#4F46E5',
        },
        accent: {
          DEFAULT: '#10B981',
          dark: '#059669',
        },
        bg: {
          DEFAULT: '#F8FAFC',
        },
      },
      borderRadius: {
        card: '16px',
      },
      boxShadow: {
        soft: '0 2px 8px rgba(15, 23, 42, 0.06)',
        softer: '0 8px 24px rgba(15, 23, 42, 0.08)',
        glow: '0 8px 30px rgba(37, 99, 235, 0.18)',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(12px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
      },
      animation: {
        fadeUp: 'fadeUp 0.5s ease-out both',
        shimmer: 'shimmer 1.4s linear infinite',
      },
    },
  },
  plugins: [],
}
