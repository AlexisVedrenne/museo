<template>
  <q-page>
    <div v-if="oeuvres" class="row q-col-gutter-md q-ma-sm">
      <q-intersection
        transition="scale"
        class="col-4"
        v-for="(oeuvre, index) in oeuvres"
        :key="index"
      >
        <CardPainting />
      </q-intersection>
    </div>
  </q-page>
</template>

<script>
import CardPainting from "components/Oeuvres/CardPainting.vue";
import { useQuasar } from "quasar";
export default {
  name: "IndexPage",
  components: { CardPainting },
  data() {
    return {
      utils: useQuasar(),
      oeuvres: null,
    };
  },
  async mounted() {
    await this.$store.dispatch("fetchAllOeuvres");
    this.oeuvres = this.utils.localStorage.getItem("oeuvres");
  },
};
</script>
