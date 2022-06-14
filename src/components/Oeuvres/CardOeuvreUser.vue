<template>
  <q-card v-if="oeuvre" v-ripple class="my-box cursor-pointer q-hoverable scale-hover">
    <q-parallax @click="this.$emit('detail')" :height="150" :speed="0.5">
      <template v-slot:media>
        <img :src="oeuvre.image" />
      </template>
    </q-parallax>
    <q-card-section>
      <div class="text-h6">
        {{ oeuvre.nom }}
        <div class="">
          <q-badge
            rounded
            outline
            :style="'margin-left: 20px; margin-right: 10px;color:' + oeuvre.type.couleur"
            :label="oeuvre.type.nom"
          />
          <q-badge
            rounded
            outline
            color="black"
            :label="artiste.nom + ' ' + artiste.prenom"
          />
          <span class="q-ml-sm"
            ><q-icon color="positive" name="radio_button_checked" />
          </span>
        </div>
      </div>

      <div class="text-subtitle2">
        <div class="row items-center">
          <q-expansion-item
            class="col"
            group="somegroup"
            icon="description"
            label="Description"
            header-class="text-primary"
          >
            <p class="text-justify">{{ oeuvre.briefDescrition }}</p>
          </q-expansion-item>
          <div class="col-1 q-mr-md q-ml-md">
            <q-btn
              push
              size="18px"
              round
              icon="search"
              color="secondary"
              @click="dialog = true"
            />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
  <q-dialog v-model="dialog">
    <q-card style="min-width: 900px; height: 700px; border-radius: 10px">
      <div class="row q-mt-sm">
        <div class="col" style="margin-left: 20px; font-weight: bold; font-size: 20px">
          Localisation de {{ oeuvre.nom }}
          <q-icon name="pin_drop" color="secondary" size="30px" />
        </div>
        <div class="col-1 row justify-end q-mr-sm">
          <q-btn class="col" flat icon="close" color="primary" v-close-popup />
        </div>
      </div>

      <q-card-section class="row items-center justify-center">
        <div class="q-mt-xl q-mr-xl q-ml-xl">
          <CardPlan class="col" />
        </div>
        <div class="column">
          <div class="col-4 q-ma-none q-mb-sm" style="font-size: 20px">
            L'oeuvre se trouve dans la salle <strong>4</strong> étage <strong>1</strong>.
          </div>
          <div class="col-4 text-center q-ma-none" style="font-size: 20px">
            <q-icon name="pin_drop" color="negative" size="30px" />
            Localisation de l'oeuvre
          </div>
        </div>
      </q-card-section>

      <!-- Notice v-close-popup -->
    </q-card>
  </q-dialog>
</template>

<style>
.scale-hover {
  position: relative;
  -webkit-transition: all 200ms ease-in;
  -webkit-transform: scale(1);
  -ms-transition: all 200ms ease-in;
  -ms-transform: scale(1);
  -moz-transition: all 200ms ease-in;
  -moz-transform: scale(1);
  transition: all 200ms ease-in;
  transform: scale(1);
}
.scale-hover:hover {
  box-shadow: 0px 0px 150px #000000;
  z-index: 2;
  -webkit-transition: all 200ms ease-in;
  -webkit-transform: scale(1.05);
  -ms-transition: all 200ms ease-in;
  -ms-transform: scale(1.05);
  -moz-transition: all 200ms ease-in;
  -moz-transform: scale(1.05);
  transition: all 200ms ease-in;
  transform: scale(1.05);
}
</style>

<script>
import CardPlan from "components/Oeuvres/CardPlan.vue";
import { useQuasar } from "quasar";
export default {
  props: {
    proOeuvre: {
      type: Object,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
  },
  components: {
    CardPlan,
  },
  data() {
    return {
      utils: useQuasar(),
      artiste: {},
      oeuvre: this.proOeuvre,
      dialog: false,
    };
  },
  async mounted() {
    this.artiste = await this.$store.dispatch("fetchArtiste", {
      idArtiste: this.oeuvre.idArtiste,
    });
    let type = await this.$store.dispatch("fecthTypeOeuvre", {
      id: this.oeuvre.type,
    });
    this.oeuvre.type = type;
  },
};
</script>
