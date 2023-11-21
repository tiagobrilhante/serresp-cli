<template>
  <v-main>

    <AdmEventos/>
    <!--adição de datas históricas-->

    <!--Dialog para deletar imagem de evento-->
    <v-dialog max-width="800px" v-model="dialogDeleteImagemEvento">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar essa imagem?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            Essa ação é irreversível e imediata. Tenha certeza do que está fazendo.<br>
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogDeleteImagemEvento= false" color="grey lighten-1">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn @click="deleteImagemEventoConfirm" color="red lighten-1">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para add imagem adicional de evento-->
    <v-dialog max-width="80%" v-model="dialogAddImagemAdicionalEvento">

      <!--Card de cadastro edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-area
          </v-icon>
          <span class="headline">
                       Adicionar Imagem Extra em evento</span>

        </v-card-title>

        <v-card-text>

          <v-container>

            <v-form @submit.prevent="saveImageAdicionalEvento">

              <!-- imagem , fonte e descricao-->
              <v-row dense>

                <!--imagem-->
                <v-col>
                  <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                  <v-file-input @change="selectImageAdicionalEvento"
                                accept="image/*"
                                dense
                                hint="Escolha uma imagem no formato .png ou .jpg"
                                label="Escolha uma imagem"
                                persistent-hint
                                placeholder="Insira uma imagem"
                                rounded
                                show-size
                                solo
                                v-model="inputImagemEventoAdicional"
                  ></v-file-input>

                </v-col>

                <!--fonte-->
                <v-col>
                  <span class="ml-3">Fonte da Imagem</span>
                  <v-text-field
                    dense
                    hint="Por exemplo: http://eb.mil.br/art24445"
                    label="Fonte da Imagem"
                    persistent-hint
                    placeholder="Insira a fonte da imagem"
                    required
                    rounded
                    solo
                    v-model="fonteImagemPcpNewEventoAdicional">

                  </v-text-field>

                </v-col>

                <!--descrição-->
                <v-col>
                  <span class="ml-3">Descrição da Imagem</span>
                  <v-text-field
                    dense
                    hint="Por exemplo: Foto de Pedro teixeira desembarcando de navio."
                    label="Descrição da imagem"
                    persistent-hint
                    placeholder="Insira a descrição da imagem"
                    required
                    rounded
                    solo
                    v-model="descricaoNewImgAdicionalEvento">

                  </v-text-field>

                </v-col>

              </v-row>

              <!--preview-->
              <v-row>
                <v-col>

                  <v-alert elevation="10" rounded="xl" v-if="previewImageEventoAdicional">
                    <h3>Preview:</h3>
                    <img :src="previewImageEventoAdicional" alt=""
                         class="v-responsive my-3 ml-auto mr-auto rounded-xl"/>
                  </v-alert>
                </v-col>
              </v-row>

              <!--Botões-->
              <v-row>

                <v-col class="text-right">

                  <!--Salvar-->
                  <v-btn
                    color="green darken-1"
                    type="submit">
                    Salvar
                  </v-btn>

                  <!--Cancelar-->
                  <v-btn
                    @click="dialogAddImagemAdicionalEvento = false"
                    class="ml-6"
                    color="red darken-1">
                    Cancelar
                  </v-btn>

                </v-col>

              </v-row>

            </v-form>

          </v-container>

        </v-card-text>

      </v-card>

    </v-dialog>

    <!--Dialog para deletar imagem Adicional de um evento-->
    <v-dialog max-width="800px" v-model="dialogDeleteImagemAdicionalEvento">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar a imagem adicional?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>

          <v-img :src="configSis.urlDownload + '/' + imagemAdicionalParaDeletar.imagem"
                 class="rounded-xl" aspect-ratio="1.5"/>
          <v-row class="mt-4">
            <v-col class="text-center">
              <h2>Essa ação é irreversível. Tenha certeza do que está fazendo.</h2>
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogDeleteImagemAdicionalEvento = false" color="grey lighten-1">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn @click="deleteImagemAdicionalConfirm" color="red lighten-1">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../http/config'
import {VueEditor, Quill} from 'vue2-editor'
import AdmEventos from '../components/areaAdministrativa/admEventos/AdmEventos'

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {VueEditor, Quill, AdmEventos},
  data: vm => ({
    content: '',
    configSis: config,
    assuntoSelect: [],
    editedIndex: -1,
    editedUser: {},
    dialogDelete: false,
    searchAssuntos: '',
    headersAssuntos: [
      {
        text: 'Ordem Exibição',
        align: 'start',
        value: 'ordem_exibicao'
      },
      {
        text: 'Nome',
        align: 'start',
        value: 'nome_assunto'
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    totemConfigs: {
      nome_totem: '',
      altura_index: '',
      largura_index: '',
      altura_detail: '',
      largura_detail: '',
      access_code: ''
    },
    dialogAdmAssunto: false,
    dialogDeleteAssunto: false,
    dialogEditAssunto: false,
    dialogAddAssunto: false,
    ordemNewAssunto: '',
    nomeNewAssunto: '',
    editedAssuntoIndex: -1,
    editedAssunto: {},
    nomeEditAssunto: '',
    ordemEditAssunto: '',
    dialogAddImagem: false,
    editedImageIndex: -1,
    abrePreviewEdit: false,
    currentImage: undefined,
    previewImage: undefined,
    inputImagem: undefined,
    legendaImg: '',
    nomeNewImage: '',
    imagemNewOrdem: '',
    isImgNewBanner: false,
    legendaNewImg: '',
    saibaMaisNewImg: '',
    myAssunto: '',
    qtdImg: 0,
    arrayImages: [],
    imagemAtual: {},
    dialogDeleteImagem: false,
    dialogEditImagem: false,
    nomeEditImage: '',
    imagemEditOrdem: '',
    isImgEditBanner: false,
    legendaEditImg: '',
    saibaMaisEditImg: '',
    myAssuntoEdit: {},
    previewEditImage: undefined,
    currentEditImage: undefined,
    inputEditImagem: undefined,
    showHideEditInputImage: false,
    textoBtnAlteraCancela: 'Alterar a Imagem Atual',
    openFormConfig: false,
    diaNewEvento: '',
    mesNewEvento: '',
    anoNewEvento: '',
    tituloNewEvento: '',
    legendaNewEvento: '',
    saibaMaisNewEvento: '',
    fonteImagemPcpNewEvento: '',
    descricaoNewImgAdicionalEvento: '',
    fonteImagemPcpNewEventoAdicional: '',
    currentImageEvento: undefined,
    previewImageEvento: undefined,
    inputImagemEvento: undefined,
    currentImageEventoAdicional: undefined,
    previewImageEventoAdicional: undefined,
    inputImagemEventoAdicional: undefined,
    eventos: [],
    headersEventos: [
      {
        text: 'Data',
        align: 'start',
        value: 'ano'
      },
      {
        text: 'Nome',
        align: 'start',
        value: 'nome'
      },
      {
        text: 'Legenda',
        value: 'legenda'
      },
      {
        text: 'Imagem',
        value: 'imagem',
        align: 'center',
        sortable: false
      },
      {
        text: 'Actions',
        value: 'actions',
        align: 'center',
        sortable: false
      }
    ],
    searchEventos: '',
    mostraCadastroEventos: false,
    mostraTabelaCadastrados: true,
    dialogShowImagemEvento: false,
    imgEventoShow: '',
    imgEventoFonteShow: '',
    dialogDeleteEvento: false,
    selectedEvento: {},
    dialogEditEvento: false,
    dialogDeleteImagemEvento: false,
    guardadorDeImg: null,
    momentoEditImg: false,
    optionsMes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    optionsDia: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    dialogUpdateBG: false,
    currentEditBG: undefined,
    previewEditBG: undefined,
    inputEditBG: undefined,
    indexNewImgAdicionalEvento: 0,
    eventoNewImgAdicional: [],
    objetoEventoNewImgAdicional: [],
    dialogAddImagemAdicionalEvento: false,
    dialogDeleteImagemAdicionalEvento: false,
    imagemAdicionalParaDeletar: {}
  }),
  computed: {
    formTitle () {
      return this.editedImageIndex === -1 ? this.textoBtnNovaPos : this.textoBtnEditarPos
    },
    ...mapGetters(['usuarioLogado'])
  },
  watch: {
    dialogDelete (val) {
      val || this.closeDelete()
    }
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

            if (response.data.tipo_totem === 'normal') {
              try {
                this.$http.get('assunto')
                  .then(response => {
                    this.assuntoSelect = response.data
                  })
                  .catch(erro => console.log(erro))
              } catch (e) {
                console.log(e)
              }
            } else {
              try {
                this.$http.get('eventos')
                  .then(response => {
                    this.eventos = response.data
                  })
                  .catch(erro => console.log(erro))
              } catch (e) {
                console.log(e)
              }
            }
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    editAssunto (item) {
      this.editedAssuntoIndex = this.assuntoSelect.indexOf(item)
      this.editedAssunto = Object.assign({}, item)
      this.nomeEditAssunto = this.editedAssunto.nome_assunto
      this.ordemEditAssunto = this.editedAssunto.ordem_exibicao
      this.dialogEditAssunto = true
    },

    closeDeleteAssunto () {
      this.dialogDeleteAssunto = false
      this.$nextTick(() => {
        this.editedAssunto = {}
        this.editedAssuntoIndex = -1
      })
    },

    getAtualAssunto () {
      try {
        this.$http.get('img/assunto/' + this.myAssunto.id)
          .then(response => {
            this.getImgExib(response.data)
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    getImgExib (arrayImgIni) {
      if (arrayImgIni.length === 0) {
        this.qtdImg = 0
      } else {
        this.qtdImg = arrayImgIni.length
        this.arrayImages = arrayImgIni
        this.imagemAtual = arrayImgIni[0]
      }
    },

    saveImage () {
      // ARRUMAR
      if (this.currentImage !== undefined) {
        let formData = new FormData()
        formData.append('imagem', this.currentImage)
        formData.append('nome', this.nomeNewImage)
        formData.append('ordem', this.imagemNewOrdem)
        formData.append('banner', this.isImgNewBanner)
        formData.append('legenda', this.legendaNewImg)
        formData.append('saibamais', this.saibaMaisNewImg)
        formData.append('assunto_id', this.myAssunto.id)
        return this.$http.post('img', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.getAtualAssunto()
          this.$toastr.s(
            'Imagem cadastrada com sucesso', 'Sucesso!'
          )
          this.dialogAddImagem = false
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível cadastrar a imagem', 'Erro!'
            )
            this.dialogAddImagem = false
          })
      } else {
        this.$toastr.e(
          'Você deve selecionar ao menos uma Imagem.', 'Erro!'
        )
      }
    },

    saveEditImage () {
      let formData = new FormData()
      formData.append('id', this.imagemAtual.id)
      formData.append('imagem', this.currentEditImage)
      formData.append('nome', this.nomeEditImage)
      formData.append('ordem', this.imagemEditOrdem)
      formData.append('banner', this.isImgEditBanner)
      formData.append('legenda', this.legendaEditImg)
      formData.append('saibamais', this.saibaMaisEditImg)
      formData.append('assunto_id', this.myAssuntoEdit)
      formData.append('trocaImagem', this.showHideEditInputImage)
      return this.$http.post('img/update', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }).then((response) => {
        console.log(response.data)
        this.dialogEditImagem = false
        this.getAtualAssunto()
        this.$toastr.s(
          'Imagem editada com sucesso', 'Sucesso!'
        )
        this.dialogAddImagem = false
      })
        .catch(() => {
          this.$toastr.e(
            'Não foi possível editar a imagem', 'Erro!'
          )
          this.dialogAddImagem = false
        })
    },

    selectImage (image) {
      if (image === null || image === undefined) {
        this.currentImage = undefined
        this.previewImage = undefined
        this.inputImagem = undefined
      } else {
        this.currentImage = image
        this.previewImage = URL.createObjectURL(this.currentImage)
      }
    },

    selectImageEvento (image) {
      if (image === null || image === undefined) {
        this.currentImageEvento = undefined
        this.previewImageEvento = undefined
        this.inputImagemEvento = undefined
      } else {
        this.currentImageEvento = image
        this.previewImageEvento = URL.createObjectURL(this.currentImageEvento)
      }
    },

    selectEditImage (image) {
      if (image === null || image === undefined) {
        this.currentEditImage = undefined
        this.previewEditImage = undefined
        this.inputEditImagem = undefined
      } else {
        this.currentEditImage = image
        this.previewEditImage = URL.createObjectURL(this.currentEditImage)
      }
    },

    closeAddImge () {
      this.dialogAddImagem = false
    },

    recebeImagemSolicitada (ordem) {
      for (let i = 0; i < this.arrayImages.length; i++) {
        if (ordem === this.arrayImages[i].ordem) {
          this.imagemAtual = this.arrayImages[i]
        }
      }
    },

    openDialogDeletaImagem () {
      this.dialogDeleteImagem = true
    },

    deleteImagemConfirm () {
      this.$http.delete('img/' + this.imagemAtual.id)
        .then(() => {
          for (let i = 0; i < this.arrayImages.length; i++) {
            if (this.arrayImages[i].id === this.imagemAtual.id) {
              this.arrayImages.splice(i, 1)
            }
          }
          this.getImgExib(this.arrayImages)
          this.dialogDeleteImagem = false
          this.$toastr.s(
            'Imagem removida com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover a Imagem', 'Erro!'
          )
        })
    },

    toggleEditImagem () {
      this.currentEditImage = undefined
      this.previewEditImage = undefined
      this.inputEditImagem = undefined
      if (this.showHideEditInputImage) {
        this.showHideEditInputImage = false
        this.textoBtnAlteraCancela = 'Alterar a Imagem Atual'
      } else {
        this.showHideEditInputImage = true
        this.textoBtnAlteraCancela = 'Cancelar alteração de Imagem'
      }
    },

    openSpaceConfig () {
      this.openFormConfig = true
    },

    cancelConfigTotem () {
      this.openFormConfig = false
    },

    resetCamposEvento () {
      this.diaNewEvento = ''
      this.mesNewEvento = ''
      this.anoNewEvento = ''
      this.tituloNewEvento = ''
      this.legendaNewEvento = ''
      this.saibaMaisNewEvento = ''
      this.saibaMaisNewEvento = ''
      this.currentImageEvento = undefined
      this.previewImageEvento = undefined
      this.inputImagemEvento = undefined
    },

    openDialogAddImgAdicionalEvento () {
      this.currentImageEventoAdicional = undefined
      this.previewImageEventoAdicional = undefined
      this.inputImagemEventoAdicional = undefined
      this.fonteImagemPcpNewEventoAdicional = ''
      this.descricaoNewImgAdicionalEvento = ''
      this.dialogAddImagemAdicionalEvento = true
    },

    saveEvento () {
      if (this.diaNewEvento !== '' && this.mesNewEvento === '') {
        this.$toastr.e(
          'Se você preenche o campo DIA, obrigatoriamente deve preenche o campo MÊS', 'Erro!'
        )
      } else {
        if (this.tituloNewEvento !== '' && this.anoNewEvento !== '') {
          let formData = new FormData()
          formData.append('dia', this.diaNewEvento)
          formData.append('mes', this.mesNewEvento)
          formData.append('ano', this.anoNewEvento)
          formData.append('nome', this.tituloNewEvento)
          formData.append('legenda', this.legendaNewEvento)
          formData.append('saibamais', this.saibaMaisNewEvento)
          formData.append('fonteimagempcp', this.fonteImagemPcpNewEvento)
          formData.append('imagem', this.currentImageEvento)

          return this.$http.post('eventos', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then((response) => {
            this.resetCamposEvento()
            this.getConfigs()
            this.$toastr.s(
              'Evento cadastrado com sucesso', 'Sucesso!'
            )
            this.mostraCadastroEventos = false
            this.mostraTabelaCadastrados = true
          })
            .catch((error) => {
              console.log(error)
              this.$toastr.e(
                'Não foi possível cadastrar o evento', 'Erro!'
              )
            })
        } else {
          this.$toastr.e(
            'Você deve preencher os campos obrigatórios.', 'Erro!'
          )
        }
      }
    },

    abreCadastroNewEvento () {
      this.objetoEventoNewImgAdicional = []
      this.indexNewImgAdicionalEvento = 0
      this.mostraCadastroEventos = true
      this.mostraTabelaCadastrados = false
    },

    cancelaCadastroNewEvento () {
      this.mostraCadastroEventos = false
      this.mostraTabelaCadastrados = true
      this.resetCamposEvento()
    },

    editEvento (item) {
      this.currentImageEvento = undefined
      this.previewImageEvento = undefined
      this.inputImagemEvento = undefined
      this.guardadorDeImg = null
      this.momentoEditImg = false
      this.selectedEvento = item
      this.dialogEditEvento = true
    },

    deleteEvento (item) {
      this.selectedEvento = item
      this.dialogDeleteEvento = true
    },

    deleteEventoConfirm () {
      this.$http.delete('eventos/' + this.selectedEvento.id)
        .then(() => {
          this.getConfigs()
          this.dialogDeleteEvento = false
          this.$toastr.s(
            'Evento removido com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Evento', 'Erro!'
          )
        })
    },

    editEventoConfirm () {
      if (this.selectedEvento.nome !== '' && this.selectedEvento.ano !== '') {
        let formData = new FormData()
        formData.append('id', this.selectedEvento.id)
        formData.append('dia', this.selectedEvento.dia)
        formData.append('mes', this.selectedEvento.mes)
        formData.append('ano', this.selectedEvento.ano)
        formData.append('nome', this.selectedEvento.nome)
        formData.append('legenda', this.selectedEvento.legenda)
        formData.append('saibamais', this.selectedEvento.saibamais)
        formData.append('fonteimagempcp', this.selectedEvento.fonteimagempcp)
        formData.append('imagem', this.inputImagemEvento)
        return this.$http.post('eventos/update', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.currentImageEvento = undefined
          this.previewImageEvento = undefined
          this.inputImagemEvento = undefined
          this.selectedEvento = {}
          this.dialogEditEvento = false
          this.guardadorDeImg = null
          this.momentoEditImg = false
          this.getConfigs()
          this.$toastr.s(
            'Evento Alterado com sucesso', 'Sucesso!'
          )
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível Alterar o evento', 'Erro!'
            )
          })
      } else {
        this.$toastr.e(
          'Você deve preencher os campos obrigatórios.', 'Erro!'
        )
      }
    },

    showImg (imagem) {
      this.imgEventoShow = ''
      this.imgEventoFonteShow = ''
      this.dialogShowImagemEvento = true
      this.imgEventoShow = imagem.imagem
      this.imgEventoFonteShow = imagem.fonteimagempcp
    },

    excluiImgEditEvento () {
      this.dialogDeleteImagemEvento = true
    },

    deleteImagemEventoConfirm () {
      try {
        this.$http.post('eventos/removeimagem', this.selectedEvento)
          .then(response => {
            this.selectedEvento = response.data

            for (let i = 0; i < this.eventos.length; i++) {
              if (this.eventos[i].id === response.data.id) {
                this.eventos.splice(i, 1, response.data)
              }
            }
            this.dialogDeleteImagemEvento = false
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
    },

    editExistentImageEvento () {
      this.guardadorDeImg = this.selectedEvento.imagem
      this.selectedEvento.imagem = null
      this.momentoEditImg = true
    },

    retomaImgAntiga () {
      this.selectedEvento.imagem = this.guardadorDeImg
      this.guardadorDeImg = null
      this.momentoEditImg = false
    },

    limitInput (tipo) {
      if (tipo === 'add') {
        // Certifique-se de que apenas números sejam inseridos
        this.anoNewEvento = this.anoNewEvento.replace(/\D/g, '')

        if (this.anoNewEvento.length > 4) {
          this.anoNewEvento = this.anoNewEvento.slice(0, 4) // Limita a 4 caracteres
        }
      } else {
        // Certifique-se de que apenas números sejam inseridos
        this.selectedEvento.ano = this.selectedEvento.ano.replace(/\D/g, '')

        if (this.selectedEvento.ano.length > 4) {
          this.selectedEvento.ano = this.selectedEvento.ano.slice(0, 4) // Limita a 4 caracteres
        }
      }
    },

    editBG () {
      this.dialogUpdateBG = true
      this.currentEditBG = undefined
      this.previewEditBG = undefined
      this.inputEditBG = undefined
    },

    selectEditBG (image) {
      if (image === null || image === undefined) {
        this.currentEditBG = undefined
        this.previewEditBG = undefined
        this.inputEditBG = undefined
      } else {
        this.currentEditBG = image
        this.previewEditBG = URL.createObjectURL(this.currentEditBG)
      }
    },

    updateBgConfirm () {
      if (this.inputEditBG === undefined) {
        this.$toastr.e(
          'É necessário o envio de uma imagem.', 'Erro!'
        )
      } else {
        let formData = new FormData()
        formData.append('imagem', this.inputEditBG)
        return this.$http.post('totemconfig/updatebg', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then(() => {
          this.currentEditBG = undefined
          this.previewEditBG = undefined
          this.inputEditBG = undefined
          this.dialogUpdateBG = false
          this.getConfigs()
          this.$toastr.s(
            'Background Alterado com sucesso.', 'Sucesso!'
          )
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível Alterar o Background.', 'Erro!'
            )
          })
      }
    },

    excluiBG () {
      try {
        this.$http.get('totemconfig/removebg')
          .then(() => {
            this.totemConfigs.bg_img = null
            this.$toastr.s(
              'Background removido com sucesso', 'Sucesso!'
            )
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }
      console.log('delete')
    },

    addNewBG () {
      this.dialogUpdateBG = true
      this.currentEditBG = undefined
      this.previewEditBG = undefined
      this.inputEditBG = undefined
    },

    selectImageAdicionalEvento (image) {
      if (image === null || image === undefined) {
        this.currentImageAdicionalEvento = undefined
        this.previewImageEventoAdicional = undefined
        this.inputImagemEventoAdicional = undefined
      } else {
        this.currentImageAdicionalEvento = image
        this.previewImageEventoAdicional = URL.createObjectURL(this.currentImageAdicionalEvento)
      }
    },

    saveImageAdicionalEvento () {
      if (this.currentImageAdicionalEvento !== undefined) {
        let formData = new FormData()
        formData.append('imagem', this.currentImageAdicionalEvento)
        formData.append('fonte', this.fonteImagemPcpNewEventoAdicional)
        formData.append('descricao', this.descricaoNewImgAdicionalEvento)
        formData.append('evento_id', this.selectedEvento.id)
        return this.$http.post('eventos/adicionaimgadicional', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }).then((response) => {
          this.selectedEvento = response.data
          this.$toastr.s(
            'Imagem Adicional cadastrada com sucesso', 'Sucesso!'
          )
          this.dialogAddImagemAdicionalEvento = false
        })
          .catch(() => {
            this.$toastr.e(
              'Não foi possível cadastrar a imagem adicional', 'Erro!'
            )
          })
      } else {
        this.$toastr.e(
          'Você deve selecionar ao menos uma Imagem.', 'Erro!'
        )
      }
    },

    openDeleteImagem (imagem) {
      this.dialogDeleteImagemAdicionalEvento = true
      this.imagemAdicionalParaDeletar = imagem
      console.log(this.selectedEvento)
    },

    deleteImagemAdicionalConfirm () {
      this.$http.delete('eventos/deletaimgadicional/' + this.imagemAdicionalParaDeletar.id)
        .then(() => {
          for (let i = 0; i < this.selectedEvento.imagens_adicionais.length; i++) {
            if (this.selectedEvento.imagens_adicionais[i].id === this.imagemAdicionalParaDeletar.id) {
              this.selectedEvento.imagens_adicionais.splice(i, 1)
            }
          }

          this.dialogDeleteImagemAdicionalEvento = false
          this.$toastr.s(
            'Imagem removida com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover a Imagem', 'Erro!'
          )
        })
    }
  }
}
</script>

<style>

.bgConfig {
  background-color: #6b5252 !important;
}

.ajusteBtn {
  margin-top: -70px;
  margin-bottom: 10px;
}

@import url('https://fonts.cdnfonts.com/css/impact');

.textlConfig {
  font-family: 'Impact', sans-serif;
  color: white;
}

.textoBranco {
  color: white;
}

.reduz_tamanho {
  width: 200px;
  margin: auto;
}

.reduz_tamanho_muito {
  width: 100px;
  margin: auto;
}

.ajustaDiv {
  overflow: hidden;
}

.ajustaLocal {
  width: 100%;
}
</style>
