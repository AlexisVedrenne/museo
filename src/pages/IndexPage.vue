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
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn :to="{ name: 'ajoutOeuvre' }" fab icon="add" color="secondary" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
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
    let res = await query(collection(fire.firebasebd, "oeuvre"));
    onSnapshot(res, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          await this.refresh();
        }
        if (change.type === "modified") {
          await this.refresh();
        }
        if (change.type === "removed") {
          await this.refresh();
        }
      });
    });
  },
  methods: {
    async refresh() {
      this.oeuvres = null;
      await this.$store.dispatch("fetchAllOeuvres");
      this.oeuvres = this.utils.localStorage.getItem("oeuvres");
    },
  },
};
</script>
