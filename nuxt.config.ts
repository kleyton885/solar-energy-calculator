// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    'nuxt3-leaflet',
    '@invictus.codes/nuxt-vuetify',
    ['@nuxtjs/google-fonts', {
      families: {
        Roboto: true,
        'Open+Sans': true,
        'Source+Sans+Pro': true,
        Lato: true,
        Montserrat: true,
        Oswald: true,
        'Nunito+Sans': true,
        Inter: [400, 700],
        'Josefin+Sans': true,
        Raleway: {
          wght: [100, 400],
          ital: [100]
        },
      }
    }]
  ]
})
