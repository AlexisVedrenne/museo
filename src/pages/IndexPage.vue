<template>
  <q-page class="flex flex-center">
      <CardPainting/>
  </q-page>
</template>

<script>
import CardPainting from 'components/Oeuvres/CardPainting.vue'

export default ({
  name: 'IndexPage',
  components: { CardPainting }
})
</script>
