module.exports = {
  purge: {
    enabled: true,
    content: ['./src/**/*.html'],
  },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontSize: {
        'xs': '.65rem'
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
    extend: {},
  },
  plugins: [],
}