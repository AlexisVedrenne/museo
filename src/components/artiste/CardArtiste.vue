<template>
  <q-card class="q-pa-lg">
    <div class="row justify-start items-center">
      <div class="col-1">
        <q-avatar>
          <img :src="proArtiste.image" />
        </q-avatar>
      </div>
      <div class="col-1">{{ proArtiste.nom }} {{ proArtiste.prenom }}</div>
      <div class="col-2 row">
        <q-badge
          v-for="(style, index) in proArtiste.style"
          :key="index"
          outline
          :style="'color:' + style.couleur"
          :label="style.nom"
        />
      </div>
      <div class="col" style="width: 250px">
        <q-expansion-item expand-separator label="Bibliographie"
          ><p v-html="proArtiste.bibliographie"></p>
        </q-expansion-item>
      </div>
      <div class="col-4 row justify-end">
        <q-btn @click="edit = true" flat color="secondary" icon="edit" />
        <q-btn @click="deleteArtiste" flat color="negative" icon="delete" />
        <q-btn text-color="primary" color="accent" no-caps label="Voir les oeuvres" />
      </div>
    </div>
  </q-card>
  <q-dialog
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
    v-model="edit"
  >
    <q-card style="width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Modification</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <q-form @submit="submit">
          <div class="row">
            <q-input
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Le nom de article doit être saisie !',
              ]"
              v-model="artiste.nom"
              color="secondary"
              class="col q-mr-md"
              label="Nom"
            >
              <template v-slot:prepend> <q-icon name="account_balance" /> </template
            ></q-input>
          </div>

          <div class="row">
            <q-input
              lazy-rules
              :rules="[
                (val) =>
                  (val && val.length > 0) || 'Le prenom de article doit être saisie !',
              ]"
              v-model="artiste.prenom"
              color="secondary"
              class="col q-mr-md"
              label="Prenom"
            >
              <template v-slot:prepend> <q-icon name="account_balance" /> </template
            ></q-input>
          </div>

          <div class="row">
            <q-input
              lazy-rules
              v-model="artiste.bibliographie"
              color="secondary"
              class="col q-mr-md"
              label="Bibliographie"
            >
              <template v-slot:prepend> <q-icon name="account_balance" /> </template
            ></q-input>
          </div>

          <div class="row">
            <q-input
              v-model="artiste.image"
              color="secondary"
              class="col q-mr-md"
              label="Images"
            >
              <template v-slot:prepend> <q-icon name="account_balance" /> </template
            ></q-input>
          </div>

          <div class="row justify-center q-mt-lg">
            <q-btn
              :loading="loading"
              type="submit"
              style="border-raduis: 10px"
              label="Modifier"
              no-caps
              color="secondary"
            />
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </q-dialog>
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
