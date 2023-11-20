<template>

  <!--form para login-->
  <v-form @submit.prevent="efetuarLogin">
    <v-container fluid>
      <br>

      <!--cabeçalho-->
      <v-row>
        <v-col>
          <v-card class="ma-0" rounded>
            <v-row class="text-center">
              <v-col cols="2"></v-col>
              <v-col cols="8"><h1>{{ configSis.nomeSis }}</h1><br>
                <h3>{{ configSis.labelSis }}</h3>
              </v-col>
              <v-col cols="2"></v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-row>
        <v-col>
          <v-card
            elevation="10"
            rounded="lg"
          >

            <!--card titel-->
            <v-card-title>
              <v-icon class="mr-4">
                fa fa-user
              </v-icon>
              Login
            </v-card-title>
            <v-card-text>
              <v-container>

                <!--email-->
                <v-row no-gutters>
                  <v-col>
                    <v-text-field
                      clearable
                      dense
                      id="email"
                      label="Email"
                      name="email"
                      outlined
                      placeholder="Insira o seu email"
                      required
                      v-model="usuario.email"
                    />
                  </v-col>
                </v-row>

                <!--Password-->
                <v-row no-gutters>
                  <v-col>
                    <v-text-field
                      :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                      :type="show1 ? 'text' : 'password'"
                      @click:append="show1 = !show1"
                      clearable
                      counter
                      dense
                      hint="No mínimo 6 caracteres"
                      label="Senha"
                      name="password"
                      outlined
                      required
                      v-model="usuario.password"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!--logar e cadastro-->
                <v-row no-gutters>
                  <!--logar-->
                  <v-col class="text-left">
                    <v-btn
                      color="primary"
                      elevation="2"
                      type="submit"
                    >Entrar
                    </v-btn>

                    <v-btn
                      color="secondary"
                      elevation="2"
                      @click="cancelaLogin"
                    >Cancelar
                    </v-btn>

                  </v-col>
                </v-row>

              </v-container>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-form>

</template>

<script>import config from '../../http/config'
import {mapGetters} from 'vuex'

export default {

  components: {},
  data () {
    return {
      configSis: config,
      usuario: {},
      show1: false,
      show2: false,
      dialogAcesso: false,
      dialogNewUser: false
    }
  },
  computed: {

    ...mapGetters(['usuarioEstaLogado', 'usuarioLogado'])

  },
  methods: {
    efetuarLogin () {
      this.$store.dispatch('efetuarLogin', this.usuario)
        .then(response => {
          if (response.user.reset) {
            this.$router.push({name: 'reset'})
          } else {
            this.$router.push({name: 'home'})
          }
          this.$emit('ajustarDialog', false)
        })
        .catch(erro => {
          if (erro.request.status === 401) {
            this.$toastr.e(
              'Login ou senha inválidos', 'Erro!'
            )
          }
        })
    },

    cancelaLogin () {
      this.$emit('ajustarDialog', false)
    }
  }
}
</script>
<style>

.bgLogin {
  background-color: #67b4ba !important;
}
</style>
