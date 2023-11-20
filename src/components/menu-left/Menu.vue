<template>
  <v-row class="ml-3 mt-1">
    <v-col class="text-center">
      <v-img class="v-responsive rounded-xxl"
             :src="require('@/assets/img/logoUninorte.jpg')"
      />
      <h2>Menu</h2>
      <v-divider class="mb-4"></v-divider>
      <v-btn to="/" color="secondary" block max-width="100%"> Página Incial</v-btn>
      <v-btn class="mt-3" color="secondary" block max-width="100%"> O que é SerResponsável</v-btn>
      <v-btn to="/assuntos" class="mt-3" color="secondary" block max-width="100%"> Atividades Recentes</v-btn>
      <v-btn to="/eventos" class="mt-3" color="secondary" block max-width="100%"> Ao longo dos anos</v-btn>
      <v-btn class="mt-3" color="secondary" block max-width="100%"> Benefícios do Projeto</v-btn>

      <br>
      <hr>
      <v-btn to="/home" class="mt-3" color="secondary" block max-width="100%"> Página Inicial</v-btn>
      <v-btn to="/configs" class="mt-3" color="secondary" block max-width="100%"> Configurações</v-btn>
      <v-btn to="/admusers" class="mt-3" color="secondary" block max-width="100%"> Adm Usuários</v-btn>

    </v-col>
  </v-row>
</template>

<script>import config from '../../http/config'

export default {
  data: () => ({
    configSis: config,
    messages: [
      {
        from: 'You',
        message: `Sure, I'll see you later.`,
        time: '10:42am',
        color: 'deep-purple lighten-1'
      },
      {
        from: 'John Doe',
        message: 'Yeah, sure. Does 1:00pm work?',
        time: '10:37am',
        color: 'green'
      },
      {
        from: 'You',
        message: 'Did you still want to grab lunch today?',
        time: '9:47am',
        color: 'deep-purple lighten-1'
      }
    ]
  }),
  computed: {},
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
