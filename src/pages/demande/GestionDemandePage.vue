<template>
  <q-page>
    <q-card square class="bg-primary text-white"
      ><q-card-section
        ><p class="text-center text-bold" style="font-size: 30px">
          Liste des demandes de prêt
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
        <CardPret :id="demande.id" :demande="demande.data()" />
      </q-intersection>
      <div v-if="demandes.docs.length === 0">
        <p class="text-grey text-center q-mt-md">
          Aucune demandes n'a encore était effectuée...
        </p>
      </div>
    </div>
  </q-page>
</template>
<script>
import CardPret from "components/demande/CardPret.vue";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardPret,
  },
  data() {
    return {
      demandes: null,
    };
  },
  async mounted() {
    let res = await await query(
      collection(fire.firebasebd, "demande"),
      where("etat", "==", 0)
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
    await this.refresh();
  },
  methods: {
    async refresh() {
      this.demandes = null;
      let demandes = await this.$store.dispatch("fetchAllDemande");
      this.demandes = demandes;
    },
  },
};
</script>
