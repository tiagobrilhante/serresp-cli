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
                        mdi-calendar-month-outline
                      </v-icon>
                      Administração de Eventos
                    </h2>
                  </v-col>

                  <v-col align-self="center" class="text-right">
                    <v-btn small @click="abreCadastroNewEvento">Adicionar Evento
                    </v-btn>
                  </v-col>

                </v-row>

              </v-alert>

              <!--DataTable-->
              <v-data-table
                dense
                :headers="headersEventos"
                :items="eventos"
                :search="searchEventos"
                class="elevation-12 mt-4 mb-4"
                sort-by="ano"
                sort-desc
                elevation="12"
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

                  <span v-if="item.dia">{{ item.dia }}/</span><span v-if="item.mes">{{ item.mes }}/</span><span
                  v-if="item.ano">{{ item.ano }}</span>

                </template>

                <!--Template de legendas -->
                <template v-slot:item.legenda="{ item }">

                  <span class="text-no-wrap warning" v-if="item.legenda === '' || item.legenda === null"> ---- SEM LEGENDA ----</span>
                  <span v-html="item.legenda"
                        v-else class="text-justify"></span>

                  <span class="text-no-wrap warning" v-if="item.saibamais === '' || item.saibamais === null"><br> ---- SEM SAIBA MAIS ----</span>
                  <span v-html="'<hr> SAIBA MAIS: <br>' + item.saibamais"
                        v-else class="text-justify"></span>

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
                        class=""
                        small
                        v-bind="attrs"
                        v-on="on"
                      >mdi-pen
                      </v-icon>
                    </template>
                    <span>Editar Evento</span>
                  </v-tooltip>
                  <!--Excluir-->
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-icon
                        @click="deleteEvento(item)"
                        class=""
                        small
                        v-bind="attrs"
                        v-on="on"
                      >mdi-delete
                      </v-icon>
                    </template>
                    <span>Excluir evento</span>
                  </v-tooltip>

                </template>

              </v-data-table>

            </v-col>
          </v-row>
        </v-container>
      </v-card-text>
    </v-card>

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

    <!--Dialog para cadastrar um evento-->
    <v-dialog max-width="80%" v-model="dialogCadastraEvento">
      <v-card>
        <v-card-title>
          Cadastro de Eventos
        </v-card-title>
        <v-card-text>
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
                  hint="Exemplo: Campanha de doação de sangue"
                  label="Título do Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="tituloNewEvento"
                ></v-text-field>

              </v-col>

            </v-row>

            <!-- tipo evento, destaque e ordem de exibição -->
            <v-row no-gutters>

              <!--tipo de evento-->
              <v-col>

                <span class="pl-3">Tipo de Evento (Categoria)</span>

                <v-autocomplete
                  :items="tipoEventos"
                  class="ml-3 mr-3"
                  dense
                  item-text="tipo"
                  item-value="id"
                  hint="Selecione o tipo de evento"
                  label="Tipo de Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="tipoNewEvento"
                ></v-autocomplete>
              </v-col>

              <!--destaque e ordem de exibição-->
              <v-col>
                <v-row no-gutters>
                  <v-col cols="3">
                    <v-checkbox
                      class="ml-3"
                      v-model="destaqueNewEvento"
                      label="Destacar"
                    ></v-checkbox>
                  </v-col>
                  <v-col v-if="destaqueNewEvento">
                    <span class="pl-3">Ordem de exibição nos destaques</span>
                    <v-text-field
                      :maxlength="4"
                      @input="limitInput('add')"
                      class="ml-3"
                      dense
                      hint="Insira a ordem de exibição( 1-9999 ) * obrigatório"
                      label="ordem de exibição"
                      max="9999"
                      min="1"
                      persistent-hint
                      rounded
                      solo
                      type="text"
                      v-model="ordemNewExibicao"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

            </v-row>

            <!--legenda e imagem-->
            <v-row>

              <!--legenda-->
              <v-col>

                <span class="pl-3">Legenda do Evento (explicação sumária da atividade)</span>
                <v-alert elevation="12" class="rounded-xxl">
                  <vue-editor v-model="legendaNewEvento"></vue-editor>
                  <span class="text-sm-caption">Caso seja deixado em branco, não será exibida nenhuma informação sobre o evento</span>
                </v-alert>

                <v-alert color="warning">
                  <p>Você pode cadastrar imagens adicionais para um evento, no entanto, é necessário que o evento
                    seja criado primeiro, em seguida acesse a opção de editar evento para realizar a adição de
                    outras imagens. (na tabela de eventos cadastrados)</p>
                  <p>A imagem principal, é aquela que aparecerá no card de abertura do evento.</p>

                </v-alert>
              </v-col>

              <!--imagem-->
              <v-col>

                <span class="ml-3">Imagem principal (será exibida no card inicial)</span>
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

                  <span class="pl-3">Fonte da imagem (se for o caso)</span>

                  <v-text-field
                    class="ml-3"
                    dense
                    hint="Exemplo: https://www.uninorte.com.br/artigo233"
                    label="Fonte da imagem"
                    persistent-hint
                    rounded
                    solo
                    v-model="fonteImagemPcpNewEvento"
                  ></v-text-field>

                </v-alert>

              </v-col>
            </v-row>

            <!--saiba mais-->
            <v-row>
              <v-col>

                <span
                  class="pl-3">Saiba mais (oculta o texto da legenda do evento e adiciona conteúdo relevante.)</span>
                <v-alert elevation="12" class="rounded-xxl">
                  <vue-editor v-model="saibaMaisNewEvento"></vue-editor>
                  <span
                    class="text-sm-caption">Caso seja deixado em branco, não será mostrado nada em "Saiba Mais"</span>
                </v-alert>

              </v-col>
            </v-row>

            <!--btn action salvar cancelar-->
            <v-row>
              <v-col class="text-right">

                <!--cancelar-->
                <v-btn @click="dialogCadastraEvento = false" class="mr-5 warning">Cancelar</v-btn>

                <!--salvar-->
                <v-btn class="success" type="submit">Salvar</v-btn>

              </v-col>

            </v-row>

          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!--Dialog para editar um evento-->
    <v-dialog max-width="80%" v-model="dialogEditaEvento" persistent>
      <v-card>
        <v-card-title>
          Cadastro de Eventos
        </v-card-title>
        <v-card-text>
          <v-form @submit.prevent="editEventoConfirm">

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
                  hint="Exemplo: Campanha de doação de sangue"
                  label="Título do Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="selectedEvento.nome"
                ></v-text-field>

              </v-col>

            </v-row>

            <!-- tipo evento, destaque e ordem de exibição -->
            <v-row no-gutters>

              <!--tipo de evento-->
              <v-col>

                <span class="pl-3">Tipo de Evento (Categoria)</span>

                <v-autocomplete
                  :items="tipoEventos"
                  class="ml-3 mr-3"
                  dense
                  item-text="tipo"
                  item-value="id"
                  hint="Selecione o tipo de evento"
                  label="Tipo de Evento"
                  persistent-hint
                  rounded
                  solo
                  v-model="selectedEvento.tipo_evento_id"
                ></v-autocomplete>
              </v-col>

              <!--destaque e ordem de exibição-->
              <v-col>
                <v-row no-gutters>
                  <v-col cols="3">
                    <v-checkbox
                      class="ml-3"
                      v-model="selectedEvento.destaque"
                      label="Destacar"
                    ></v-checkbox>
                  </v-col>
                  <v-col v-if="selectedEvento.destaque">
                    <span class="pl-3">Ordem de exibição nos destaques</span>
                    <v-text-field
                      :maxlength="4"
                      @input="limitInput('add')"
                      class="ml-3"
                      dense
                      hint="Insira a ordem de exibição( 1-9999 ) * obrigatório"
                      label="ordem de exibição"
                      max="9999"
                      min="1"
                      persistent-hint
                      rounded
                      solo
                      type="text"
                      v-model="selectedEvento.ordem_exibicao"
                    ></v-text-field>
                  </v-col>
                </v-row>

              </v-col>

            </v-row>

            <!--legenda e imagem-->
            <v-row>

              <!--legenda-->
              <v-col cols="6">
                <span class="pl-3">Legenda do Evento (explicação sumária da atividade)</span>
                <v-alert elevation="12" class="rounded-xxl">
                  <vue-editor v-model="selectedEvento.legenda"></vue-editor>
                  <span class="text-sm-caption">Caso seja deixado em branco, não será exibida nenhuma informação sobre o evento</span>
                </v-alert>
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
                    <v-btn color="error" @click="retomaImgAntiga"> Cancelar Alteração de Imagem</v-btn>
                  </v-col>
                </v-row>

              </v-col>

              <!--botao editar -->
              <v-col class="text-right" cols="6" v-else>
                <v-img :src="this.$configSis.urlDownload + selectedEvento.imagem"
                       class="rounded-xl v-responsive"/>

                <v-row class="ajusteBtn">
                  <v-col>
                    <!--editar-->
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn @click="editExistentImageEvento()" class="warning mr-5">
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
                  </v-col>
                </v-row>

                <!-- Fonte da imagem-->
                <v-row>
                  <v-col>
                    <span class="pl-3">Fonte da imagem</span>

                    <v-text-field
                      class="ml-3"
                      dense
                      hint="Exemplo: https://www.uninorte.com.br/artigo233"
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

            <!--saiba mais-->
            <v-row>
              <v-col>

                <span
                  class="pl-3">Saiba mais (oculta o texto da legenda do evento e adiciona conteúdo relevante.)</span>
                <v-alert elevation="12" class="rounded-xxl">
                  <vue-editor v-model="selectedEvento.saibamais"></vue-editor>
                  <span
                    class="text-sm-caption">Caso seja deixado em branco, não será mostrado nada em "Saiba Mais"</span>
                </v-alert>

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

            <!--btn action salvar cancelar-->
            <v-row>
              <v-col class="text-right">

                <!--cancelar-->
                <v-btn @click="cancelaEdicaoEvento" class="mr-5 warning">Cancelar</v-btn>

                <!--salvar-->
                <v-btn class="success" type="submit">Salvar</v-btn>

              </v-col>

            </v-row>

          </v-form>
        </v-card-text>
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
                    hint="Por exemplo: http:/www.uninorte.com.br/art24445"
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
import {VueEditor, Quill} from 'vue2-editor'
import config from '../../../http/config'

export default {
  mixins: [logoutMixin],
  components: {VueEditor, Quill},
  data: () => ({
    eventos: [],
    configSis: config,
    headersEventos: [
      {
        text: 'Data',
        align: 'start',
        value: 'ano'
      },
      {
        text: 'Tipo',
        align: 'start',
        value: 'tipo_evento_id'
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
    dialogShowImagemEvento: false,
    imgEventoFonteShow: '',
    imgEventoShow: undefined,
    selectedEvento: {},
    dialogDeleteEvento: false,
    dialogCadastraEvento: false,
    objetoEventoNewImgAdicional: [],
    indexNewImgAdicionalEvento: 0,
    diaNewEvento: '',
    mesNewEvento: '',
    anoNewEvento: '',
    tituloNewEvento: '',
    legendaNewEvento: '',
    saibaMaisNewEvento: '',
    ordemNewExibicao: '',
    fonteImagemPcpNewEvento: '',
    descricaoNewImgAdicionalEvento: '',
    fonteImagemPcpNewEventoAdicional: '',
    currentImageEvento: undefined,
    previewImageEvento: undefined,
    inputImagemEvento: undefined,
    currentImageEventoAdicional: undefined,
    previewImageEventoAdicional: undefined,
    inputImagemEventoAdicional: undefined,
    dialogEditEvento: false,
    dialogDeleteImagemEvento: false,
    guardadorDeImg: null,
    momentoEditImg: false,
    optionsMes: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
    optionsDia: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31],
    destaqueNewEvento: false,
    tipoEventos: [],
    tipoNewEvento: '',
    dialogEditaEvento: false,
    dialogAddImagemAdicionalEvento: false,
    dialogDeleteImagemAdicionalEvento: false,
    imagemAdicionalParaDeletar: {}
  }),
  computed: {
    ...mapGetters(['usuarioResetado', 'usuarioLogado'])
  },
  async mounted () {
    await this.getEventos()
  },
  methods: {
    async getEventos () {
      try {
        this.$http.get('eventos')
          .then(response => {
            this.eventos = response.data
          })
          .catch(erro => console.log(erro))
      } catch (e) {
        console.log(e)
      }

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

    showImg (imagem) {
      this.imgEventoShow = ''
      this.imgEventoFonteShow = ''
      this.dialogShowImagemEvento = true
      this.imgEventoShow = imagem.imagem
      this.imgEventoFonteShow = imagem.fonteimagempcp
    },

    deleteEvento (item) {
      this.selectedEvento = item
      this.dialogDeleteEvento = true
    },

    deleteEventoConfirm () {
      this.$http.delete('eventos/' + this.selectedEvento.id)
        .then(() => {
          this.getEventos()
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

    abreCadastroNewEvento () {
      this.resetCamposEvento()
      this.objetoEventoNewImgAdicional = []
      this.indexNewImgAdicionalEvento = 0
      this.dialogCadastraEvento = true
    },

    saveEvento () {
      if (this.diaNewEvento !== '' && this.mesNewEvento === '') {
        this.$toastr.e(
          'Se você preenche o campo DIA, obrigatoriamente deve preenche o campo MÊS', 'Erro!'
        )
      } else {
        if (this.tituloNewEvento !== '' && this.anoNewEvento !== '' && this.tipoNewEvento !== '') {
          let formData = new FormData()
          formData.append('dia', this.diaNewEvento)
          formData.append('mes', this.mesNewEvento)
          formData.append('ano', this.anoNewEvento)
          formData.append('nome', this.tituloNewEvento)
          formData.append('legenda', this.legendaNewEvento)
          formData.append('destaque', this.destaqueNewEvento)
          formData.append('ordem_exibicao', this.ordemNewExibicao)
          formData.append('tipo_evento_id', this.tipoNewEvento)
          formData.append('saibamais', this.saibaMaisNewEvento)
          formData.append('fonteimagempcp', this.fonteImagemPcpNewEvento)
          formData.append('imagem', this.currentImageEvento)

          return this.$http.post('eventos', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(() => {
            this.resetCamposEvento()
            this.getEventos()
            this.$toastr.s(
              'Evento cadastrado com sucesso', 'Sucesso!'
            )
            this.dialogCadastraEvento = false
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

    resetCamposEvento () {
      this.diaNewEvento = ''
      this.mesNewEvento = ''
      this.anoNewEvento = ''
      this.tituloNewEvento = ''
      this.legendaNewEvento = ''
      this.saibaMaisNewEvento = ''
      this.destaqueNewEvento = ''
      this.ordemNewExibicao = ''
      this.tipoNewEvento = ''
      this.currentImageEvento = undefined
      this.previewImageEvento = undefined
      this.inputImagemEvento = undefined
    },

    editEvento (item) {
      this.objetoEventoNewImgAdicional = []
      this.indexNewImgAdicionalEvento = 0
      this.dialogEditaEvento = true
      this.currentImageEvento = undefined
      this.previewImageEvento = undefined
      this.inputImagemEvento = undefined
      this.selectedEvento = item
    },

    editExistentImageEvento () {
      this.guardadorDeImg = this.selectedEvento.imagem
      this.selectedEvento.imagem = null
      this.momentoEditImg = true
      this.currentImageEvento = undefined
      this.previewImageEvento = undefined
      this.inputImagemEvento = undefined
    },

    retomaImgAntiga () {
      this.selectedEvento.imagem = this.guardadorDeImg
      this.guardadorDeImg = null
      this.momentoEditImg = false
    },

    editEventoConfirm () {
      if (this.selectedEvento.dia !== '' && this.selectedEvento.mes === '') {
        this.$toastr.e(
          'Se você preenche o campo DIA, obrigatoriamente deve preenche o campo MÊS', 'Erro!'
        )
      } else {
        if (this.selectedEvento.nome !== '' && this.selectedEvento.ano !== '' && this.selectedEvento.tipo_evento_id !== '') {
          let formData = new FormData()
          formData.append('id', this.selectedEvento.id)
          formData.append('dia', this.selectedEvento.dia)
          formData.append('mes', this.selectedEvento.mes)
          formData.append('ano', this.selectedEvento.ano)
          formData.append('nome', this.selectedEvento.nome)
          formData.append('destaque', this.selectedEvento.destaque)
          formData.append('ordem_exibicao', this.selectedEvento.ordem_exibicao)
          formData.append('tipo_evento_id', this.selectedEvento.tipo_evento_id)
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
            this.dialogEditaEvento = false
            this.guardadorDeImg = null
            this.momentoEditImg = false
            this.getEventos()
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
      }
    },

    cancelaEdicaoEvento () {
      this.selectedEvento.imagem = this.guardadorDeImg
      this.guardadorDeImg = null
      this.momentoEditImg = false
      this.dialogEditaEvento = false
    },

    openDialogAddImgAdicionalEvento () {
      this.currentImageEventoAdicional = undefined
      this.previewImageEventoAdicional = undefined
      this.inputImagemEventoAdicional = undefined
      this.fonteImagemPcpNewEventoAdicional = ''
      this.descricaoNewImgAdicionalEvento = ''
      this.dialogAddImagemAdicionalEvento = true
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
</style>
