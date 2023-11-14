<template>

  <v-main>

    <Eventos v-if="totemConfigs.tipo_totem === 'data'" :configBasica="totemConfigs"></Eventos>

    <!--container para informações default assunto-->
    <v-container fill-height fluid v-if="totemConfigs.tipo_totem !== 'data'">

      <!--caso nao haja itens-->
      <v-row v-if="qtdAssuntos === 0">
        <v-col>
          <v-alert class="text-center mt-16" type="warning">
            Ainda não existe conteúdo cadastrado no SerResponsável.
          </v-alert>
        </v-col>
      </v-row>

      <!--area de navegação-->
      <v-row v-else>

        <!--espaçador com botão voltar-->
        <v-col align-self="center" class="text-center" cols="1">
          <v-btn elevation="21" color="#eb9234" @click="ajustaPagVoltar" v-if="assuntos.current_page > 1">Voltar
          </v-btn>
        </v-col>

        <!--linhas 1 e 2 de assuntos-->
        <v-col class="">

          <!--linha 1-->
          <v-row>

            <v-col :key="la1.id" align-self="center" cols="4" v-for="la1 in linha1assuntos" v-if="la1 !== undefined">
              <v-card
                :hover=clicable
                color="#7ca387"
                @click="abreAssunto(la1.id)"
                class="ml-3 mr-3"
                elevation="21"
                rounded="xl"
              >

                <v-card-text class="text-center pa-2">
                  <v-img :height=totemConfigs.altura_index :src="configSis.urlDownload + la1.banner.imagem"
                         :width=totemConfigs.largura_index
                         class="rounded-xl ml-auto mr-auto"/>

                  <v-alert class="" color="rgb(0,0,0,0)"><h2>{{ la1.nome_assunto }}</h2></v-alert>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col :key="n" align-self="center" cols="4" v-for="n in countUndefined1">
            </v-col>

          </v-row>

          <!--linha 2-->
          <v-row>
            <v-col :key="la2.id" align-self="center" cols="4" v-for="la2 in linha2assuntos" v-if="la2 !== undefined">
              <v-card
                :hover=clicable
                @click="abreAssunto(la2.id)"
                class="ml-3 mr-3"
                elevation="21"
                rounded="xl"
                color="#7ca387"
              >
                <v-card-text class="text-center pa-2">

                  <v-img :height=totemConfigs.altura_index :src="configSis.urlDownload + la2.banner.imagem"
                         :width=totemConfigs.largura_index
                         class="rounded-xl ml-auto mr-auto"/>

                  <v-alert class="" color="rgb(0,0,0,0)"><h2>{{ la2.nome_assunto }}</h2></v-alert>
                </v-card-text>
              </v-card>
            </v-col>

            <v-col :key="n" align-self="center" cols="4" v-for="n in 3-countUndefined2"
                   v-if="linha2assuntos.length === 0">
              <v-alert :height=totemConfigs.altura_index :width=totemConfigs.largura_index
                       color="rgb(0,0,0,0)"></v-alert>
            </v-col>

          </v-row>

        </v-col>

        <!--espaçador com botão avançar-->
        <v-col align-self="center" class="text-center" cols="1">
          <v-btn elevation="21" color="#eb9234" @click="ajustaPagAvanca"
                 v-if="assuntos.current_page !== assuntos.last_page">Avançar
          </v-btn>
        </v-col>

        <!--pagination-->
        <v-container fluid v-if="assuntos.last_page > 1">

          <v-pagination
            :length="assuntos.last_page"
            @input="onPageChange"
            class="pl-5 pr-5 ml-5 mr-5"
            color="success"
            v-model="assuntos.current_page"
          ></v-pagination>

        </v-container>

      </v-row>

    </v-container>

    <!--Dialog para navegar pelo assunto-->
    <v-dialog max-width="90%" v-model="dialogNavegaAssunto" scrollable>
      <v-card color="#7ca387" @contextmenu.prevent="disableRightClick" v-if="!objetoVazio(selectedAssunto)">

        <!--titulo e botão fechar-->
        <v-card-title class="justify-center text-center" primary-title>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10"><h1> {{ selectedAssunto.nome_assunto }} </h1></v-col>
            <v-col cols="1">
              <v-btn @click="dialogNavegaAssunto = false" color="grey lighten-1">X</v-btn>
            </v-col>
          </v-row>

        </v-card-title>
        <v-card-text>
          <hr>

          <!--navegar pelas imagens internas-->
          <v-container fluid>
            <v-row>
              <v-col>
                <v-btn :key="imgs.id" @click="changeSelectedImg(imgs.ordem)" class="mr-5" retain-focus-on-click
                       v-for="imgs in selectedAssunto.imagens">{{ imgs.ordem }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

          <!-- Área de exibição de imagem e conteúdo-->
          <v-row class="mt-2" justify="center">
            <v-col align-self="center" class="text-center">

              <v-img :height=totemConfigs.altura_detail :src="configSis.urlDownload + selectedImg.imagem"
                     :width=totemConfigs.largura_detail
                     class="rounded-xl ml-auto mr-auto"/>
            </v-col>
            <v-col v-if="selectedImg.nome !=='' || selectedImg.legenda !== '' ">

              <!-- Título da imagem e aumenta e diminui fonte-->
              <v-row>
                <v-col cols="10">
                  <h2 class="font-preta">{{ selectedImg.nome }}</h2>
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-btn @click="aumentaDimunuiFonte" color="#aeeb8a" small>{{ legendaBtnAumentaDiminui }}</v-btn>
                </v-col>
              </v-row>

              <br>

              <!-- Area do conteúdo-->
              <v-alert class="text-justify" color="grey lighten-2" v-if="selectedImg.legenda !== ''">

                <!-- texto da legenda -->
                <v-row class="mb-1" v-if="!saibaMaisAreaVisibility">
                  <v-col :class=tamanhoTexto>

                    <strong>
                      {{ selectedImg.legenda }}
                    </strong>

                  </v-col>
                </v-row>

                <!-- texto do saiba mais -->
                <v-row v-if="saibaMaisAreaVisibility">
                  <v-col class="text-justify">
                          <span :class="tamanhoTexto">
                            {{ selectedImg.saibamais }}
                          </span>
                  </v-col>
                </v-row>

                <!-- botao saiba mais-->
                <hr v-if="selectedImg.saibamais">
                <v-row class="mt-1" v-if="selectedImg.saibamais">
                  <v-col class="text-right">
                    <v-btn @click="abreSaibaMais">{{ saibaMaisTextButton }}</v-btn>
                  </v-col>
                </v-row>

              </v-alert>
            </v-col>
          </v-row>

          <br><br>

          <!--navegar pelas imagens internas-->
          <v-container fluid>
            <v-row>
              <v-col>
                <v-btn :key="imgs.id" @click="changeSelectedImg(imgs.ordem)" class="mr-5" retain-focus-on-click
                       v-for="imgs in selectedAssunto.imagens">{{ imgs.ordem }}
                </v-btn>
              </v-col>
            </v-row>
          </v-container>

        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogNavegaAssunto = false" color="grey lighten-1">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>

</template>

<script>import config from '../http/config'
import Eventos from '.././components/index/Eventos'

export default {

  components: {
    Eventos
  },
  data () {
    return {
      configSis: config,
      clicable: true,
      usuario: {},
      totemConfigs: {},
      assuntos: [],
      qtdAssuntos: 0,
      linha1assuntos: [],
      linha2assuntos: [],
      countUndefined1: 0,
      countUndefined2: 0,
      dialogNavegaAssunto: false,
      selectedAssunto: {},
      selectedImg: {}
    }
  },

  computed: {},

  async mounted () {
    await this.getConfigs()
  },
  methods: {
    async getConfigs () {
      try {
        this.$http.get('totemconfig')
          .then(response => {
            this.totemConfigs = Object.assign({}, response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    async getAssuntos () {
      this.linha1assuntos = []
      this.linha2assuntos = []
      try {
        this.$http.get('assunto/principal?page=' + this.assuntos.current_page)
          .then(response => {
            this.assuntos = response.data
            this.qtdAssuntos = this.assuntos.data.length
            if (this.assuntos.data.length !== 0 && this.assuntos.data.length <= 3 > 0) {
              for (let i = 0; i < 3; i++) {
                if (this.assuntos.data[i].imagens.length !== 0) {
                  this.linha1assuntos.push(this.assuntos.data[i])
                }
              }
              this.linha2assuntos = []
            } else {
              for (let i = 0; i < 3; i++) {
                this.linha1assuntos.push(this.assuntos.data[i])
              }
              for (let i = 3; i < 6; i++) {
                if (this.assuntos.data[i].imagens.length !== 0) {
                  this.linha2assuntos.push(this.assuntos.data[i])
                }
              }
            }
            let ajuste1 = 0
            let ajuste2 = 0
            for (let i = 0; i < this.linha1assuntos.length; i++) {
              if (this.linha1assuntos[i] === undefined) {
                ajuste1++
              }
            }
            for (let i = 0; i < this.linha2assuntos.length; i++) {
              if (this.linha2assuntos[i] === undefined) {
                ajuste2++
              }
            }
            this.countUndefined1 = ajuste1
            this.countUndefined2 = ajuste2
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    onPageChange () {
      this.getAssuntos()
    },

    abreAssunto (assuntoId) {
      this.dialogNavegaAssunto = true
      this.tamanhoTexto = ''
      this.legendaBtnAumentaDiminui = 'A++'
      this.saibamaisevent = ''
      this.saibaMaisAreaVisibility = false
      this.saibaMaisTextButton = 'SAIBA MAIS...'
      for (let i = 0; i < this.assuntos.data.length; i++) {
        if (this.assuntos.data[i].id === assuntoId) {
          this.selectedAssunto = this.assuntos.data[i]
          this.selectedImg = this.assuntos.data[i].imagens[0]
        }
      }
    },

    objetoVazio (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false
      }
      return true
    },

    changeSelectedImg (ordem) {
      this.saibamaisevent = ''
      this.saibaMaisAreaVisibility = false
      this.saibaMaisTextButton = 'SAIBA MAIS...'
      for (let i = 0; i < this.selectedAssunto.imagens.length; i++) {
        if (this.selectedAssunto.imagens[i].ordem === ordem) {
          this.selectedImg = this.selectedAssunto.imagens[i]
        }
      }
    },

    ajustaPagVoltar () {
      if (this.totemConfigs.tipo_totem !== 'data') {
        if (this.assuntos.current_page >= this.assuntos.last_page) {
          this.assuntos.current_page--
          this.onPageChange()
        }
      }
    },

    ajustaPagAvanca () {
      if (this.assuntos.current_page < this.assuntos.last_page) {
        this.assuntos.current_page++
        this.onPageChange()
      }
    },

    refreshPage () {
      location.reload()
    },

    aumentaDimunuiFonte () {
      if (this.legendaBtnAumentaDiminui === 'A++') {
        this.tamanhoTexto = 'text-h5'
        this.legendaBtnAumentaDiminui = 'A--'
      } else {
        this.tamanhoTexto = ''
        this.legendaBtnAumentaDiminui = 'A++'
      }
    },

    abreSaibaMais () {
      if (this.saibaMaisAreaVisibility === false) {
        this.saibamaisevent = this.eventoVisivel.saibamais
        this.saibaMaisAreaVisibility = true
        this.saibaMaisTextButton = 'Ocultar informações adicionais.'
      } else {
        this.saibamaisevent = ''
        this.saibaMaisAreaVisibility = false
        this.saibaMaisTextButton = 'SAIBA MAIS...'
      }
    }
  }
}
</script>
<style>

.font-preta {
  color: black !important;
}

</style>
