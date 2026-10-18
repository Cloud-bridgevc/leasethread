/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#07142b', 900: '#0b1f3f', 800: '#12294f', 700: '#1c3866', 600: '#2a4a82' },
        teal: { 50:'#effaf9',100:'#d3f2ef',200:'#a8e5df',300:'#6fd0c8',400:'#3bb5ab',500:'#1f9a91',600:'#177b75',700:'#16625e' },
      },
      fontFamily: { sans: ['Inter','ui-sans-serif','system-ui','sans-serif'], display: ['"Plus Jakarta Sans"','Inter','sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(11,31,63,.05), 0 4px 16px rgba(11,31,63,.05)' },
    },
  },
  plugins: [],
}
