<template>
  <v-card color="#a8b7f0">

    <!--title card-->
    <v-card-title class="justify-center" primary-title>
      <v-row>
        <v-col cols="1"></v-col>
        <v-col cols="10" class="text-center"><h1> {{ eventoVisivel.nome }} </h1></v-col>
        <v-col cols="1" class="text-right">
          <v-btn @click="closeThis" color="grey lighten-1">X</v-btn>
        </v-col>
      </v-row>
    </v-card-title>

    <v-card-text>
      <hr>

      <v-row class="mt-2" justify="center">

        <!-- espaço para a imagem-->
        <v-col align-self="center" class="text-center"
               v-if="eventoVisivel.imagem !== 'null' && eventoVisivel.imagem !== null ">

          <!-- botões de navegação entre imagens de um evento-->
          <v-row class="mb-4">
            <v-col class="text-left">
              <v-btn class="mx-2" v-if="!soTemUmaImagem"
                     @click="mostraImagemAdicional(eventoVisivell,'default')">1
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
      <v-btn @click="closeThis" color="grey lighten-1">Voltar</v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>import config from '../../http/config'

export default {

  data () {
    return {
      configSis: config,
      clicable: true,
      tamanhoTexto: '',
      legendaBtnAumentaDiminui: 'A++',
      saibamaisevent: '',
      saibaMaisAreaVisibility: false,
      saibaMaisTextButton: 'SAIBA MAIS...',
      soTemUmaImagem: true,
      essaEImgEventoPcp: true,
      objPcpEventoParaImagemAdicional: {},
      explicacaoImgAddEvevntox: '',
      eventoVisivel: this.eventoVisivell
    }
  },

  props: {
    eventoVisivell: Object,
    configBasica: Object
  },

  computed: {},

  mounted () {
    this.calculaCoisa()
  },
  methods: {
    calculaCoisa () {
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
        eventoVisivelCopia.imagem = this.eventoVisivell.imagem
        eventoVisivelCopia.fonteimagempcp = this.eventoVisivell.fonteimagempcp
      } else {
        this.essaEImgEventoPcp = false
        eventoVisivelCopia.imagem = objeto.imagem
        eventoVisivelCopia.fonteimagempcp = objeto.fonte
        this.explicacaoImgAddEvevntox = objeto.descricao
      }

      // Altera o estado do componente com a cópia do objeto
      this.eventoVisivel = eventoVisivelCopia
    },

    closeThis () {
      this.$emit('ajustarVisibilidade', false)
    }
  }
}
</script>
