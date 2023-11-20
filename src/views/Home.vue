<template>
  <v-main>
    <v-card>

      <v-card-text class="pb-0 mt-0">
        <!--adição de datas históricas-->
        <v-container fluid>
          <v-alert color="rgb(255,255,255,0.5)" v-if="mostraCadastroEventos">
            <h3>Cadastro de eventos históricos</h3>
            <br>

            <v-form @submit.prevent="saveEvento">

              <!--data e título do evento-->
              <v-row>

                <!--data do evento-->
                <v-col>
                  <span class="pl-3">Insira a data do evento</span>

                  <!--dia mes e ano-->
                  <v-row>

                    <!--dia-->
                    <v-col>
                      <span class="pl-3">Dia</span>

                      <v-autocomplete
                        :items="optionsDia"
                        class="ml-3"
                        clearable
                        dense
                        hint="Insira o dia do evento (de 1 a 31) caso deixe em branco o evento não se restringe a um dia"
                        label="Dia"
                        persistent-hint
                        rounded
                        solo
                        v-model="diaNewEvento"
                      ></v-autocomplete>
                    </v-col>

                    <!--mes-->
                    <v-col>
                      <span class="pl-3">Mês</span>

                      <v-autocomplete
                        :items="optionsMes"
                        class="ml-3"
                        clearable
                        dense
                        hint="Insira o mês do evento (de 1 a 12) caso deixe em branco o evento não se restringe a um mês"
                        label="Mês"
                        persistent-hint
                        rounded
                        solo
                        v-model="mesNewEvento"
                      ></v-autocomplete>
                    </v-col>

                    <!--ano-->
                    <v-col>
                      <span class="pl-3">Ano</span>
                      <v-text-field
                        :maxlength="4"
                        @input="limitInput('add')"
                        class="ml-3"
                        dense
                        hint="Insira o ano do evento ( 4 dígitos ) * obrigatório"
                        label="Ano"
                        max="9999"
                        min="1"
                        persistent-hint
                        rounded
                        solo
                        type="text"
                        v-model="anoNewEvento"
                      ></v-text-field>
                    </v-col>

                  </v-row>

                </v-col>

                <!--titulo evento-->
                <v-col>
                  <span class="pl-3">Título do evento</span>

                  <v-text-field
                    class="ml-3"
                    dense
                    hint="Exemplo: Batalha dos Guararapes"
                    label="Título do Evento"
                    persistent-hint
                    rounded
                    solo
                    v-model="tituloNewEvento"
                  ></v-text-field>

                </v-col>

              </v-row>

              <!--legenda e imagem-->
              <v-row>

                <!--legenda-->
                <v-col>

                  <v-textarea
                    auto-grow
                    class="mb-0 pb-0 mt-3"
                    hint="Se deixado em branco, a não será mostrado nenhum texto como legenda."
                    label="Legenda do Evento"
                    no-resize
                    persistent-hint
                    rounded
                    rows="5"
                    solo
                    v-model="legendaNewEvento"
                  ></v-textarea>

                  <v-alert color="warning">
                    <p>Você pode cadastrar imagens adicionais para um evento, no entanto, é necessário que o evento
                      seja criado primeiro, em seguida acesse a opção de editar evento para realizar a adição de
                      outras imagens. (na tabela de eventos cadastrados)</p>
                    <p>A imagem principal, é aquela que aparecerá no card de abertura do evento.</p>

                  </v-alert>
                </v-col>

                <!--imagem-->
                <v-col>

                  <span class="ml-3">Imagem</span>
                  <v-file-input @change="selectImageEvento"
                                accept="image/*"
                                dense
                                hint="Escolha uma imagem no formato .png ou .jpg"
                                label="Escolha uma imagem (SFC)"
                                persistent-hint
                                placeholder="Insira uma imagem se for o caso"
                                rounded
                                show-size
                                solo
                                v-model="inputImagemEvento"
                  ></v-file-input>

                  <!--preview-->
                  <v-alert elevation="10" rounded="xl" v-if="previewImageEvento">
                    <h3>Preview:</h3>
                    <img :src="previewImageEvento" alt="" class="v-responsive ml-auto mr-auto my-3 rounded-xl"/>

                    <span class="pl-3">Fonte da imagem</span>

                    <v-text-field
                      class="ml-3"
                      dense
                      hint="Exemplo: https://eb.mil.br/artigo233"
                      label="Fonte da imagem"
                      persistent-hint
                      rounded
                      solo
                      v-model="fonteImagemPcpNewEvento"
                    ></v-text-field>

                  </v-alert>

                </v-col>
              </v-row>

              <v-row>
                <v-col>
                  <v-card class="rounded-xxl">
                    <vue-editor class="rounded-xxl" v-model="content"></vue-editor>
                  </v-card>
                </v-col>
              </v-row>

              <!--saiba mais-->
              <v-row>
                <v-col>
                  <v-textarea
                    auto-grow
                    class="mb-0 pb-0 mt-3"
                    hint="Se deixado em branco, a não será mostrado nenhum texto como saiba mais."
                    label="Saiba Mais"
                    no-resize
                    persistent-hint
                    rounded
                    rows="5"
                    solo
                    v-model="saibaMaisNewEvento"
                  ></v-textarea>
                </v-col>
              </v-row>

              <!--btn action salvar cancelar-->
              <v-row>
                <v-col class="text-right">

                  <!--cancelar-->
                  <v-btn @click="cancelaCadastroNewEvento" class="mr-5 warning">Cancelar</v-btn>

                  <!--salvar-->
                  <v-btn class="success" type="submit">Salvar</v-btn>

                </v-col>

              </v-row>

            </v-form>

          </v-alert>

          <!-- Eventos cadastrados-->
          <v-alert color="rgb(255,255,255,0.5)"
                   v-if="mostraTabelaCadastrados &&totemConfigs.tipo_totem !== 'normal' ">

            <v-row>
              <v-col><h3>Eventos Cadastrados</h3></v-col>
              <!--add evento-->
              <v-col align-self="center" class="text-right">
                <v-btn small @click="abreCadastroNewEvento"
                       v-if="totemConfigs.tipo_totem !== 'normal' && !mostraCadastroEventos">Adicionar Evento
                </v-btn>
              </v-col>
            </v-row>

            <!--DataTable-->
            <v-data-table
              :headers="headersEventos"
              :items="eventos"
              :search="searchEventos"
              class="elevation-21 mt-4"
              sort-by="ano"
            >
              <template v-slot:top>
                <v-toolbar
                  flat
                >
                  <v-toolbar-title>Tabela de Eventos Cadastrados</v-toolbar-title>

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
                    v-model="searchEventos"
                  ></v-text-field>

                </v-toolbar>

              </template>

              <!--Template de datas -->
              <template v-slot:item.ano="{ item }">

                <span v-if="item.dia"> {{ item.dia }} / </span> <span v-if="item.mes">  {{ item.mes }} / </span>

                <span v-if="item.ano">  {{ item.ano }} </span>

              </template>

              <!--Template de legendas -->
              <template v-slot:item.legenda="{ item }">

                <span class="text-no-wrap warning" v-if="item.legenda === '' || item.legenda === null"> ---- SEM LEGENDA ----</span>
                <span
                  v-else class="text-justify">{{ item.legenda }}</span>

                <span class="text-no-wrap warning" v-if="item.saibamais === '' || item.saibamais === null"><br> ---- SEM SAIBA MAIS ----</span>
                <span
                  v-else class="text-justify"><br>{{ item.saibamais }}</span>

              </template>

              <!--Template de imagens -->
              <template v-slot:item.imagem="{ item }">

                <span class="text-no-wrap warning" v-if="item.imagem === null"> ---- SEM IMAGEM ----</span> <span
                v-else><v-icon @click="showImg(item)">mdi-magnify</v-icon></span>

              </template>

              <!--Template de botões para editar, excluir -->
              <template v-slot:item.actions="{ item }">

                <!--editar-->
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="editEvento(item)"
                      class="mr-2"
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-pen
                    </v-icon>
                  </template>
                  <span>Editar Evento</span>
                </v-tooltip>

                <!--Excluir-->
                <v-tooltip top>
                  <template v-slot:activator="{ on, attrs }">
                    <v-icon
                      @click="deleteEvento(item)"
                      class="mr-2"
                      small
                      v-bind="attrs"
                      v-on="on"
                    >
                      mdi-delete
                    </v-icon>
                  </template>
                  <span>Excluir evento</span>
                </v-tooltip>

              </template>

            </v-data-table>

          </v-alert>

        </v-container>
      </v-card-text>
    </v-card>

    <!--Dialog para administrar assunto-->
    <v-dialog max-width="70%" v-model="dialogAdmAssunto">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-row>
            <v-col cols="10">
              Administração de Assuntos
            </v-col>
            <v-col cols="2">
              <v-btn @click="openDialogAddAssunto">Adicionar Assunto</v-btn>
            </v-col>
          </v-row>
        </v-card-title>

        <v-card-text>

          <v-container class="pt-5" fluid>

            <!--select de assuntos e btn Edit-->
            <v-row>

              <v-col>
                <v-data-table
                  :headers="headersAssuntos"
                  :items="assuntoSelect"
                  :search="searchAssuntos"
                  class="elevation-21 mt-4"
                  sort-by="ordem_exibicao"
                >
                  <template v-slot:top>
                    <v-toolbar
                      flat
                    >
                      <v-toolbar-title>Tabela de Assuntos Cadastrados</v-toolbar-title>

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
                        v-model="searchAssuntos"
                      ></v-text-field>

                      <!--Dialog para deletar assunto-->
                      <v-dialog max-width="800px" v-model="dialogDeleteAssunto">
                        <v-card>
                          <v-card-title class="justify-center" primary-title>
                            <v-icon
                              class="mr-4">
                              fa fa-exclamation-triangle
                            </v-icon>
                            Você tem certeza que quer deletar esse assunto?
                            <v-icon
                              class="ml-4">
                              fa fa-exclamation-triangle
                            </v-icon>

                          </v-card-title>
                          <v-card-text>
                            <div class="text-center">Essa ação é irreversível. <br>
                              Todas as imagens vinculadas a esse assunto também serão removidas.<br>
                              Tenha certeza do que está fazendo.
                            </div>
                          </v-card-text>
                          <v-card-actions class="pb-5">
                            <v-spacer></v-spacer>
                            <v-btn @click="dialogDeleteAssunto = false" color="grey lighten-1">Cancelar</v-btn>
                            <span class="pl-5 pr-5"></span>
                            <v-btn @click="deleteAssuntoConfirm" color="red lighten-1">Excluir</v-btn>
                            <v-spacer></v-spacer>
                          </v-card-actions>
                        </v-card>
                      </v-dialog>

                      <!--Dialog para editar assunto-->
                      <v-dialog max-width="800px" v-model="dialogEditAssunto">
                        <v-card>
                          <v-form @submit.prevent="editAssuntoConfirm">
                            <v-card-title class="justify-center" primary-title>
                              Editar Assunto
                            </v-card-title>
                            <v-card-text>

                              <!--nome assunto-->
                              <v-row no-gutters>
                                <v-col>
                                  <span class="pl-3">Nome</span>
                                  <v-text-field
                                    class="ml-3"
                                    dense
                                    label="Nome Assunto"
                                    rounded
                                    solo
                                    v-model="nomeEditAssunto"
                                  ></v-text-field>
                                </v-col>
                              </v-row>

                              <!--ordem exibição-->
                              <v-row no-gutters>
                                <v-col>
                                  <span class="pl-3">Ordem de Exibição</span>
                                  <v-text-field
                                    class="ml-3"
                                    dense
                                    label="Ordem de Exibição"
                                    min="1"
                                    rounded
                                    solo
                                    type="number"
                                    v-model="ordemEditAssunto"
                                  ></v-text-field>
                                </v-col>
                              </v-row>

                            </v-card-text>
                            <v-card-actions class="pb-5">
                              <v-spacer></v-spacer>
                              <v-btn @click="dialogEditAssunto = false" color="warning lighten-1">Cancelar</v-btn>
                              <span class="pl-5 pr-5"></span>
                              <v-btn color="success" type="submit">Editar</v-btn>
                              <v-spacer></v-spacer>
                            </v-card-actions>

                          </v-form>
                        </v-card>

                      </v-dialog>

                    </v-toolbar>

                  </template>

                  <!--Template de botões para editar, excluir ASSUNTO -->
                  <template v-slot:item.actions="{ item }">

                    <!--editar -->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          @click="editAssunto(item)"
                          class="mr-2"
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-pen
                        </v-icon>
                      </template>
                      <span>Editar Assunto</span>
                    </v-tooltip>

                    <!--Excluir-->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          @click="deleteAssunto(item)"
                          class="mr-2"
                          small
                          v-bind="attrs"
                          v-on="on"
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      <span>Excluir Assunto</span>
                    </v-tooltip>

                  </template>

                </v-data-table>
              </v-col>

            </v-row>

          </v-container>

        </v-card-text>

        <!--Fechar janela adm Assunto-->
        <v-card-actions class="pb-5 mr-5">
          <v-spacer></v-spacer>
          <v-btn
            @click="dialogAdmAssunto=false"
            color="error"
            elevation="2">Fechar
          </v-btn>
        </v-card-actions>

      </v-card>
    </v-dialog>

    <!--Dialog para add assunto-->
    <v-dialog max-width="800px" v-model="dialogAddAssunto">
      <v-card>
        <v-form @submit.prevent="efetuarCadastroAssunto">
          <v-card-title class="justify-center" primary-title>
            Adicionar novo assunto
          </v-card-title>
          <v-card-text>

            <!--nome assunto-->
            <v-row no-gutters>
              <v-col>
                <span class="pl-3">Nome</span>
                <v-text-field
                  class="ml-3"
                  dense
                  label="Nome Assunto"
                  rounded
                  solo
                  v-model="nomeNewAssunto"
                ></v-text-field>
              </v-col>
            </v-row>

            <!--ordem exibição-->
            <v-row no-gutters>
              <v-col>
                <span class="pl-3">Ordem de Exibição</span>
                <v-text-field
                  class="ml-3"
                  dense
                  label="Ordem de Exibição"
                  min="1"
                  rounded
                  solo
                  type="number"
                  v-model="ordemNewAssunto"
                ></v-text-field>
              </v-col>
            </v-row>

          </v-card-text>
          <v-card-actions class="pb-5">
            <v-spacer></v-spacer>
            <v-btn @click="dialogAddAssunto = false" color="warning lighten-1">Cancelar</v-btn>
            <span class="pl-5 pr-5"></span>
            <v-btn color="success" type="submit">Cadastrar</v-btn>
            <v-spacer></v-spacer>
          </v-card-actions>

        </v-form>
      </v-card>

    </v-dialog>

    <!--Dialog para add imagem-->
    <v-dialog max-width="80%" v-model="dialogAddImagem">

      <!--Card de cadastro edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-area
          </v-icon>
          <span class="headline">
                       Adicionar Imagem</span>

        </v-card-title>

        <v-card-text>

          <v-container>

            <v-form @submit.prevent="saveImage">

              <!--nome e imagem-->
              <v-row dense>

                <!--nome-->
                <v-col>
                  <span class="ml-3">Nome da Imagem</span>
                  <v-text-field
                    dense
                    hint="Por exemplo: Conquista de Monte Castelo (caso não coloque o nome, não aparecerá nada no Título da Imagem"
                    label="Nome da Imagem"
                    name="nome"
                    persistent-hint
                    placeholder="Insira um nome de referência"
                    required
                    rounded
                    solo
                    v-model="nomeNewImage">

                  </v-text-field>

                </v-col>

                <!--imagem-->
                <v-col>
                  <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                  <v-file-input @change="selectImage"
                                accept="image/*"
                                dense
                                hint="Escolha uma imagem no formato .png ou .jpg"
                                label="Escolha uma imagem"
                                persistent-hint
                                placeholder="Insira uma imagem"
                                rounded
                                show-size
                                solo
                                v-model="inputImagem"
                  ></v-file-input>

                </v-col>

              </v-row>

              <!--ordem de exibicao e é banner-->
              <v-row dense>

                <!--ordem Exibicao-->
                <v-col>
                  <span class="ml-3">Ordem de Exibição</span>
                  <v-text-field
                    class="mr-3"
                    dense
                    hint="Ordem em que a imagem será exibida na paginação. Caso não coloque nada, o sistema irá entender que essa imagem deverá ser adicionada no final da lista."
                    label="Ordem de exibição"
                    min="1"
                    persistent-hint
                    rounded
                    solo
                    type="number"
                    v-model="imagemNewOrdem"
                  ></v-text-field>

                </v-col>

                <!--é banner?-->
                <v-col>

                  <v-checkbox
                    class="pl-3 pt-3"
                    hint="Se marcada, essa imagem será usada como referência do assunto na tela de navegação principal. Ao marcar a imagem como banner, caso haja mais de uma marcada, apenas a última será considerada para fins de exibição. Caso nenhuma seja marcada, a primeira imagem cadastrada será o banner"
                    label="É Banner"
                    persistent-hint
                    v-model="isImgNewBanner"
                  ></v-checkbox>

                </v-col>

              </v-row>

              <!--legenda e preview-->
              <v-row>

                <!--Legenda-->
                <v-col>
                  <v-textarea
                    auto-grow
                    class="mb-0 pb-0 mt-3"
                    hint="Se deixado em branco, a imagem não mostrará nenhum texto como legenda."
                    label="Legenda da Imagem"
                    no-resize
                    persistent-hint
                    rounded
                    rows="5"
                    solo
                    v-model="legendaNewImg"
                  ></v-textarea>
                </v-col>

                <!--preview-->
                <v-col>
                  <v-alert elevation="10" rounded="xl" v-if="previewImage">
                    <h3>Preview:</h3>
                    <img :src="previewImage" alt="" class="v-responsive my-3 ml-auto mr-auto rounded-xl"/>
                  </v-alert>

                </v-col>

              </v-row>

              <!--saibamais-->
              <v-row>
                <v-col>
                  <v-textarea
                    auto-grow
                    class="mb-0 pb-0 mt-3"
                    hint="Se deixado em branco, a imagem não mostrará nenhum saiba mais."
                    label="Saiba Mais"
                    no-resize
                    persistent-hint
                    rounded
                    rows="5"
                    solo
                    v-model="saibaMaisNewImg"
                  ></v-textarea>
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
                    @click="dialogAddImagem = false"
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

    <!--Dialog para deletar imagem-->
    <v-dialog max-width="800px" v-model="dialogDeleteImagem">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar a imagem?
          <v-icon
            class="ml-4">
            fa fa-exclamation-triangle
          </v-icon>

        </v-card-title>
        <v-card-text>
          <div class="text-center">
            Essa ação é irreversível. Tenha certeza do que está fazendo.<br>
            A Legenda será excluída, e a ordem de exibição de todas as demais imagens será reajustada.
          </div>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogDeleteImagem = false" color="grey lighten-1">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn @click="deleteImagemConfirm" color="red lighten-1">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para editar imagem-->
    <v-dialog max-width="80%" v-model="dialogEditImagem">

      <!--Card de edição-->
      <v-card>

        <!--title-->
        <v-card-title>

          <v-icon class="mr-4">
            mdi-image-edit
          </v-icon>
          <span class="headline">
                       Editar Imagem</span>

        </v-card-title>

        <v-card-text>

          <v-container>

            <v-form @submit.prevent="saveEditImage">

              <!--nome e eBanner-->
              <v-row dense>

                <!--nome-->
                <v-col>
                  <span class="ml-3">Nome da Imagem</span>
                  <v-text-field
                    dense
                    hint="Por exemplo: Conquista de Monte Castelo (caso não coloque o nome, não aparecerá nada no Título da Imagem"
                    label="Nome da Imagem"
                    name="nome"
                    persistent-hint
                    placeholder="Insira um nome de referência"
                    required
                    rounded
                    solo
                    v-model="nomeEditImage">

                  </v-text-field>

                </v-col>

                <!--é banner?-->
                <v-col>

                  <v-checkbox
                    class="pl-3 pt-3"
                    hint="Se marcada, essa imagem será usada como referência do assunto na tela de navegação principal. Ao marcar a imagem como banner, caso haja mais de uma marcada, apenas a última será considerada para fins de exibição. Caso nenhuma seja marcada, a primeira imagem cadastrada será o banner"
                    label="É Banner"
                    persistent-hint
                    v-model="isImgEditBanner"
                  ></v-checkbox>

                </v-col>

              </v-row>

              <!--Assunto, ordem de exibicao, btn alterar image -->
              <v-row dense>

                <!--select de assunto-->
                <v-col cols="6">
                  <span class="ml-3">Assunto</span>
                  <v-autocomplete
                    :items="assuntoSelect"
                    clearable
                    dense
                    item-text="nome_assunto"
                    item-value="id"
                    label="Selecione o Assunto"
                    name="nome_assunto"
                    rounded
                    solo
                    v-model="myAssuntoEdit"
                  ></v-autocomplete>
                </v-col>

                <!--ordem Exibicao e btn edita imagem-->
                <v-col>
                  <span class="ml-3">Ordem de Exibição</span>
                  <v-text-field
                    class="ml-3"
                    dense
                    hint="Ordem em que a imagem será exibida na paginação. Caso não coloque nada, o sistema irá entender que essa imagem deverá ser adicionada no final da lista."
                    label="Ordem de exibição"
                    min="1"
                    persistent-hint
                    rounded
                    solo
                    type="number"
                    v-model="imagemEditOrdem"
                  ></v-text-field>

                </v-col>

                <!--btn edita imagem-->
                <v-col class="text-right">
                  <v-btn @click="toggleEditImagem" class="mt-6 warning" rounded> {{ textoBtnAlteraCancela }}</v-btn>
                </v-col>

              </v-row>

              <!--legenda e preview-->
              <v-row>

                <!--Legenda e saiba mais-->
                <v-col>

                  <!--legenda-->
                  <span class="ml-3">Legenda</span>
                  <v-textarea
                    auto-grow
                    class="mb-0 pb-0"
                    hint="Se deixado em branco, a imagem não mostrará nenhum texto como legenda."
                    label="Legenda da Imagem"
                    no-resize
                    persistent-hint
                    rounded
                    rows="5"
                    solo
                    v-model="legendaEditImg"
                  ></v-textarea>

                  <br>

                  <!-- saiba mais-->
                  <span class="ml-3">Saiba Mais</span>
                  <v-textarea
                    auto-grow
                    class="mb-0 pb-0"
                    hint="Se deixado em branco, a imagem não mostrará nenhum Saiba Mais."
                    label="Saiba Mais"
                    no-resize
                    persistent-hint
                    rounded
                    rows="5"
                    solo
                    v-model="saibaMaisEditImg"
                  ></v-textarea>

                </v-col>

                <!--preview-->
                <v-col>

                  <!--se input imagem-->
                  <v-row v-if="showHideEditInputImage">
                    <!--imagem-->
                    <v-col>
                      <span class="ml-3">Imagem * (Campo Obrigatório)</span>
                      <v-file-input @change="selectEditImage"
                                    accept="image/*"
                                    dense
                                    hint="Escolha uma nova imagem no formato .png ou .jpg (a anterior será excluída)"
                                    label="Escolha uma imagem"
                                    persistent-hint
                                    placeholder="Insira uma imagem"
                                    rounded
                                    show-size
                                    solo
                                    v-model="inputEditImagem"

                      ></v-file-input>

                      <v-alert border="left" type="warning" v-if="!previewEditImage">Para finalizar a alteração da
                        imagem, após a escolha da
                        nova, é
                        necessário revisar os campos do formulário e apertar no botão "Salvar".<br>Isso destruirá a foto
                        anterior.
                      </v-alert>

                    </v-col>
                  </v-row>

                  <!--preview Img-->
                  <v-alert elevation="10" rounded="xl" v-if="previewEditImage">
                    <h3>Preview:</h3>
                    <img :src="previewEditImage" alt="" class="v-responsive my-3 ml-auto mr-auto rounded-xl"/>
                  </v-alert>

                  <!--mostra imagem atual-->
                  <v-row v-if="!showHideEditInputImage">
                    <v-col>
                      <v-img :src="this.$configSis.urlDownload + imagemAtual.imagem"
                             class="rounded-xl v-responsive ml-auto mr-auto" width="600px"/>
                    </v-col>
                  </v-row>

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
                    @click="dialogEditImagem = false"
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

    <!--Dialog para mostrar a imagem de um evento-->
    <v-dialog max-width="70%" v-model="dialogShowImagemEvento">
      <v-card>
        <v-card-title>
          Visualização de Imagem
        </v-card-title>
        <v-card-text>
          <v-img :src="this.$configSis.urlDownload + imgEventoShow"
                 class="rounded-xl v-responsive ml-auto mr-auto"/>

          <v-alert color="grey lighten-2" class="mt-2">

            <span v-if="imgEventoFonteShow !== null || imgEventoFonteShow !== ''">{{ imgEventoFonteShow }}</span>
            <span v-if="imgEventoFonteShow === null || imgEventoFonteShow === ''"> Sem Fonte</span>

          </v-alert>
        </v-card-text>
        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn @click="dialogShowImagemEvento = false" color="grey lighten-1">Fechar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para deletar evento-->
    <v-dialog max-width="800px" v-model="dialogDeleteEvento">
      <v-card>
        <v-card-title class="justify-center" primary-title>
          <v-icon
            class="mr-4">
            fa fa-exclamation-triangle
          </v-icon>
          Você tem certeza que quer deletar esse evento?
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
          <v-btn @click="dialogDeleteEvento= false" color="grey lighten-1">Cancelar</v-btn>
          <span class="pl-5 pr-5"></span>
          <v-btn @click="deleteEventoConfirm" color="red lighten-1">Excluir</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!--Dialog para editar evento-->
    <v-dialog max-width="80%" v-model="dialogEditEvento">
      <v-form @submit.prevent="editEventoConfirm">
        <v-card>
          <v-card-title class="justify-center" primary-title>

            Edição de evento

          </v-card-title>
          <v-card-text>

            <!--data e título do evento-->
            <v-row>

              <!--data do evento-->
              <v-col>
                <span class="pl-3">Insira a data do evento</span>

                <!--dia mes e ano-->
                <v-row>

                  <!--dia-->
                  <v-col>
                    <span class="pl-3">Dia</span>

                    <v-autocomplete
                      :items="optionsDia"
                      class="ml-3"
                      clearable
                      dense
                      hint="Insira o dia do evento (de 1 a 31) caso deixe em branco o evento não se restringe a um dia"
                      label="Dia"
                      persistent-hint
                      rounded
                      solo
                      v-model="selectedEvento.dia"
                    ></v-autocomplete>

                  </v-col>

                  <!--mes-->
                  <v-col>
                    <span class="pl-3">Mês</span>

                    <v-autocomplete
                      :items="optionsMes"
                      class="ml-3"
                      clearable
                      dense
                      hint="Insira o mês do evento (de 1 a 12) caso deixe em branco o evento não se restringe a um mês"
                      label="Mês"
                      persistent-hint
                      rounded
                      solo
                      v-model="selectedEvento.mes"
                    ></v-autocomplete>
                  </v-col>

                  <!--ano-->
                  <v-col>
                    <span class="pl-3">Ano</span>
                    <v-text-field
                      :maxlength="4"
                      @input="limitInput('edit')"
                      class="ml-3"
                      dense
                      hint="Insira o ano do evento ( 4 dígitos ) * obrigatório"
                      label="Ano"
                      max="9999"
                      min="1"
                      persistent-hint
                      rounded
                      solo
                      type="text"
                      v-model="selectedEvento.ano"
                    ></v-text-field>
                  </v-col>

                </v-row>

              </v-col>

              <!--titulo evento-->
              <v-col>
                <span class="pl-3">Título do evento</span>

                <v-text-field
                  class="ml-3"
                  dense
                  hint="Exemplo: Batalha dos Guararapes"
                  label="Título do Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="selectedEvento.nome"
                ></v-text-field>

              </v-col>

            </v-row>

            <!--legenda e imagem-->
            <v-row>

              <!--legenda-->
              <v-col cols="6">
                <v-textarea
                  auto-grow
                  class="mb-0 pb-0 mt-3"
                  hint="Se deixado em branco, a não será mostrado nenhum texto como legenda."
                  label="Legenda do Evento"
                  no-resize
                  persistent-hint
                  rounded
                  rows="5"
                  solo
                  v-model="selectedEvento.legenda"
                ></v-textarea>
              </v-col>

              <!--imagem-->
              <v-col cols="6" v-if="selectedEvento.imagem === null">

                <!--selecionar imagem-->
                <v-row>
                  <v-col>
                    <span class="ml-3">Imagem</span>
                    <v-file-input @change="selectImageEvento"
                                  accept="image/*"
                                  dense
                                  hint="Escolha uma imagem no formato .png ou .jpg"
                                  label="Escolha uma imagem (SFC)"
                                  persistent-hint
                                  placeholder="Insira uma imagem se for o caso"
                                  rounded
                                  show-size
                                  solo
                                  v-model="inputImagemEvento"
                    ></v-file-input>

                  </v-col>
                </v-row>

                <!--preview-->
                <v-row v-if="previewImageEvento">
                  <v-col>
                    <!--preview-->
                    <v-alert elevation="10" rounded="xl">
                      <h3>Preview:</h3>
                      <img :src="previewImageEvento" class="v-responsive my-3 rounded-xl"/>
                    </v-alert>
                  </v-col>

                </v-row>
                <!-- Fonte da imagem-->
                <v-row>
                  <v-col>
                    <span class="pl-3">Fonte da imagem</span>

                    <v-text-field
                      class="ml-3"
                      dense
                      hint="Exemplo: https://eb.mil.br/artigo233"
                      label="Fonte da imagem"
                      persistent-hint
                      rounded
                      solo
                      v-model="selectedEvento.fonteimagempcp"
                    ></v-text-field>
                  </v-col>
                </v-row>

                <!--btn cnacela altera img-->
                <v-row>
                  <v-col class="text-right" v-if="momentoEditImg">
                    <v-btn @click="retomaImgAntiga"> Cancelar Alteração de Imagem</v-btn>
                  </v-col>
                </v-row>

              </v-col>

              <!--botoes editar e excluir-->
              <v-col class="text-right" cols="6" v-else>
                <v-img :src="this.$configSis.urlDownload + selectedEvento.imagem"
                       class="rounded-xl v-responsive"/>

                <v-row class="ajusteBtn">
                  <v-col>
                    <!--editar-->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="editExistentImageEvento()" class="warning">
                          <v-icon
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-pen
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Editar Imagem</span>
                    </v-tooltip>

                    <!--excluir-->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="excluiImgEditEvento()" class=" error mr-10">
                          <v-icon
                            small
                            v-bind="attrs"
                            v-on="on"
                          >
                            mdi-delete
                          </v-icon>
                        </v-btn>
                      </template>
                      <span>Excluir Imagem</span>
                    </v-tooltip>
                  </v-col>
                </v-row>

                <!-- Fonte da imagem-->
                <v-row>
                  <v-col>
                    <span class="pl-3">Fonte da imagem</span>

                    <v-text-field
                      class="ml-3"
                      dense
                      hint="Exemplo: https://eb.mil.br/artigo233"
                      label="Fonte da imagem"
                      persistent-hint
                      rounded
                      solo
                      v-model="selectedEvento.fonteimagempcp"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

            </v-row>

            <!-- saiba mais-->
            <v-row>
              <v-col>
                <v-textarea
                  auto-grow
                  class="mb-0 pb-0 mt-3"
                  hint="Se deixado em branco, a não será mostrado nenhum saiba mais."
                  label="Saiba Mais"
                  no-resize
                  persistent-hint
                  rounded
                  rows="5"
                  solo
                  v-model="selectedEvento.saibamais"
                ></v-textarea>
              </v-col>
            </v-row>

            <!-- imagens adicionais -->
            <v-row>
              <v-col>
                <v-alert rounded="xl" color="red lighten-4">
                  <!--titulo e btn add imagens-->
                  <v-row>
                    <v-col cols="10"><h3>Imagens Adicionais</h3></v-col>
                    <v-col cols="2" class="text-right">
                      <v-btn class="primary" small
                             @click="openDialogAddImgAdicionalEvento">
                        Adicionar Imagem
                      </v-btn>
                    </v-col>
                  </v-row>

                  <v-row v-if="selectedEvento.imagens_adicionais && selectedEvento.imagens_adicionais.length > 0">
                    <v-col>
                      <v-alert :key="imgadicional.id" v-for="imgadicional in selectedEvento.imagens_adicionais">
                        <v-row>
                          <v-col>
                            <v-img :src="configSis.urlDownload + '/' +  imgadicional.imagem"
                                   class="rounded-xl" aspect-ratio="1.5"/>
                          </v-col>
                          <v-col><strong>Fonte: </strong>{{ imgadicional.fonte }}</v-col>
                          <v-col><strong>Descrição: </strong>{{ imgadicional.descricao }}</v-col>
                          <v-col class="text-right">
                            <v-btn @click="openDeleteImagem(imgadicional)" color="error">
                              <v-icon class="pr-3">mdi-delete</v-icon>
                              Excluir Imagem
                            </v-btn>
                          </v-col>
                        </v-row>
                      </v-alert>
                    </v-col>
                  </v-row>

                </v-alert>
              </v-col>
            </v-row>

          </v-card-text>

          <!--Btn cancela e altera-->
          <v-card-actions class="pb-5">
            <v-row>
              <v-col class="text-right">
                <v-btn @click="dialogEditEvento= false" color="warning lighten-1">Cancelar</v-btn>
                <span class="pr-5"></span>
                <v-btn @click="editEventoConfirm" class="mr-5" color="primary lighten-1">Alterar</v-btn>
              </v-col>
            </v-row>
          </v-card-actions>

        </v-card>

      </v-form>

    </v-dialog>

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

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {VueEditor, Quill},
  data: vm => ({
    content: '',
    configSis: config,
    dialogUser: false,
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
    },

    dialogAddImagem (val) {
      if (this.editedIndex === -1) {
        this.currentImage = undefined
        this.previewImage = undefined
        this.inputImagem = undefined
      }
      val || this.closeAddImge()
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

    openDialogAdmAssunto () {
      this.dialogAdmAssunto = true
    },

    deleteAssunto (item) {
      this.editedAssuntoIndex = this.assuntoSelect.indexOf(item)
      this.editedAssunto = Object.assign({}, item)
      this.dialogDeleteAssunto = true
    },

    deleteAssuntoConfirm () {
      this.$http.delete('assunto/' + this.editedAssunto.id)
        .then(() => {
          this.getConfigs()
          this.closeDeleteAssunto()
          this.$toastr.s(
            'Assunto removido com sucesso', 'Sucesso!'
          )
        }, err => {
          console.log(err)
          this.$toastr.e(
            'Não foi possível remover o Assunto', 'Erro!'
          )
        })
    },

    efetuarCadastroAssunto () {
      if (this.nome_assunto === '') {
        this.$toastr.e(
          'Não foi possível realizar o cadastro! Todos os capos devem ser preenchidos.', 'Erro!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome_assunto'] = this.nomeNewAssunto
        objetoParaEnvio['ordem_exibicao'] = this.ordemNewAssunto

        try {
          this.$http.post('assunto', objetoParaEnvio)
            .then(() => {
              this.getConfigs()
              this.dialogAddAssunto = false
            })
            .catch(erro => console.log(erro))
        } catch (e) {
          console.log(e)
        }
      }
    },

    openDialogAddAssunto () {
      this.nomeNewAssunto = ''
      this.ordemNewAssunto = ''
      this.dialogAddAssunto = true
    },

    editAssuntoConfirm () {
      if (this.nomeEditAssunto === '' || this.nomeEditAssunto === null) {
        this.$toastr.e(
          'Não foi possível alterar o Assunto.', 'Verifique novamente os campos!'
        )
      } else {
        let objetoParaEnvio = {}
        objetoParaEnvio['nome_assunto'] = this.nomeEditAssunto
        objetoParaEnvio['ordem_exibicao'] = this.ordemEditAssunto

        this.$http.put('assunto/' + this.editedAssunto.id, objetoParaEnvio)
          .then(() => {
            this.getConfigs()
            this.$toastr.s(
              'Assunto alterado com sucesso', 'Sucesso!'
            )
            this.dialogEditAssunto = false
          }, err => {
            console.log(err)
            this.$toastr.e(
              'Não foi possível alterar o Assunto.', 'Erro!'
            )
          })
      }
    },

    openDialogAddImg () {
      this.dialogAddImagem = true
      this.abrePreviewEdit = false
      this.currentImage = undefined
      this.previewImage = undefined
      this.inputImagem = undefined
      this.legendaImg = ''
      this.nomeNewImage = ''
      this.imagemNewOrdem = ''
      this.isImgNewBanner = false
      this.legendaNewImg = ''
      this.saibaMaisNewImg = ''
    },

    openDialogEditImg () {
      this.dialogEditImagem = true
      this.abrePreviewEdit = false
      this.currentEditImage = undefined
      this.previewEditImage = undefined
      this.inputEditImagem = undefined
      this.showHideEditInputImage = false
      this.textoBtnAlteraCancela = 'Alterar a Imagem Atual'

      this.nomeEditImage = this.imagemAtual.nome
      this.imagemEditOrdem = this.imagemAtual.ordem

      this.isImgEditBanner = this.imagemAtual.banner
      this.legendaEditImg = this.imagemAtual.legenda
      this.myAssuntoEdit = this.imagemAtual.assunto_id
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
