<template>

  <!--container para eventos-->
  <v-container class="mt-2 rounded-xl" fill-height fluid>
    <v-row>
      <v-col class="text-center"><h1>SerResponsável ao longo dos anos!</h1></v-col>
    </v-row>

    <!--caso não haja itens-->
    <v-row v-if="eventos.length === 0">
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
              <v-btn rounded color="secondary" @click="changeEventPage(pagAtualEvento - 1)"
                     :disabled="!(pagAtualEvento > 1)">
                <v-icon>mdi-arrow-left</v-icon>
              </v-btn>
            </v-col>

            <v-col align-self="center">

              <!--linha 1 de eventos-->
              <v-row class="mb-5">

                <v-col :key="le1.id" align-self="center" cols="3" v-for="le1 in linha1eventos">

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

                        <h2>{{ le1.ano }}</h2>
                      </v-col>
                    </v-row>
                  </v-card>

                </v-col>

              </v-row>

              <!--linha 2 de eventos-->
              <v-row>
                <v-col :key="le2.id" align-self="center" cols="3" v-for="le2 in linha2eventos" v-if="le2 !== undefined">

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
                        <h2>{{ le2.ano }}</h2>
                      </v-col>
                    </v-row>
                  </v-card>

                </v-col>
              </v-row>

            </v-col>

            <!--espaçador + btn avançar-->
            <v-col align-self="center" class="text-center" cols="1">
              <v-btn rounded color="secondary" @click="changeEventPage(pagAtualEvento + 1)" :disabled="!temProxPag">
                <v-icon>mdi-arrow-right</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!--Dialog para navegar pelo evento-->
    <v-dialog max-width="90%" v-model="dialogNavegaAno" scrollable>

      <v-card color="#a8b7f0">

        <!--title card-->
        <v-card-title class="justify-center" primary-title>
          <v-row>
            <v-col cols="1"></v-col>
            <v-col cols="10" class="text-center"><h1> {{ selectedAnoEvento.ano }} </h1></v-col>
            <v-col cols="1" class="text-right">
              <v-btn @click="dialogNavegaAno = false" color="grey lighten-1">X</v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>
          <hr>

          <!-- botoes de navegação entre eventos-->
          <v-row class="mt-1"
                 v-if="Object.keys(selectedAnoEvento).length !== 0 && selectedAnoEvento.eventos.length > 1">
            <v-col>
              <v-btn :key="evento.id" @click="mostraEventoSelecionado(index)" class="mr-5 mb-3" color="primary"
                     v-for="(evento, index) in selectedAnoEvento.eventos"> {{
                  evento.nome
                }}
              </v-btn>
            </v-col>
          </v-row>

          <v-row class="mt-2" justify="center">

            <!-- espaço para a imagem-->
            <v-col align-self="center" class="text-center"
                   v-if="eventoVisivel.imagem !== 'null' && eventoVisivel.imagem !== null ">

              <!-- botões de navegação entre imagens de um evento-->
              <v-row class="mb-4">
                <v-col class="text-left">
                  <v-btn class="mx-2" v-if="!soTemUmaImagem"
                         @click="mostraImagemAdicional(eventoVisivel,'default')">1
                  </v-btn>
                  <v-btn class="mx-2" :key="imgaddadd.id"
                         v-for="(imgaddadd, index) in eventoVisivel.imagens_adicionais"
                         @click="mostraImagemAdicional(imgaddadd, 'adicional')">
                    {{ index + 2 }}
                  </v-btn>
                </v-col>
              </v-row>

              <v-img :height=configBasica.altura_detail :src="configSis.urlDownload + eventoVisivel.imagem"
                     :width=configBasica.largura_detail
                     class="rounded-xl ml-auto mr-auto"/>
              <v-alert v-if="eventoVisivel.fonteimagempcp !== '' && eventoVisivel.fonteimagempcp !== null"
                       color="rgb(0,0,0,0)" class="mt-2">fonte: {{ eventoVisivel.fonteimagempcp }}
              </v-alert>

              <v-alert class="mt-3" v-if="!essaEImgEventoPcp">
                <h3>{{ explicacaoImgAddEvevntox }}</h3>
              </v-alert>

              <!--botoes de navegação entre imagens-->
              <v-row class="mt-2">
                <v-col class="text-left">
                  <v-btn class="mx-2" v-if="!soTemUmaImagem"
                         @click="mostraImagemAdicional(eventoVisivel,'default')">1
                  </v-btn>
                  <v-btn class="mx-2" :key="imgaddadd.id"
                         v-for="(imgaddadd, index) in eventoVisivel.imagens_adicionais"
                         @click="mostraImagemAdicional(imgaddadd, 'adicional')">
                    {{ index + 2 }}
                  </v-btn>
                </v-col>
              </v-row>

            </v-col>

            <!-- espaço para titulo, fonte++ e legenda -->
            <v-col>

              <!--titulo e aumenta e di minui fonte-->
              <v-row>
                <v-col cols="10">
                  <h2 class="font-preta"> {{ eventoVisivel.nome }} <span
                    v-if="eventoVisivel.dia || eventoVisivel.mes">(</span> <span
                    v-if="eventoVisivel.dia"> {{ eventoVisivel.dia }} de </span> <span
                    v-if="eventoVisivel.mes">  {{ converteNumEmMes(eventoVisivel.mes) }} </span>
                    <span v-if="eventoVisivel.dia || eventoVisivel.mes">)</span></h2>
                </v-col>
                <v-col cols="2" class="text-right">
                  <v-btn @click="aumentaDimunuiFonte" color="#aeeb8a" small>{{ legendaBtnAumentaDiminui }}</v-btn>
                </v-col>
              </v-row>

              <br>

              <!--legenda, saiba mais e btn saiba mais-->
              <v-row>
                <v-col>
                  <v-alert class="text-justify" color="grey lighten-2"
                           v-if="eventoVisivel.legenda && eventoVisivel !== null">

                    <!-- texto da legenda -->
                    <v-row class="mb-1" v-if="!saibaMaisAreaVisibility">
                      <v-col :class=tamanhoTexto>

                        <span v-html="eventoVisivel.legenda" class="text-justify"/>

                      </v-col>
                    </v-row>

                    <!-- texto do saiba mais -->
                    <v-row v-if="saibaMaisAreaVisibility">
                      <v-col class="text-justify">

                        <span :class="tamanhoTexto" v-html="eventoVisivel.saibamais" class="text-justify"/>

                      </v-col>
                    </v-row>

                    <!-- botao saiba mais-->
                    <hr v-if="eventoVisivel.saibamais">
                    <v-row class="mt-1" v-if="eventoVisivel.saibamais">
                      <v-col class="text-right">
                        <v-btn @click="abreSaibaMais">{{ saibaMaisTextButton }}</v-btn>
                      </v-col>
                    </v-row>

                  </v-alert>
                </v-col>
              </v-row>

            </v-col>
          </v-row>

        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogNavegaAno = false" color="grey lighten-1">Voltar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>

</template>

<script>
import config from '../../http/config'

export default {
  components: {},
  data () {
    return {
      configSis: config,
      clicable: true,
      eventos: [],
      qtdEventos: 0,
      linha1eventos: [],
      linha2eventos: [],
      countUndefinedEE1: 0,
      countUndefinedEE2: 0,
      pagAtualEvento: 0,
      temProxPag: false,
      dialogNavegaAno: false,
      selectedAnoEvento: {},
      eventoVisivel: {},
      tamanhoTexto: '',
      legendaBtnAumentaDiminui: 'A++',
      saibamaisevent: '',
      saibaMaisAreaVisibility: false,
      saibaMaisTextButton: 'SAIBA MAIS...',
      objPcpEventoParaImagemAdicional: {},
      essaEImgEventoPcp: true,
      explicacaoImgAddEvevntox: '',
      soTemUmaImagem: true,
      configBasica: {}
    }
  },

  computed: {},

  async mounted () {
    await this.getConfigs()
    await this.getEventos()
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

    async getEventos () {
      this.linha1eventos = []
      this.linha2eventos = []
      try {
        this.$http.get('evento/principal')
          .then(response => {
            this.eventos = response.data[0]
            this.pagAtualEvento = response.data[1]
            this.temProxPag = response.data[2]
            this.qtdEventos = this.eventos.length
            if (this.eventos.length !== 0 && this.eventos.length <= 3 > 0) {
              for (let i = 0; i < 4; i++) {
                if (this.eventos[i] !== undefined) {
                  this.linha1eventos.push(this.eventos[i])
                }
              }
              this.linha2eventos = []
            } else {
              for (let i = 0; i < 4; i++) {
                this.linha1eventos.push(this.eventos[i])
              }
              for (let i = 4; i < 8; i++) {
                if (this.eventos[i] !== undefined) {
                  this.linha2eventos.push(this.eventos[i])
                }
              }
            }
            let ajuste1 = 0
            let ajuste2 = 0
            for (let i = 0; i < this.linha1eventos.length; i++) {
              if (this.linha1eventos[i] === undefined) {
                ajuste1++
              }
            }
            for (let i = 0; i < this.linha2eventos.length; i++) {
              if (this.linha2eventos[i] === undefined) {
                ajuste2++
              }
            }
            this.countUndefinedEE1 = ajuste1
            this.countUndefinedEE2 = ajuste2
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    objetoVazio (obj) {
      for (var prop in obj) {
        if (obj.hasOwnProperty(prop)) return false
      }
      return true
    },

    ajustaPagAvanca () {
      if (this.assuntos.current_page < this.assuntos.last_page) {
        this.assuntos.current_page++
        this.onPageChange()
      }
    },

    changeEventPage (pagina) {
      this.eventos = []
      this.linha1eventos = []
      this.linha2eventos = []
      try {
        this.$http.get('evento/principal/porpag/' + pagina)
          .then(response => {
            this.eventos = response.data[0]
            this.pagAtualEvento = response.data[1]
            this.temProxPag = response.data[2]
            this.qtdEventos = this.eventos.length
            if (this.eventos.length !== 0 && this.eventos.length <= 3 > 0) {
              for (let i = 0; i < 4; i++) {
                if (this.eventos[i] !== undefined) {
                  this.linha1eventos.push(this.eventos[i])
                }
              }
              this.linha2eventos = []
            } else {
              for (let i = 0; i < 4; i++) {
                this.linha1eventos.push(this.eventos[i])
              }
              for (let i = 4; i < 8; i++) {
                if (this.eventos[i] !== undefined) {
                  this.linha2eventos.push(this.eventos[i])
                }
              }
            }
            let ajuste1 = 0
            let ajuste2 = 0
            for (let i = 0; i < this.linha1eventos.length; i++) {
              if (this.linha1eventos[i] === undefined) {
                ajuste1++
              }
            }
            for (let i = 0; i < this.linha2eventos.length; i++) {
              if (this.linha2eventos[i] === undefined) {
                ajuste2++
              }
            }
            this.countUndefinedEE1 = ajuste1
            this.countUndefinedEE2 = ajuste2
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    openAnoEventoLista (evento) {
      this.dialogNavegaAno = true
      this.selectedAnoEvento = evento
      this.mostraEventoSelecionado(0)
    },

    mostraEventoSelecionado (index) {
      this.tamanhoTexto = ''
      this.legendaBtnAumentaDiminui = 'A++'
      this.saibamaisevent = ''
      this.saibaMaisAreaVisibility = false
      this.saibaMaisTextButton = 'SAIBA MAIS...'
      this.eventoVisivel = this.selectedAnoEvento.eventos[index]
      this.essaEImgEventoPcp = true
      this.objPcpEventoParaImagemAdicional = {}
      this.objPcpEventoParaImagemAdicional = this.eventoVisivel
      if (this.eventoVisivel.imagens_adicionais.length === 0) {
        this.soTemUmaImagem = true
      } else {
        this.soTemUmaImagem = false
      }
    },

    converteNumEmMes (num) {
      if (num === 1) {
        return 'Janeiro'
      } else if (num === 2) {
        return 'Fevereiro'
      } else if (num === 3) {
        return 'Março'
      } else if (num === 4) {
        return 'Abril'
      } else if (num === 5) {
        return 'Maio'
      } else if (num === 6) {
        return 'Junho'
      } else if (num === 7) {
        return 'Julho'
      } else if (num === 8) {
        return 'Agosto'
      } else if (num === 9) {
        return 'Setembro'
      } else if (num === 10) {
        return 'Outubro'
      } else if (num === 11) {
        return 'Novembro'
      } else {
        return 'Dezembro'
      }
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
    },

    mostraImagemAdicional (objeto, tipo) {
      // Cria uma cópia do objeto eventoVisivel
      const eventoVisivelCopia = Object.assign({}, this.eventoVisivel)

      // Modifica a imagem e a fonte da cópia
      if (tipo === 'default') {
        this.essaEImgEventoPcp = true
        eventoVisivelCopia.imagem = this.objPcpEventoParaImagemAdicional.imagem
        eventoVisivelCopia.fonteimagempcp = this.objPcpEventoParaImagemAdicional.fonteimagempcp
      } else {
        this.essaEImgEventoPcp = false
        eventoVisivelCopia.imagem = objeto.imagem
        eventoVisivelCopia.fonteimagempcp = objeto.fonte
        this.explicacaoImgAddEvevntox = objeto.descricao
      }

      // Altera o estado do componente com a cópia do objeto
      this.eventoVisivel = eventoVisivelCopia
    }
  }
}
</script>

<style>
.font-preta {
  color: black !important;
}
</style>
