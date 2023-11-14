<template>
  <div>
    <v-app-bar
      app
      color="rgb(37, 150, 190, 0.5)"
    >

      <v-toolbar-title>{{ configSis.nomeSis }}
        <v-chip small class="ml-4"> {{ configSis.labelSis }}</v-chip>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <BarraNavegacaoUsuarioLogado v-if="usuarioEstaLogado"/>

      <v-menu
        left
        bottom
      >
        <template v-slot:activator="{ on, attrs }">
          <v-btn
            to="/login"
          >
            <v-icon class="mr-5">
            mdi-account-check
          </v-icon>
           Login
          </v-btn>
        </template>
      </v-menu>

    </v-app-bar>

  </div>
</template>

<script>import BarraNavegacaoUsuarioLogado from './BarraNavegacaoUsuarioLogado'
import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {
  data: () => ({
    configSis: config
  }),
  components: {
    BarraNavegacaoUsuarioLogado
  },
  computed: {
    ...mapGetters(['usuarioEstaLogado', 'usuarioLogado'])

  }
}
</script>

<style>

</style>
