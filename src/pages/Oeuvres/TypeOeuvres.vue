<template>
  <q-item>
    <q-item-section>Liste a</q-item-section>
    <q-btn round flat color="secondary" icon="edit" />
    <q-btn round flat color="negative" icon="delete" />
    <q-btn color="accent">voir les oeuvres</q-btn>
  </q-item>

  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn @click="add = true" fab icon="add" color="secondary" />
  </q-page-sticky>
  <CardTypeOeuvre />
  <q-dialog v-model="add">
    <q-card style="width: 500px">
      <q-card-section style="width: 500px" class="row items-center q-pb-none">
        <div class="text-h6">Ajout d'un musée</div>
        <q-space />
        <q-btn icon="close" flat round dense v-close-popup />
      </q-card-section>

      <q-card-section>
        <div class="justify-around row">
          <div class="q-gutter-md row items-start" style="max-width: 300px">
            <q-input filled v-model="text" label="Nom du type" />
          </div>

          <div class="q-gutter-md row items-start">
            <q-input filled v-model="color" class="my-input">
              <template v-slot:append>
                <q-icon name="colorize" class="cursor-pointer">
                  <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                    <q-color v-model="color" />
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
            label="Ajouter"
            no-caps
            color="secondary"
          />
        </div>
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import CardTypeOeuvre from "components/Oeuvres/CardTypeOeuvre.vue";
export default {
  components: {
    CardTypeOeuvre,
  },
  data() {
    return {
      add: false,
      loading: false,
      musees: null,
      res: null,
      musee: {
        nom: "",
        adresse: "",
        tel: "",
      },
    };
  },
};
</script>
