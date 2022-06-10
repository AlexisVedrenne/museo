<template>
  <q-card v-if="oeuvre"
    ><q-card-section class="row justify-start items-center">
      <div class="col-1">
        <q-avatar>
          <img :src="oeuvre.image" />
        </q-avatar>
      </div>
      <div class="col row">
        <p class="q-ma-none">{{ oeuvre.nom }}</p>
        <q-badge
          outline
          :style="'color:' + type.couleur"
          v-if="type"
          class="q-ml-sm"
          :label="type.nom"
        />
      </div>
      <div class="col row justify-center">
        <div v-if="demande.etat === 0" class="row items-center">
          <q-spinner-clock size="30px" class="q-mr-sm" color="grey" />
          <p class="q-ma-none text-grey">En attente d'acceptation...</p>
        </div>
        <div v-if="demande.etat === 1" class="row items-center">
          <q-icon size="30px" class="q-mr-sm" color="positive" name="done" />
          <p class="q-ma-none">Demande acceptée</p>
        </div>
        <div v-if="demande.etat === 2" class="row items-center">
          <q-icon size="30px" class="q-mr-sm" color="negative" name="warning" />
          <p class="q-ma-none">Demande Refusée</p>
        </div>
      </div>
      <div v-if="demande.etat === 2">
        <q-btn
          @click="cloture"
          text-color="black"
          color="accent"
          no-caps
          label="Clôturer cette demande"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: {
    demande: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      oeuvre: null,
      type: null,
    };
  },
  async mounted() {
    let oeuvre = await this.$store.dispatch("fetchOeuvre", {
      id: this.demande.idOeuvre,
    });

    this.oeuvre = oeuvre.data();
    let type = await this.$store.dispatch("fecthTypeOeuvre", {
      id: this.oeuvre.type,
    });
    this.type = type;
  },
  methods: {
    async cloture() {
      await this.$store.dispatch("clotureDemande", {
        id: this.id,
        demande: this.demande,
      });
    },
  },
};
</script>
