<template>
  <q-page>
    <main>
      <q-card square class="bg-primary"
        ><q-card-section
          ><p class="text-white text-center text-bold" style="font-size: 30px">
            Liste des musées
          </p></q-card-section
        ></q-card
      >
      <div v-if="musees">
        <q-intersection
          transition="scale"
          v-for="(musee, index) in musees"
          :key="index"
          class="q-ma-md"
        >
          <CardMusee :id="res.docs[index].id" :proMusee="musee" />
        </q-intersection>

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
                  (val) =>
                    (val && val.length > 0) || 'Le nom du musée doit être saisie !',
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
  </q-page>
</template>
<script>
import CardMusee from "components/musee/CardMusee.vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
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
    let res = await query(collection(fire.firebasebd, "musees"));
    onSnapshot(res, (snapshot) => {
      snapshot.docChanges().forEach(async (change) => {
        if (change.type === "added") {
          await this.refresh();
        }
        if (change.type === "modified") {
          await this.refresh();
        }
        if (change.type === "removed") {
          await this.refresh();
        }
      });
    });
  },
  methods: {
    async refresh() {
      this.musees = null;
      this.res = await this.$store.dispatch("fetchAllMusee");
      let musees = [];
      for (let i = 0; i < this.res.docs.length; i++) {
        musees.push(this.res.docs[i].data());
      }
      this.musees = Object.values(musees);
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
    },
  },
};
</script>
