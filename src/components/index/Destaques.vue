<template>

  <!--container para informações default assunto-->
  <v-container fill-height fluid>

    <v-row>
      <v-col class="text-center"><h1>Em Destaque</h1></v-col>
    </v-row>

    <!--caso não haja itens-->
    <v-row v-if="destaques.length === 0">
      <v-col>
        <v-alert class="text-center mt-16" type="warning">
          Não existem eventos em destaque no SerResponsável.
        </v-alert>
      </v-col>
    </v-row>

    <!--caso tenha itens-->
    <v-row v-else class="mt-1">
      <v-col>
        <!--caso não haja itens-->
        <v-row v-if="destaques.length === 0">
          <v-col>
            <v-alert class="text-center mt-16" type="warning">
              Não existem eventos cadastrados no SerResponsável.
            </v-alert>
          </v-col>
        </v-row>

        <!--caso tenha itens-->
        <v-row v-else class="mt-1">
          <v-col>

            <v-card outlined class="pt-5 pb-10" elevation="12">
              <v-row>
                <!--espaçador + btn voltar-->
                <v-col align-self="center" class="text-center" cols="1">
                  <v-btn rounded color="secondary" @click="changeDestaquePage(pagAtualDestaques - 1)"
                         :disabled="!(pagAtualDestaques > 1)">
                    <v-icon>mdi-arrow-left</v-icon>
                  </v-btn>
                </v-col>

                <v-col align-self="center">
                  <!--linha 1 de destaques-->
                  <v-row class="mb-5">

                    <v-col :key="le1.id" align-self="center" cols="4" v-for="le1 in linha1destaques">

                      <v-card :hover="clicable"
                              @click="openAnoEventoLista(le1)"
                              color="#FFFFFF"
                              class="ml-3 mr-3 pl-2 pr-2 align-content-center"
                              elevation="21"
                              rounded="xl"
                      >
                        <br>

                        <v-img
                          :height=configBasica.altura_index
                          :max-height=configBasica.altura_index
                          :max-width=configBasica.largura_index
                          :src="configSis.urlDownload + le1.imagem"
                          class="v-responsive rounded-xl text-center ml-auto mr-auto pl-3 pr-3"/>

                        <v-row>

                          <v-col class="text-center">

                            <h2>{{ le1.nome }}</h2>
                          </v-col>
                        </v-row>
                      </v-card>

                    </v-col>

                  </v-row>

                  <!--linha 2 de destaques-->
                  <v-row>
                    <v-col :key="le2.id" align-self="center" cols="4" v-for="le2 in linha2destaques"
                           v-if="le2 !== undefined">

                      <v-card :hover="clicable"
                              @click="openAnoEventoLista(le2)"
                              class="ml-3 mr-3 pl-2 pr-2 align-content-center"
                              color="#FFFFFF"
                              elevation="21"
                              rounded="xl">

                        <br>

                        <v-img
                          :height=configBasica.altura_index
                          :max-height=configBasica.altura_index
                          :max-width=configBasica.largura_index
                          :src="configSis.urlDownload + le2.imagem"
                          class="rounded-xl text-center ml-auto mr-auto"/>

                        <v-row>

                          <v-col class="text-center">
                            <h2>{{ le2.nome }}</h2>
                          </v-col>
                        </v-row>
                      </v-card>

                    </v-col>
                  </v-row>

                </v-col>

                <!--espaçador + btn avançar-->
                <v-col align-self="center" class="text-center" cols="1">
                  <v-btn rounded color="secondary" @click="changeDestaquePage(pagAtualDestaques + 1)"
                         :disabled="!temProxPag">
                    <v-icon>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
        </v-row>

      </v-col>
    </v-row>
  </v-container>

</template>

<script>import config from '../../http/config'

export default {

  components: {},
  data () {
    return {
      configSis: config,
      clicable: true,
      destaques: [],
      configBasica: {},
      linha1destaques: [],
      linha2destaques: [],
      pagAtualDestaques: 1,
      temProxPag: false,
      qtdDestaque: 0,
      countUndefinedDestaques1: 0,
      countUndefinedDestaques2: 0
    }
  },

  computed: {},

  async mounted () {
    await this.getConfigs()
    await this.getDestaques()
  },
  methods: {
    async getConfigs () {
      try {
        this.$http.get('totemconfig')
          .then(response => {
            this.configBasica = Object.assign({}, response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    async getDestaques (pagAtual) {
      this.linha1destaques = []
      this.linha2destaques = []
      try {
        this.$http.get('evento/destaque/porpag?page=' + this.pagAtualDestaques)
          .then(response => {
            this.destaques = response.data.data
            this.pagAtualDestaques = response.data.current_page

            if (response.data.last_page > response.data.current_page) {
              this.temProxPag = true
            } else {
              this.temProxPag = false
            }
            this.qtdDestaque = this.destaques.length
            if (this.destaques.length !== 0 && this.destaques.length <= 3 > 0) {
              for (let i = 0; i < 3; i++) {
                if (this.destaques[i] !== undefined) {
                  this.linha1destaques.push(this.destaques[i])
                }
              }
              this.linha2destaques = []
            } else {
              for (let i = 0; i < 3; i++) {
                this.linha1destaques.push(this.destaques[i])
              }
              for (let i = 3; i < 7; i++) {
                if (this.destaques[i] !== undefined) {
                  this.linha2destaques.push(this.destaques[i])
                }
              }
            }
            let ajuste1 = 0
            let ajuste2 = 0
            for (let i = 0; i < this.linha1destaques.length; i++) {
              if (this.linha1destaques[i] === undefined) {
                ajuste1++
              }
            }
            for (let i = 0; i < this.linha2destaques.length; i++) {
              if (this.linha2destaques[i] === undefined) {
                ajuste2++
              }
            }
            this.countUndefinedDestaques1 = ajuste1
            this.countUndefinedDestaques2 = ajuste2
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    changeDestaquePage (pagina) {
      this.pagAtualDestaques = pagina
      this.getDestaques()
    }

  }
}
</script>
<style>

.font-preta {
  color: black !important;
}

</style>
