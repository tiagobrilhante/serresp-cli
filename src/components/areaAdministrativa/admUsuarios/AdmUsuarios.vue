<template>
  <v-main>
    <v-card>

      <v-card-text>

        <v-container fluid>

          <!--Banner-->
          <v-alert
            class="p-5"
            elevation="21"
          >
            <v-row>
              <v-col cols="9">
                <h2>
                  <v-icon
                    class="mr-4"
                    size="36">
                    fa fa-user
                  </v-icon>
                  Gerenciamento de Usuários
                </h2>

              </v-col>
              <v-col class="text-right" cols="3">
                <v-btn @click="openDialogAddUser" class="primary">Adicionar Novo</v-btn>
              </v-col>
            </v-row>

          </v-alert>

          <!--DataTable-->
          <v-data-table
            :headers="headers"
            :items="usuarios"
            :search="search"
            class="elevation-12 mt-4"
            sort-by="nome"
          >
            <template v-slot:top>
              <v-toolbar
                flat
              >
                <v-toolbar-title>Tabela de Usuários Cadastrados</v-toolbar-title>

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
                  v-model="search"
                ></v-text-field>

                <!--Dialog para deletar usuário-->
                <v-dialog max-width="800px" v-model="dialogDelete">
                  <v-card>
                    <v-card-title class="justify-center" primary-title>
                      <v-icon
                        class="mr-4">
                        fa fa-exclamation-triangle
                      </v-icon>
                      Você tem certeza que quer deletar o usuário {{ editedUser.email }}?
                      <v-icon
                        class="ml-4">
                        fa fa-exclamation-triangle
                      </v-icon>

                    </v-card-title>
                    <v-card-text>
                      <div class="text-center">Essa ação é irreversível. Tenha certeza do que está fazendo.</div>
                    </v-card-text>
                    <v-card-actions class="pb-5">
                      <v-spacer></v-spacer>
                      <v-btn @click="closeDelete" color="grey lighten-1">Cancelar</v-btn>
                      <span class="pl-5 pr-5"></span>
                      <v-btn @click="deleteUserConfirm" color="red lighten-1">Excluir</v-btn>
                      <v-spacer></v-spacer>
                    </v-card-actions>
                  </v-card>
                </v-dialog>

                <!--Dialog para editar usuário-->
                <v-dialog max-width="800px" v-model="dialogEditUser">
                  <v-card>
                    <v-form @submit.prevent="editUserConfirm">
                      <v-card-title class="justify-center" primary-title>
                        Editar usuário
                      </v-card-title>
                      <v-card-text>

                        <!--nome completo-->
                        <v-row no-gutters>
                          <v-col>
                            <span class="pl-3">Nome Completo</span>
                            <v-text-field
                              class="ml-3"
                              dense
                              label="Nome Completo"
                              rounded
                              solo
                              v-model="nomeEditUser"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <!--email-->
                        <v-row no-gutters>
                          <v-col>
                            <span class="pl-3">Email</span>
                            <v-text-field
                              class="ml-3"
                              dense
                              label="Email"
                              rounded
                              solo
                              type="email"
                              v-model="emailEditUser"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                        <!--alterar a senha-->
                        <v-row no-gutters>
                          <v-col>
                            <v-checkbox
                              class="pl-3"
                              label="Alterar a Senha"
                              v-model="editarSenha"
                            ></v-checkbox>
                          </v-col>
                        </v-row>

                        <!--senha-->
                        <v-row no-gutters v-if="editarSenha">

                          <v-col><span class="pl-3">Nova Senha</span>
                            <v-text-field
                              class="ml-3"
                              dense
                              label="Senha"
                              rounded
                              solo
                              type="password"
                              v-model="passwordEditUser"
                            ></v-text-field>
                          </v-col>
                        </v-row>

                      </v-card-text>
                      <v-card-actions class="pb-5">
                        <v-spacer></v-spacer>
                        <v-btn @click="dialogEditUser = false" color="warning lighten-1">Cancelar</v-btn>
                        <span class="pl-5 pr-5"></span>
                        <v-btn color="success" type="submit">Editar</v-btn>
                        <v-spacer></v-spacer>
                      </v-card-actions>

                    </v-form>
                  </v-card>

                </v-dialog>

              </v-toolbar>

            </template>

            <!--Template de botões para editar, excluir -->
            <template v-slot:item.actions="{ item }">

              <!--editar-->
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click="editUser(item)"
                    class="mr-2"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-pen
                  </v-icon>
                </template>
                <span>Editar Usuário</span>
              </v-tooltip>

              <!--Excluir-->
              <v-tooltip top>
                <template v-slot:activator="{ on, attrs }">
                  <v-icon
                    @click="deleteUser(item)"
                    class="mr-2"
                    small
                    v-bind="attrs"
                    v-on="on"
                  >
                    mdi-delete
                  </v-icon>
                </template>
                <span>Excluir Usuário</span>
              </v-tooltip>

            </template>

          </v-data-table>

        </v-container>

        <!--Dialog para add usuário-->
        <v-dialog max-width="800px" v-model="dialogAddUser">
          <v-card>
            <v-form @submit.prevent="efetuarCadastroUsuario">
              <v-card-title class="justify-center" primary-title>
                Adicionar novo usuário
              </v-card-title>
              <v-card-text>

                <!--nome completo-->
                <v-row no-gutters>
                  <v-col>
                    <span class="pl-3">Nome Completo</span>
                    <v-text-field
                      class="ml-3"
                      dense
                      label="Nome Completo"
                      rounded
                      solo
                      v-model="nomeNewUser"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!--email-->
                <v-row no-gutters>
                  <v-col>
                    <span class="pl-3">Email</span>
                    <v-text-field
                      class="ml-3"
                      dense
                      label="Email"
                      rounded
                      solo
                      type="email"
                      v-model="emailNewUser"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!--senha-->
                <v-row no-gutters>

                  <v-col><span class="pl-3">Senha</span>
                    <v-text-field
                      class="ml-3"
                      dense
                      label="Senha"
                      rounded
                      solo
                      type="password"
                      v-model="passwordNewUser"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-card-text>
              <v-card-actions class="pb-5">
                <v-spacer></v-spacer>
                <v-btn @click="dialogAddUser = false" color="warning lighten-1">Cancelar</v-btn>
                <span class="pl-5 pr-5"></span>
                <v-btn color="success" type="submit">Cadastrar</v-btn>
                <v-spacer></v-spacer>
              </v-card-actions>

            </v-form>
          </v-card>

        </v-dialog>

      </v-card-text>

    </v-card>
  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../../../http/config'

export default {
  mixins: [logoutMixin],
  data: () => ({
    configSis: config,
    dialogDelete: false,
    dialogUser: false,
    editedIndex: -1,
    editedUser: {},
    dialogAddUser: false,
    nomeNewUser: '',
    emailNewUser: '',
    passwordNewUser: '',
    nomeEditUser: '',
    emailEditUser: '',
    passwordEditUser: '',
    dialogEditUser: false,
    editarSenha: false,
    usuarios: [],
    search: '',
    searchAssuntos: '',
    headers: [
      {
        text: 'Nome',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'Email',
        align: 'start',
        value: 'email'
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ]
  }),
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado'])
  },
  async mounted () {
    await this.getUsers()
  },
  methods: {
    async getUsers () {
      try {
        this.$http.get('users')
          .then(response => {
            this.usuarios = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },
    efetuarCadastroUsuario () {
      if (this.nomeNewUser === '' || this.emailNewUser === '' || this.passwordNewUser === '') {
        this.$toastr.e(
          'Não foi possível realizar o cadastro! Todos os capos devem ser preenchidos.', 'Erro!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome'] = this.nomeNewUser
        objetoParaEnvio['email'] = this.emailNewUser
        objetoParaEnvio['password'] = this.passwordNewUser

        try {
          this.$http.post('users', objetoParaEnvio)
            .then(response => {
              this.usuarios.push(response.data)
              this.dialogAddUser = false
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    openDialogAddUser () {
      this.dialogAddUser = true
      this.nomeNewUser = ''
      this.emailNewUser = ''
      this.passwordNewUser = ''
    },

    deleteUser (item) {
      this.editedIndex = this.usuarios.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.nomeEditUser = this.editedUser.nome
      this.dialogDelete = true
    },

    editUser (item) {
      this.editedIndex = this.usuarios.indexOf(item)
      this.editedUser = Object.assign({}, item)
      this.nomeEditUser = this.editedUser.nome
      this.emailEditUser = this.editedUser.email
      this.passwordEditUser = ''
      this.editarSenha = false
      this.dialogEditUser = true
    },

    deleteUserConfirm () {
      this.$http.delete('users/' + this.editedUser.id)
        // eslint-disable-next-line no-return-assign
        .then(() => {
          this.usuarios.splice(this.editedIndex, 1)
          this.closeDelete()
          this.$toastr.s(
            'Usuário removido com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Usuário', 'Erro!'
          )
        })
    },

    sendEditToApi (objetoParaEnvio) {
      this.$http.put('users/' + this.editedUser.id, objetoParaEnvio)
        .then(response => {
          Object.assign(this.usuarios[this.editedIndex], response.data)
          this.$toastr.s(
            'Usuário alterado com sucesso', 'Sucesso!'
          )
          this.dialogEditUser = false
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível alterar o usuário.', 'Erro!'
          )
        })
    },

    editUserConfirm () {
      let objetoParaEnvio = {}
      if (this.editarSenha) {
        if (this.nomeEditUser === '' || this.emailEditUser === '' || this.passwordEditUser === '') {
          this.$toastr.e(
            'Não foi possível realizar a alteração do Usuário! Todos os capos devem ser preenchidos.', 'Erro!'
          )
        } else {
          objetoParaEnvio['nome'] = this.nomeEditUser
          objetoParaEnvio['email'] = this.emailEditUser
          objetoParaEnvio['password'] = this.passwordEditUser
          objetoParaEnvio['editSenha'] = this.editarSenha
          this.sendEditToApi(objetoParaEnvio)
        }
      } else {
        if (this.nomeEditUser === '' || this.emailEditUser === '') {
          this.$toastr.e(
            'Não foi possível realizar a alteração do Usuário! Todos os capos devem ser preenchidos.', 'Erro!'
          )
        } else {
          objetoParaEnvio['nome'] = this.nomeEditUser
          objetoParaEnvio['email'] = this.emailEditUser
          objetoParaEnvio['editSenha'] = this.editarSenha
          this.sendEditToApi(objetoParaEnvio)
        }
      }
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedUser = {}
        this.editedIndex = -1
      })
    }
  }

}
</script>
