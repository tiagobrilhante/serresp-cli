<template>
  <v-app class="bgApp" id="inspire">
    <BarraNavegacao/>
    <router-view/>
    <Footer/>
  </v-app>
</template>

<script>import Footer from './components/footer/Footer'
import BarraNavegacao from './components/barra-navegacao/BarraNavegacao.vue'

export default {
  components: {
    BarraNavegacao,
    Footer
  },
  data () {
    return {
      totemConfigs: {}
    }
  },
  created () {
    this.getConfigs() // Chama getConfigs quando o componente é criado
  },
  computed: {
  },
  methods: {
    getConfigs () {
      try {
        this.$http.get('totemconfig')
          .then(response => {
            this.totemConfigs = Object.assign({}, response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    }
  }
}
</script>

<style>
.bgApp {
  // width: 100%;
  // height: 100%;
  // background-image: url('assets/img/cammo.jpg') !important;
  // background-repeat: no-repeat !important;
  // background-size: cover !important;
  background-color: #e5e1ff !important;
}

</style>
