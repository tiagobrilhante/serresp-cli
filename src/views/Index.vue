<template>

  <v-main>

    <Eventos />

  </v-main>

</template>

<script>
import Eventos from '../components/index/Eventos'

export default {

  components: {
    Eventos
  },
  data () {
    return {
      usuario: {}
    }
  },

  computed: {},

  async mounted () {
  },
  methods: {
  }
}
</script>
<style>

.font-preta {
  color: black !important;
}

</style>
