<template>
  <q-card v-if="oeuvre" v-ripple class="my-box cursor-pointer q-hoverable scale-hover">
    <q-parallax @click="this.$emit('detail')" :height="150" :speed="0.5">
      <template v-slot:media>
        <img :src="oeuvre.image" />
      </template>
    </q-parallax>
    <q-card-section>
      <div class="text-h6 flex">
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
          <span class="q-ml-sm"><q-icon :color="active.color" name="blur_on" /> </span>
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
            <q-btn push size="18px" round icon="mail" color="secondary" />
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
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
import { useQuasar } from "quasar";
export default {
  props: {
    proOeuvre: {
      type: Object,
      required: true,
    },
    index: {
      required: false,
    },
  },

  data() {
    return {
      utils: useQuasar(),
      artiste: {},
      oeuvre: this.proOeuvre,
      active: {
        color: "",
        sate: false,
      },
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
    this.setActive();
  },
  methods: {
    setActive() {
      if (this.oeuvre.etat.nom === "exposition") {
        this.active.color = "positive";
        this.active.state = true;
      } else {
        this.active.color = "negative";
        this.active.state = false;
      }
    },
  },
};
</script>
