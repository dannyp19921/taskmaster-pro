// postcss.config.cjs  

export default {
  plugins: {
    tailwindcss: {}, 
    autoprefixer: {}, 
  }
}


/* module.exports = {
  plugins: {
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
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
