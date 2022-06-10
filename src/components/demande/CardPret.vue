<template>
  <q-card>
    <q-card-section v-if="musee" class="row items-center"
      ><p class="col-2 q-ma-none text-bold">{{ musee.nom }}</p>
      <div v-if="oeuvre" class="col row items-center">
        <p class="q-ma-none q-mr-sm">
          demande de prêt sur l'oeuvre : <strong>{{ oeuvre.nom }}</strong>
        </p>
        <q-avatar><img :src="oeuvre.image" /></q-avatar>
      </div>
      <div class="col-4 row items-center justify-end">
        <q-btn @click="acceptDemande" icon="done" color="positive" flat round />
        <q-btn @click="refuseDemande" icon="close" color="negative" flat round />
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
      musee: null,
      oeuvre: null,
      etat: this.demande,
    };
  },
  async mounted() {
    let user = await this.$store.dispatch("fetchUserInfosById", {
      id: this.demande.idUser,
    });
    let musee = await this.$store.dispatch("fetchMusee", {
      idMusee: user.idMusee,
    });
    this.musee = musee;
    let oeuvre = await this.$store.dispatch("fetchOeuvre", {
      id: this.demande.idOeuvre,
    });
    this.oeuvre = oeuvre.data();
  },
  methods: {
    async acceptDemande() {
      await this.$store.dispatch("acceptDemande", {
        id: this.id,
        demande: this.demande,
      });
    },
    async refuseDemande() {
      await this.$store.dispatch("refuseDemande", {
        id: this.id,
        demande: this.demande,
      });
    },
  },
};
</script>
