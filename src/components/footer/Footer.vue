<template>

  <v-footer
    app
    class="ma-0 pa-0"
    color="#424240"
  >

    <v-row no-gutters>
      <v-col class="text-center">
        <span
          class="caption">{{configSis.nomeSis}} <v-btn @click="dialogVersoes = true" class="pa-0 ma-0" link plain
                                                       x-small>({{configSis.versaoSis}})</v-btn> - Todos os direitos reservados / {{ new Date().getFullYear() }} — <strong>Criado por: <v-btn
          @click="dialogProgramador = true" class="pa-0 ma-0" link plain x-small>{{configSis.criador}}</v-btn></strong></span>
      </v-col>
    </v-row>

    <!--Dialog para ver detalhes de versão-->
    <v-dialog max-width="70%" v-model="dialogVersoes">

      <v-card>

        <v-card-title class="justify-center" primary-title>

          Detalhe de Versões

        </v-card-title>

        <v-card-text>

          <ul>
            <li class="mt-4">Versão 1.0 A r020 - 23/11/2023
              <ul>
                <li>É disponibilizado ao público em 23 de novembro de 2023.</li>
              </ul>
            </li>

            <li class="mt-4">Versão 1.0 A r001 (alpha) - 24/09/2023
              <ul>
                <li>É iniciado o processo de desenvolvimento do {{ configSis.labelSis }} em 24 de setembro de 2023.</li>
                <li>Utiliza Vue no front e Lumen no back.</li>
              </ul>
            </li>
          </ul>

        </v-card-text>

        <v-card-actions class="pb-5">

          <v-spacer></v-spacer>

          <v-btn
            @click="dialogVersoes = false"
            color="grey lighten-1">
            Fechar
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

    <!--Dialog para ver detalhes do programador-->
    <v-dialog max-width="800px" v-model="dialogProgramador">

      <v-card>

        <v-card-title class="justify-center" primary-title>

          Sobre o Programador

        </v-card-title>

        <v-card-text>
          <b></b>
          <br>
          <p>Alpha Squad</p>
          <p>O Alpha Squad é a equipe de desenvolvimento formada por alunos do 4º período de Ciências da Computação para a Atividade de Extensão 2, da Uninorte.</p>
          <p>Ela é composta pelos seguintes membros:</p>
          <ul>
            <li>Tiago da Silva Brilhante (Desenvolvedor Chefe)</li>
            <li>Arthur Iques de Oliveira Fernandes (Desenvolvedor)</li>
            <li>Paulo Ricardo Damião Lima (Desenvolvedor)</li>
            <li>Breno Victor Almeida de Oliveira Santos (Desenvolvedor)</li>
            <li>Igor Rafael Reis Osório (Designer)</li>
          </ul>
          <br>
        </v-card-text>

        <v-card-actions class="pb-5">

          <v-spacer></v-spacer>

          <v-btn
            @click="dialogProgramador = false"
            color="grey lighten-1">
            Fechar
          </v-btn>

        </v-card-actions>

      </v-card>

    </v-dialog>

  </v-footer>

</template>

<script>import config from '../../http/config'

export default {
  data: () => ({
    configSis: config,
    dialogVersoes: false,
    dialogProgramador: false
  }),
  computed: {},
  methods: {}
}
</script>

<style>
  .thewhite {
    color: white;
  }

</style>
