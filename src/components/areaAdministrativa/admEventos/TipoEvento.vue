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
                        mdi-list-box
                      </v-icon>
                      Gerenciamento de Tipos de Eventos
                    </h2>
                  </v-col>
                  <v-col align-self="center" class="text-right">
                    <v-btn small @click="abreCadastroNewTipoEvento">Adicionar Tipo de Evento
                    </v-btn>
                  </v-col>
                </v-row>

              </v-alert>

              <!--DataTable-->
              <v-data-table
                dense
                :headers="headersTipoEventos"
                :items="tipoEventos"
                :search="searchTipoEventos"
                class="elevation-12 mt-4"
                sort-by="ano"
                elevation="12"
              >
                <template v-slot:top>
                  <v-toolbar
                    flat
                  >
                    <v-toolbar-title>Tabela de Tipos de Eventos Cadastrados</v-toolbar-title>

                    <v-divider
                      class="mx-4"
                      inset
                      vertical
                    ></v-divider>

                    <v-spacer></v-spacer>

                    <!--Pesquisar-->
                    <v-text-field
                      append-icon="mdi-magnify"
                      hide-details
                      label="Pesquisar"
                      placeholder="Pesquisar"
                      single-line
                      v-model="searchTipoEventos"
                    ></v-text-field>

                  </v-toolbar>

                </template>

                <!--Template de botões para editar, excluir -->
                <template v-slot:item.actions="{ item }">

                  <!--editar-->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="editTipoEvento(item)"
                        class=""
                        small
                        v-bind="attrs"
                        v-on="on"
                      >mdi-pen
                      </v-icon>
                    </template>
                    <span>Editar tipo de evento</span>
                  </v-tooltip>
                  <!--Excluir-->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="deleteTipoEvento(item)"
                        class=""
                        small
                        v-bind="attrs"
                        v-on="on"
                      >mdi-delete
                      </v-icon>
                    </template>
                    <span>Excluir tipo de evento</span>
                  </v-tooltip>

                </template>

              </v-data-table>

            </v-col>
          </v-row>
        </v-container>

      </v-card-text>
    </v-card>

    <!--Dialog para cadastrar tipo de evento-->
    <v-dialog max-width="800px" v-model="dialogCadastraTipoEvento">
      <v-card>
        <v-form @submit.prevent="saveTipoEvento">
          <v-card-title class="justify-center" primary-title>
            Cadastro de Tipo de Evento
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <span class="pl-3">Nome do tipo de evento</span>

                <v-text-field
                  class="ml-3"
                  dense
                  hint="Exemplo: Campanha de doação"
                  label="Tipo de Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="newTipoEvento"
                ></v-text-field>

              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="dialogCadastraTipoEvento= false" color="grey lighten-1">Cancelar</v-btn>
            <span class="pl-5 pr-5"></span>
            <v-btn type="submit" color="primary">Cadastrar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

    <!--Dialog para deletar tipo de evento-->
    <v-dialog max-width="800px" v-model="dialogDeleteTipoEvento">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar esse tipo de evento?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            Essa ação é irreversível. Tenha certeza do que está fazendo.<br>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogDeleteTipoEvento= false" color="grey lighten-1">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn @click="deleteTipoEventoConfirm" color="red lighten-1">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para editar tipo de evento-->
    <v-dialog max-width="800px" v-model="dialogEditaTipoEvento">
      <v-card>
        <v-form @submit.prevent="updateTipoEvento">
          <v-card-title class="justify-center" primary-title>
            Cadastro de Tipo de Evento
          </v-card-title>
          <v-card-text>
            <v-row>
              <v-col>
                <span class="pl-3">Nome do tipo de evento</span>

                <v-text-field
                  class="ml-3"
                  dense
                  hint="Exemplo: Campanha de doação"
                  label="Tipo de Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="selectedTipoEvento.tipo"
                ></v-text-field>

              </v-col>
            </v-row>
          </v-card-text>
          <v-card-actions class="pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="dialogEditaTipoEvento= false" color="grey lighten-1">Cancelar</v-btn>
            <span class="pl-5 pr-5"></span>
            <v-btn type="submit" color="primary">Alterar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-form>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'

export default {
  mixins: [logoutMixin],
  data: () => ({
    tipoEventos: [],
    searchTipoEventos: '',
    headersTipoEventos: [
      {
        text: 'Tipo',
        align: 'start',
        value: 'tipo'
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    dialogCadastraTipoEvento: false,
    newTipoEvento: '',
    dialogDeleteTipoEvento: false,
    selectedTipoEvento: {},
    dialogEditaTipoEvento: false,
    editedTipoEvento: ''
  }),
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado'])
  },
  async mounted () {
    await this.getTiposEventos()
  },
  methods: {
    async getTiposEventos () {
      try {
        this.$http.get('tipoevento')
          .then(response => {
            this.tipoEventos = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    abreCadastroNewTipoEvento () {
      this.dialogCadastraTipoEvento = true
      this.newTipoEvento = ''
    },

    saveTipoEvento () {
      if (this.newTipoEvento !== '') {
        let objetoParaEnvio = {}
        objetoParaEnvio['tipo'] = this.newTipoEvento
        return this.$http.post('tipoevento', objetoParaEnvio)
          .then(() => {
            this.getTiposEventos()
            this.$toastr.s(
              'Tipo de Evento cadastrado com sucesso', 'Sucesso!'
            )
            this.dialogCadastraTipoEvento = false
          })
          .catch((error) => {
            console.log(error)
            this.$toastr.e(
              'Não foi possível cadastrar o tipo de evento', 'Erro!'
            )
          })
      } else {
        this.$toastr.e(
          'Você deve preencher o nome do tipo de evento.', 'Erro!'
        )
      }
    },

    deleteTipoEvento (item) {
      this.selectedTipoEvento = item
      this.dialogDeleteTipoEvento = true
    },

    deleteTipoEventoConfirm () {
      this.$http.delete('tipoevento/' + this.selectedTipoEvento.id)
        .then(() => {
          this.getTiposEventos()
          this.dialogDeleteTipoEvento = false
          this.selectedTipoEvento = {}
          this.$toastr.s(
            'Tipo de Evento removido com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Tipo de Evento', 'Erro!'
          )
        })
    },

    editTipoEvento (item) {
      this.dialogEditaTipoEvento = true
      this.selectedTipoEvento = item
    },

    updateTipoEvento () {
      if (this.selectedTipoEvento.tipo !== '') {
        let objetoParaEnvio = {}
        objetoParaEnvio['id'] = this.selectedTipoEvento.id
        objetoParaEnvio['tipo'] = this.selectedTipoEvento.tipo
        return this.$http.put('tipoevento/' + this.selectedTipoEvento.id, objetoParaEnvio)
          .then(() => {
            this.getTiposEventos()
            this.$toastr.s(
              'Tipo de Evento alterado com sucesso', 'Sucesso!'
            )
            this.selectedTipoEvento = {}
            this.dialogEditaTipoEvento = false
          })
          .catch((error) => {
            console.log(error)
            this.$toastr.e(
              'Não foi possível alterar o tipo de evento', 'Erro!'
            )
          })
      } else {
        this.$toastr.e(
          'Você deve preencher o nome do tipo de evento.', 'Erro!'
        )
      }
    }
  }
}
</script>
