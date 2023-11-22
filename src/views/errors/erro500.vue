<template>
  <v-main>

    <!--App Bar Config Area-->

    <v-row>

      <v-col cols="6" offset="3">

        <v-alert type="error">

          <h4>Erro no servidor!</h4>

          <br>
          <v-divider></v-divider>
          <br>
          <p>Houve um erro na interpretação do seu pedido.</p>
          <p>Muito provavelmente isso ocorreu por uma falha no servidor.</p>
          <p>Reporte o Bug para a equipe de desenvolvimento.</p>

          <p>Erro: {{ mensagemErro }}</p>

        </v-alert>

      </v-col>
    </v-row>
  </v-main>
</template>
<script>
export default {
  name: 'erro500',
  data: () => ({
    mensagemErro: ''
  }),
  mounted () {
    const error = this.$route.params.error
    this.mensagemErro = error
  }
}
</script>
