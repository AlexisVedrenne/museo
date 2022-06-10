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
      <div class="col row items-center" v-if="artiste">
        <p class="q-ma-none q-mr-sm">
          {{ artiste.nom + " " + artiste.prenom }}
        </p>
        <q-avatar>
          <img :src="artiste.image" />
        </q-avatar>
      </div>
      <div>
        <q-btn
          v-if="this.$route.params.id"
          @click="cloture"
          text-color="black"
          color="accent"
          no-caps
          label="Clôturer cet emprunt"
        />
      </div>
    </q-card-section>
  </q-card>
</template>
<script>
export default {
  props: {
    emprunt: {
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
      artiste: null,
    };
  },
  async mounted() {
    let oeuvre = await this.$store.dispatch("fetchOeuvre", {
      id: this.emprunt.idOeuvre,
    });

    this.oeuvre = oeuvre.data();
    let type = await this.$store.dispatch("fecthTypeOeuvre", {
      id: this.oeuvre.type,
    });
    this.type = type;
    let artiste = await this.$store.dispatch("fetchArtiste", {
      idArtiste: this.oeuvre.idArtiste,
    });
    this.artiste = artiste;
  },
  methods: {
    async cloture() {
      this.$store.dispatch("clotureDemande", {
        id: this.id,
        demande: this.emprunt,
      });
    },
  },
};
</script>
