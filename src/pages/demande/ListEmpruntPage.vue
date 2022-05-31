<template>
  <q-page>
    <q-card square class="bg-primary text-white"
      ><q-card-section
        ><p class="text-center text-bold" style="font-size: 30px">
          Mes emprunts
        </p></q-card-section
      ></q-card
    >
    <div v-if="emprunts">
      <q-intersection
        transition="scale"
        v-for="(emprunt, index) in emprunts.docs"
        :key="index"
        class="q-ma-md"
      >
        <CardEmprunt :emprunt="emprunt.data()" />
      </q-intersection>
      <div v-if="emprunts.docs.length === 0">
        <p class="text-grey text-center q-mt-md">
          Aucune oeuvre(s) empruntée(s) pour le moment...
        </p>
      </div>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import CardEmprunt from "components/demande/CardEmprunt.vue";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardEmprunt,
  },
  data() {
    return {
      utils: useQuasar(),
      user: null,
      emprunts: null,
    };
  },
  async mounted() {
    let user = this.utils.localStorage.getItem("user");
    let res = await await query(
      collection(fire.firebasebd, "demande"),
      where("idUser", "==", user.uid)
    );
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
      this.emprunts = null;
      let emprunts = await this.$store.dispatch("fetchAllEmprunt");
      this.emprunts = emprunts;
    },
  },
};
</script>
