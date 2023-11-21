<template>
  <v-main>
    <AdmEventos/>
  </v-main>
</template>

<script>import {logoutMixin} from '@/mixins'
import {mapGetters} from 'vuex'
import config from '../http/config'
import AdmEventos from '../components/areaAdministrativa/admEventos/AdmEventos'

export default {
  name: 'home',
  mixins: [logoutMixin],
  components: {AdmEventos},
  data: vm => ({
    configSis: config
  }),
  computed: {
    ...mapGetters(['usuarioLogado'])
  },
  watch: {
  },
  async mounted () {},
  methods: {}
}
</script>

<style>
</style>
