<template>
  <q-page class="flex justify-evenly">
    <CardPainting />
  </q-page>
</template>

<script>
import CardPainting from "components/Oeuvres/CardPainting.vue";

export default {
  name: "IndexPage",
  components: { CardPainting },
};
</script>
