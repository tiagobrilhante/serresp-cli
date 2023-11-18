<template>

  <v-app-bar
    color="rgb(37, 150, 190, 0.5)"
  >

    <v-app-bar-title>{{ configSis.nomeSis }}
      <v-chip small class="ml-4"> {{ configSis.labelSis }}</v-chip>
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <v-menu
      left
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          @click="openDialogLogin"
        >
          <v-icon class="mr-5">
            mdi-account-check
          </v-icon>
          Login
        </v-btn>
      </template>
    </v-menu>

    <BarraNavegacaoUsuarioLogado v-if="usuarioEstaLogado"/>

    <!--Dialog para fazer login-->
    <v-dialog max-width="50%" v-model="dialogLogin" scrollable>

      <v-card rounded="xl">
      <Login v-if="dialogLogin" @ajustarDialog="dialogLogin = $event"/>
      </v-card>
    </v-dialog>

  </v-app-bar>

</template>

<script>import BarraNavegacaoUsuarioLogado from './BarraNavegacaoUsuarioLogado'
import Login from '../../components/index/Login'
import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {
  data: () => ({
    configSis: config,
    dialogLogin: false
  }),
  components: {
    BarraNavegacaoUsuarioLogado,
    Login
  },
  computed: {
    ...mapGetters(['usuarioEstaLogado', 'usuarioLogado'])

  },
  methods: {
    openDialogLogin () {
      this.dialogLogin = true
    }
  }
}
</script>

<style>
.bgWhite{
  background-color: #FFFFFF;
}
</style>
