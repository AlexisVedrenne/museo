<template>
  <q-page>
    <q-card square class="bg-primary text-white"
      ><q-card-section
        ><p class="text-center text-bold" style="font-size: 30px">
          Mes demandes
        </p></q-card-section
      ></q-card
    >
    <div v-if="demandes">
      <q-intersection
        transition="scale"
        v-for="(demande, index) in demandes.docs"
        :key="index"
        class="q-ma-md"
      >
        <CardDemande :demande="demande.data()" />
      </q-intersection>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import CardDemande from "components/demande/CardDemande.vue";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardDemande,
  },
  data() {
    return {
      demandes: null,
      utils: useQuasar(),
    };
  },
  async mounted() {
    let user = this.utils.localStorage.getItem("user");
    let res = await query(
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
      this.demandes = null;
      let demandes = await this.$store.dispatch("fetchAllDemandes");
      this.demandes = demandes;
    },
  },
};
</script>
