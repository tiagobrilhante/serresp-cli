<template>
  <v-main>
    <v-card>

      <v-card-text class="pb-0 mt-0">

        <v-container fluid>
          <v-row>
          <v-col>

          <!--Banner-->
          <v-alert
            elevation="12"
          >
            <v-row>
              <v-col>
                <h2>
                  <v-icon
                    class="mr-4"
                    size="36">
                    mdi-cogs
                  </v-icon>
                  Configurações
                </h2>
              </v-col>
            </v-row>

          </v-alert>

          <v-alert
            elevation="12"
          >
            <v-form @submit.prevent="doUpdateTotemConfig">
              <h3>Configurações do Sistema</h3>
              <v-divider></v-divider>

              <!--nome do sistema, larguras e alturas de imagem-->
              <v-row class="mt-1">

                <!--nome do sistema-->
                <v-col>

                  <span class="ml-0 textoBranco">Nome do Sistema</span>
                  <v-text-field
                    dense
                    label="Nome do Sistema"
                    rounded
                    solo
                    v-model="totemConfigs.nome_totem"
                  ></v-text-field>

                </v-col>

                <!--medidas das imagens-->
                <v-col>

                  <!--Altura e Largura Imagem INDEX-->
                  <v-row no-gutters>

                    <!--Altura Imagem Index-->
                    <v-col>
                      <span class="ml-0 textoBranco">Altura Imagem (Index)</span>
                      <v-text-field
                        class="mr-3"
                        dense
                        label="Altura Imagem"
                        rounded
                        solo
                        type="number"
                        v-model="totemConfigs.altura_index"
                      ></v-text-field>
                    </v-col>

                    <!--Largura Imagem Index-->
                    <v-col>
                      <span class="ml-3 textoBranco">Largura Imagem (Index)</span>
                      <v-text-field
                        class="ml-3"
                        dense
                        label="Largura Imagem"
                        rounded
                        solo
                        type="number"
                        v-model="totemConfigs.largura_index"
                      ></v-text-field>
                    </v-col>

                  </v-row>

                  <!--Altura e Largura Imagem DETALHE-->
                  <v-row no-gutters>

                    <!--Altura Imagem DETALHE-->
                    <v-col>
                      <span class="ml-0 textoBranco">Altura Imagem (Detalhe)</span>
                      <v-text-field
                        class="mr-3"
                        dense
                        label="Altura Imagem"
                        rounded
                        solo
                        type="number"
                        v-model="totemConfigs.altura_detail"
                      ></v-text-field>
                    </v-col>

                    <!--Largura imagem DETALHE-->
                    <v-col>
                      <span class="ml-3 textoBranco">Largura Imagem (Detalhe)</span>
                      <v-text-field
                        class="ml-3"
                        dense
                        label="Largura Imagem"
                        rounded
                        solo
                        type="number"
                        v-model="totemConfigs.largura_detail"
                      ></v-text-field>
                    </v-col>

                  </v-row>

                </v-col>

              </v-row>

              <!--ajustar -->
              <v-row no-gutters>
                <v-col cols="6"></v-col>
                <v-col cols="6" class="text-right">
                  <v-btn color="primary" type="submit">Salvar Configurações</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-alert>
          </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>
  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  mixins: [logoutMixin],
  data: () => ({
    totemConfigs: {}
  }),
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado'])
  },
  async mounted () {
    await this.getConfigs()
  },
  methods: {
    async getConfigs () {
      try {
        this.$http.get('totemconfig/plus')
          .then(response => {
            this.totemConfigs = Object.assign({}, response.data)
            console.log(this.totemConfigs)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },
    doUpdateTotemConfig () {
      if (this.totemConfigs.nome_totem === '' || this.totemConfigs.largura_detail === '' || this.totemConfigs.altura_detail === '' || this.totemConfigs.altura_index === '' || this.totemConfigs.largura_index === '') {
        this.$toastr.e(
          'Revise todos os campos! Não podem existir camos Vazios.', 'Erro!'
        )
      } else {
        try {
          this.$http.post('totemconfig', this.totemConfigs)
            .then(() => {
              this.getConfigs()
              this.$toastr.s(
                'Alterações efetuadas.', 'Sucesso!'
              )
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    }
  }

}
</script>
