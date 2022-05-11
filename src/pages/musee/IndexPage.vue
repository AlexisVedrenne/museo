<template>
  <main>
    <q-card square class="bg-primary"
      ><q-card-section
        ><p class="text-white text-center text-bold" style="font-size: 30px">
          Liste des musées
        </p></q-card-section
      ></q-card
    >
    <div v-if="musees">
      <div v-for="(musee, index) in musees" :key="index" class="q-ma-md">
        <CardMusee :id="res.docs[index].id" @reload="refresh" :proMusee="musee" />
      </div>

      <div v-if="musees.length == 0">
        <p class="text-grey text-center q-mt-lg">Aucun musées trouvés...</p>
      </div>
    </div>
    <div v-else class="q-mt-xl row justify-center">
      <q-spinner-puff color="primary" size="50px" />
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="add = true" fab icon="add" color="secondary" />
    </q-page-sticky>
  </main>
  <q-dialog
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
    v-model="add"
  >
    <q-card style="width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Ajout d'un musée</div>
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
              label="Ajouter"
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
import CardMusee from "components/musee/CardMusee.vue";
export default {
  components: {
    CardMusee,
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
  async mounted() {
    await this.refresh();
  },
  methods: {
    async refresh() {
      this.res = await this.$store.dispatch("fetchAllMusee");
      if (this.res.docs.length > 0) {
        this.musees = [];
      }
      this.res.docs.forEach((musee) => {
        this.musees.push(musee.data());
      });
    },
    async submit() {
      this.loading = true;
      await this.$store.dispatch("addMusee", { musee: this.musee });
      this.loading = false;
      this.add = false;
      this.musee = {
        nom: "",
        adresse: "",
        tel: "",
      };
      await this.refresh();
    },
  },
};
</script>
