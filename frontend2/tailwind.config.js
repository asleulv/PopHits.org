/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        cherry: ['Sansita', 'sans-serif'],
        sansita: ['Sansita', 'sans-serif'],
      },
      colors: {
        pink: {
          500: '#e2759e',
          600: '#d74d82',
          700: '#c23a6f',
        },
        blue: {
          500: '#3ba9f3',
          600: '#254fb7',
        },
        purple: {
          600: '#9333ea',
          900: '#581c87',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}
