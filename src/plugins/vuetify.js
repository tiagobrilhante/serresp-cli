import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

// Translation provided by Vuetify (typescript)
import pt from 'vuetify/src/locale/pt.ts'

const vuetify = new Vuetify({
  lang: {
    locales: { pt },
    current: 'pt'
  }
})

Vue.use(Vuetify)

export default vuetify
