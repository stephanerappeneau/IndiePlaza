/** @type {import('tailwindcss').Config} */
const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
    './src/app/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'source-sans-pro': ['Source Sans Pro', ...fontFamily.sans],
      },
      fontSize: {
        sm: '14px',
        base: '16px',
        lg: '18px',
        xl: '24px',
      },
      colors: {
        'red-studio': '#941B0C',
        'orange-financing': '#BC3908',
        'dark-red-studio': '#621708',
        'custom-gray': '#F3F2F2',
        gold: '#F6AA1C',
        'table-gray': '#F8F7F7',
        'light-black': '#333333',
        'title-black': '#1a1a1a',
        customFillColor: '#F8F6F6',
      },
      boxShadow: {
        custom: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
      dropShadow: {
        custom: '0px 4px 4px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
  safelist: [
    {
      pattern:
        /(bg|text|border)-(red-studio|orange-financing|custom-gray|dark-red-studio|table-gray)/,
    },
  ],
};
