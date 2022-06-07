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
            ><q-icon color="primary" :name="oeuvre.etat.icon" />
          </span>
        </div>
      </div>

      <div class="text-subtitle2">
        <q-expansion-item
          group="somegroup"
          icon="description"
          label="Description"
          header-class="text-primary"
        >
          <p class="text-justify">{{ oeuvre.briefDescrition }}</p>
        </q-expansion-item>
        <q-card-actions align="right">
          <q-btn @click="edit" flat color="secondary" icon="edit" size="15px" />
          <q-btn
            :disable="oeuvre.etat.nom === 'stock' ? true : false"
            @click="archiveOeuvre"
            flat
            color="negative"
            icon="delete"
            size="15px"
          />
        </q-card-actions>
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
    id: {
      type: String,
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
  methods: {
    edit() {
      this.$router.push("/oeuvre/edit/" + this.index);
    },
    archiveOeuvre() {
      this.utils
        .dialog({
          title: "Attention !",
          html: true,
          message:
            "Vous etes sur de vouloir archiver l'oeuvre <strong>'" +
            this.oeuvre.nom +
            "'</strong> ?",
          cancel: true,
          persistent: true,
          ok: {
            label: "Archiver",
            color: "negative",
            flat: true,
          },
          cancel: {
            label: "Annuler",
            flat: true,
            color: "primary",
          },
        })
        .onOk(async () => {
          this.utils.loading.show();
          await this.$store.dispatch("archiveOeuvre", {
            id: this.id,
            oeuvre: this.oeuvre,
          });
          this.utils.loading.hide();
        });
    },
  },
};
</script>
