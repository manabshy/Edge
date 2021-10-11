module.exports = {
  important: true,
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  // purge: {
  //   enabled: true,
  //   content: ['./src/**/*.html'],
  // },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        'xs': '.65rem'
      },
      margin: {
        '0.3': '0.15rem',
       },
      fontFamily: {
        // https://tailwindcss.com/docs/font-family#customizing
        sans: [
          'Poppins'
        ],
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}