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
import CardDemande from "components/demande/CardDemande.vue";
export default {
  components: {
    CardDemande,
  },
  data() {
    return {
      demandes: null,
    };
  },
  async mounted() {
    let demandes = await this.$store.dispatch("fetchAllDemandes");
    this.demandes = demandes;
  },
};
</script>
