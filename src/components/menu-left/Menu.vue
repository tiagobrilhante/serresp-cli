<template>
  <v-row class="ml-3 mt-1">
    <v-col class="text-center">
      <v-img class="v-responsive rounded-xxl"
             :src="require('@/assets/img/logoUninorte.jpg')"
      />
      <h2>Menu</h2>
      <v-divider v-if="!usuarioEstaLogado" class="mb-4"></v-divider>
      <v-btn v-if="!usuarioEstaLogado" to="/" color="secondary" block max-width="100%"> Página Incial</v-btn>
      <v-btn v-if="!usuarioEstaLogado" class="mt-3" color="secondary" block max-width="100%"> O que é SerResponsável</v-btn>
      <v-btn v-if="!usuarioEstaLogado" to="/destaques" class="mt-3" color="secondary" block max-width="100%"> Em destaque</v-btn>
      <v-btn v-if="!usuarioEstaLogado" to="/eventos" class="mt-3" color="secondary" block max-width="100%"> Ao longo dos anos</v-btn>
      <v-btn v-if="!usuarioEstaLogado" class="mt-3" color="secondary" block max-width="100%"> Benefícios do Projeto</v-btn>

      <br>
      <hr v-if="usuarioEstaLogado">
      <v-btn v-if="usuarioEstaLogado" to="/home" class="mt-3" color="secondary" block max-width="100%"> Página Inicial
      </v-btn>
      <v-btn v-if="usuarioEstaLogado" to="/configs" class="mt-3" color="secondary" block max-width="100%"> Configurações
      </v-btn>
      <v-btn v-if="usuarioEstaLogado" to="/admusers" class="mt-3" color="secondary" block max-width="100%"> Adm Usuários
      </v-btn>
      <v-btn v-if="usuarioEstaLogado" to="/tipoeventos" class="mt-3" color="secondary" block max-width="100%"> Adm Tipo
        Evento
      </v-btn>

    </v-col>
  </v-row>
</template>

<script>import config from '../../http/config'
import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  mixins: [logoutMixin],
  data: () => ({
    configSis: config
  }),
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado', 'usuarioEstaLogado'])
  },
  mounted () {
  },
  methods: {}
}
</script>

<style>
.thewhite {
  color: white;
}
</style>
