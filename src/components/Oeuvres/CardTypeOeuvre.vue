<template>
  <q-item>
    <q-item-section>
      <div class="row items-center">
        <p class="q-ma-none q-mr-md">{{ proType.nom }}</p>
        <div
          class="col"
          :style="'background-color:' + proType.couleur + ' ; border-radius: 30px'"
        >
          <p></p>
        </div>
      </div>
    </q-item-section>
    <q-btn @click="edit = true" round flat color="secondary" icon="edit" />
    <q-btn @click="deleteType" round flat color="negative" icon="delete" />
    <q-btn :to="'/oeuvre/type/' + id" no-caps text-color="black" color="accent"
      >Voir les oeuvres</q-btn
    >
  </q-item>
  <q-separator spaced inset />

  <q-dialog v-model="edit">
    <q-card style="width: 500px">
      <q-card-section style="width: 500px" class="row items-center q-pb-none">
        <div class="text-h6">Modification du type d'oeuvre</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>
      <q-form @submit="submit">
        <q-card-section>
          <div class="justify-around row">
            <div class="q-gutter-md row items-start" style="max-width: 300px">
              <q-input color="secondary" filled v-model="type.nom" label="Nom du type" />
            </div>

            <div class="q-gutter-md row items-start">
              <q-input color="secondary" filled v-model="type.couleur">
                <template v-slot:append>
                  <q-icon name="colorize" class="cursor-pointer">
                    <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                      <q-color format-model="hexa" v-model="type.couleur" />
                    </q-popup-proxy>
                  </q-icon>
                </template>
              </q-input>
            </div>
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
        </q-card-section>
      </q-form>
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
    proType: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      loading: false,
      edit: false,
      utils: useQuasar(),
      type: this.proType,
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      await this.$store.dispatch("updateTypeOeuvre", {
        id: this.id,
        type: this.type,
      });
      this.loading = false;
      this.edit = false;
    },
    deleteType() {
      this.utils
        .dialog({
          title: "Attention !",
          message: "Vous etes sur de vouloir retirer le type '" + this.type.nom + "' ?",
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
          await this.$store.dispatch("deleteType", { id: this.id });
          this.utils.loading.hide();
        });
    },
  },
};
</script>
