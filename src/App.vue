<template>
  <v-app class="bgwhite" id="inspire">
    <BarraNavegacao/>
    <v-row class="mb-5 mt-15">
      <v-col cols="2">
        <MenuLeft/>
      </v-col>
      <v-col>

        <v-container fluid>
          <v-row>
            <v-col>
              <router-view/>
            </v-col>
          </v-row>
        </v-container>

        <v-container fluid v-if="!usuarioEstaLogado">
          <v-row class="mr-1 ml-1">
            <v-col>
              <v-card elevation="12">
                <v-card-title>Teste de card adicional</v-card-title>
                <v-card-text>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer in elit nec metus facilisis
                    vehicula
                    at non mi. Curabitur iaculis sem ac turpis faucibus bibendum. Ut volutpat, leo et vulputate
                    facilisis,
                    ipsum justo tempus sem, vitae interdum lorem tortor eget nisl. Duis egestas mauris eleifend,
                    malesuada
                    ligula eu, congue odio. Nullam tincidunt sapien id dui venenatis, eu fringilla metus dignissim. In
                    non
                    enim ligula. Pellentesque convallis enim quam, vitae consectetur nisi tristique sed. Morbi
                    pellentesque a nibh vel fringilla. Sed ac augue congue, congue lectus et, feugiat urna. Nam a eros
                    at
                    lectus pellentesque tempor et ut mauris. Aliquam sit amet eros faucibus nisl tincidunt luctus. Nulla
                    id mi volutpat, facilisis odio et, imperdiet nulla. In dapibus posuere tempor. Praesent tincidunt at
                    augue vitae fringilla.

                    Curabitur diam enim, imperdiet id posuere aliquet, accumsan sed ex. Suspendisse justo urna, volutpat
                    ac dignissim et, consequat at eros. Phasellus ut nisi velit. Donec eu posuere lectus. Aliquam vitae
                    venenatis justo. Aliquam vehicula diam a nisi dignissim elementum. Duis erat lectus, tincidunt at
                    lectus a, fringilla mollis risus. Donec vehicula turpis eleifend, varius risus vel, dictum velit.
                    Suspendisse nisi ipsum, pellentesque sit amet pellentesque eget, venenatis non lacus. Praesent
                    viverra
                    sodales elit sit amet suscipit. Pellentesque sed erat mattis, lacinia nulla convallis, efficitur
                    orci.
                    Cras tempor, risus vel sollicitudin congue, velit mi convallis lacus, at fermentum quam nisi sed
                    magna. Pellentesque at mi gravida, accumsan sapien sed, mollis felis. Cras at maximus odio, ac
                    ultricies justo.
                  </p>
                </v-card-text>
              </v-card>
            </v-col>

          </v-row>
        </v-container>

      </v-col>
    </v-row>
    <Footer/>
  </v-app>
</template>

<script>import Footer from './components/footer/Footer'
import BarraNavegacao from './components/barra-navegacao/BarraNavegacao.vue'
import MenuLeft from './components/menu-left/Menu.vue'
import {mapGetters} from 'vuex'
import {logoutMixin} from '@/mixins'

export default {
  components: {
    BarraNavegacao,
    MenuLeft,
    Footer
  },
  mixins: [logoutMixin],
  data () {
    return {
      totemConfigs: {}
    }
  },
  created () {
    this.getConfigs() // Chama getConfigs quando o componente é criado
  },
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado', 'usuarioEstaLogado'])
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
// width: 100%; // height: 100%; // background-image: url('assets/img/cammo.jpg') !important; // background-repeat: no-repeat !important; // background-size: cover !important; background-color: #e5e1ff !important;
}

.bgwhite {
  background-color: #FFFFFF !important;
}

</style>
