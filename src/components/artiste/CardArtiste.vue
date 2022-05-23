<template>
  <q-card class="q-pa-lg">
    <div class="row justify-start items-center">
      <div class="col-1">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </div>
      <div class="col-1">Nom</div>
      <div class="col-1">
        <q-badge outline color="primary" label="Type" />
      </div>
      <div class="col-2" style="width: 250px">
        <q-expansion-item expand-separator label="Bibliographie"> </q-expansion-item>
      </div>
      <div class="col row justify-end">
        <q-btn @click="edit = true" flat color="secondary" icon="edit" />
        <q-btn flat color="negative" icon="delete" />
        <q-btn text-color="primary" color="accent" no-caps label="Voir les oeuvres" />
      </div>
    </div>
  </q-card>
</template>
<script>
import { useQuasar } from "quasar";
export default {
  props: {
    id: {
      type: String,
    },
    proArtiste: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils: useQuasar(),
      loading: false,
      edit: false,
      artiste: this.proArtiste,
    };
  },
  mounted() {},
  methods: {
    async submit() {
      this.loading = true;
      await this.$store.dispatch("updateArtiste", {
        artiste: this.artiste,
        id: this.id,
      });
      this.loading = false;
      this.edit = false;
    },
    deleteArtiste() {
      this.utils
        .dialog({
          title: "Attention !",
          message:
            "Vous etes sur de vouloir retirer le musée '" + this.artiste.nom + "' ?",
          cancel: true,
          persistent: true,
          ok: {
            label: "Supprimer",
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
          await this.$store.dispatch("deleteArtiste", { id: this.id });
          this.utils.loading.hide();
        });
    },
  },
};
</script>
