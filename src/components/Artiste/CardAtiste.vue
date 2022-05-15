<template>
  <q-card>
    <q-card-section>
      <div class="row">
        <div class="col">
          <p style="font-size: 15px" class="q-ma-none">{{ artiste.nom }}</p>
          <p style="font-size: 15px" class="text-grey q-ma-none q-ml-sm">
            {{ artiste.prenom }}
          </p>
          <p style="font-size: 15px" class="q-ma-none">{{ artiste.bibliographie }}</p>

          <q-parallax>
            <template v-slot:media>
              <img :src="artiste.image" />
            </template>
          </q-parallax>
          <q-intersection
            once
            transition="scale"
            class="col-4"
            v-for="(style, index) in artiste.style"
            :key="index"
          >
            <p style="font-size: 15px" class="q-ma-none">{{ style }}</p>
          </q-intersection>
        </div>
        <div class="col row justify-end">
          <q-btn @click="edit = true" flat color="secondary" icon="edit" />
          <q-btn @click="deleteArtiste" flat color="negative" icon="delete" />
          <q-btn
            :to="'/artiste/oeuvre/' + id"
            text-color="primary"
            color="accent"
            no-caps
            label="Voir les oeuvres exposées"
          />
        </div></div
    ></q-card-section>
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
    console.log("yyyyyyyyyy");
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
