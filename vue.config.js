const { mergeSassVariables } = require('@vuetify/cli-plugin-utils')

module.exports = {
  // publicPath: process.env.NODE_ENV === 'production'
  //   ? '/dist/'
  //   : '/',
  publicPath: "",
  lintOnSave: false,
  transpileDependencies: ['vuetify'],
  chainWebpack: config => {
    const modules = ['vue-modules', 'vue', 'normal-modules', 'normal']
    modules.forEach(match => {
      config.module
        .rule('sass')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss'"))
      config.module
        .rule('scss')
        .oneOf(match)
        .use('sass-loader')
        .tap(opt => mergeSassVariables(opt, "'@/styles/variables.scss';"))
    })
  },
  pwa: {
    name: 'ISTAK Assumpta Dog & Cat Clinic',
    themeColor: '#19ab6d',
    msTileColor: '#19ab6d',
    appleMobileWebAppCapable: 'yes',
    appleMobileWebAppStatusBarStyle: 'black',
    manifestOptions: {
      "icons": [
        {
          "src": "./img/icons/icon-72x72.png",
          "sizes": "72x72",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-96x96.png",
          "sizes": "96x96",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-128x128.png",
          "sizes": "128x128",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-144x144.png",
          "sizes": "144x144",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-152x152.png",
          "sizes": "152x152",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-192x192.png",
          "sizes": "192x192",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-384x384.png",
          "sizes": "384x384",
          "type": "image/png",
          "purpose": "maskable any"
        },
        {
          "src": "./img/icons/icon-512x512.png",
          "sizes": "512x512",
          "type": "image/png",
          "purpose": "maskable any"
        }
      ]
    }
  }
}
