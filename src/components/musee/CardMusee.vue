<template>
  <q-card>
    <q-card-section
      ><div class="row">
        <div class="col">
          <p style="font-size: 15px" class="q-ma-none">{{ musee.nom }}</p>
          <p style="font-size: 15px" class="text-grey q-ma-none q-ml-sm">
            {{ musee.tel }}, {{ musee.adresse }}
          </p>
        </div>
        <div class="col row justify-end">
          <q-btn @click="edit = true" flat color="secondary" icon="edit" />
          <q-btn @click="deleteMusee" flat color="negative" icon="delete" />
          <q-btn text-color="primary" color="accent" no-caps label="Voir les oeuvres" />
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
                (val) => (val && val.length > 0) || 'Le nom du musée doit être saisie !',
              ]"
              v-model="musee.nom"
              color="secondary"
              class="col q-mr-md"
              label="Nom"
            >
              <template v-slot:prepend>
                <q-icon name="account_balance" /> </template></q-input
            ><q-input
              lazy-rules
              :rules="[
                (val) => (val && val.length == 10) || 'Un numéro possède 10 chiffres !',
              ]"
              type="number"
              v-model="musee.tel"
              color="secondary"
              class="col"
              label="Téléphone"
            >
              <template v-slot:prepend> <q-icon name="phone" /> </template
            ></q-input>
          </div>
          <div class="row justify-center">
            <q-input
              lazy-rules
              :rules="[
                (val) => (val && val.length > 0) || 'Vous devez écrire une addresse',
              ]"
              v-model="musee.adresse"
              color="secondary"
              class="col-7"
              label="Addresse"
            >
              <template v-slot:prepend> <q-icon name="place" /> </template
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
    proMusee: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils: useQuasar(),
      loading: false,
      edit: false,
      musee: this.proMusee,
    };
  },
  mounted() {},
  methods: {
    async submit() {
      this.loading = true;
      await this.$store.dispatch("updateMusee", {
        musee: this.musee,
        id: this.id,
      });
      this.loading = false;
      this.edit = false;
      this.$emit("reload");
    },
    deleteMusee() {
      this.utils
        .dialog({
          title: "Attention !",
          message: "Vous etes sur de vouloir retirer le musée '" + this.musee.nom + "' ?",
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
          await this.$store.dispatch("deleteMusee", { id: this.id });
          this.utils.loading.hide();
          this.$emit("reload");
        });
    },
  },
};
</script>
