// postcss.config.cjs  

module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
}

/* export default {
  plugins: {
    tailwindcss: {}, 
    autoprefixer: {}, 
  }
} */


/* const tailwindcss = require('@tailwindcss/postcss')

module.exports = {
  plugins: [
    tailwindcss(),
    require('autoprefixer'),
  ],
} */

/* module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
} */

/* module.exports = {
  plugins: [
    require('@tailwindcss/postcss')(),
    require('autoprefixer'),
  ]
} */

/*
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
*/
