<template>
  <q-page>
    <q-card square class="bg-primary text-white"
      ><q-card-section class="row items-center"
        ><p class="text-center text-bold q-ma-none q-mr-md" style="font-size: 30px">
          Liste des comptes partenaires : {{ nb }}
        </p>
        <q-form class="col row" @submit="search">
          <q-input
            @click="refresh"
            rounded
            color="secondary"
            bg-color="white"
            outlined
            v-model="recherche"
            class="col q-mr-sm"
            label="Rechercher un compte..."
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
          <q-btn type="submit" color="secondary" flat icon="search"
        /></q-form> </q-card-section
    ></q-card>
    <div v-if="comptes">
      <q-intersection
        transition="scale"
        v-for="(compte, index) in comptes.docs"
        :key="index"
        class="q-ma-md"
      >
        <CardCompte :id="compte.id" :infos="compte.data()" />
      </q-intersection>

      <div v-if="comptes.docs.length == 0">
        <p class="text-grey text-center q-mt-lg">Aucun musée trouvé...</p>
      </div>
    </div>
    <div v-else class="q-mt-xl row justify-center">
      <q-spinner-puff color="primary" size="50px" />
    </div>
    <q-page-sticky position="bottom-right" :offset="[18, 18]">
      <q-btn @click="add = true" fab icon="add" color="secondary" />
    </q-page-sticky>
    <q-dialog v-model="add">
      <q-card style="width: 400px" v-if="listeMusee"
        ><q-card-section>
          <p style="font-size: 18px" class="text-bold text-center">
            Ajout d'un compte partenaire
          </p>
          <q-form @submit="submit">
            <q-select
              color="secondary"
              label="Choisir un musée"
              v-model="compte.idMusee"
              :options="listeMusee"
            />
            <div class="row justify-center q-mt-md">
              <q-btn
                type="submit"
                :loading="loading"
                :disabled="compte.idMusee === '' ? true : false"
                no-caps
                color="secondary"
                label="Générer un compte"
              />
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import CardCompte from "components/demande/CardCompte.vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardCompte,
  },
  data() {
    return {
      nb: 0,
      recherche: "",
      loading: false,
      comptes: null,
      add: false,
      infos: null,
      listeMusee: null,
      compte: {
        idMusee: "",
        mail: "",
        nom: "",
        role: "part",
        uid: "",
      },
    };
  },
  async mounted() {
    await this.setOptions();
    let res = await query(collection(fire.firebasebd, "utilisateurs"));
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
    async search() {
      await this.refresh();
      let comptes = this.comptes;
      let res = [];
      comptes.docs.forEach((compte) => {
        let data = compte.data();
        if (data.nom.trim().toLowerCase().includes(this.recherche.trim().toLowerCase())) {
          res.push(compte);
        }
      });
      this.comptes = { docs: res };
    },
    async refresh() {
      this.comptes = null;
      let comptes = await this.$store.dispatch("fetchComptePartenaire");
      this.comptes = comptes;
      this.nb = comptes.docs.length;
    },
    async setOptions() {
      let musees = await this.$store.dispatch("fetchAllMusee");
      let options = [];
      musees.docs.forEach((val) => {
        let data = val.data();
        options.push({ label: data.nom, id: val.id });
      });
      this.listeMusee = options;
    },
    async submit() {
      this.loading = true;
      let email = this.compte.idMusee.label + "@museo.com";
      email = email.toLowerCase();
      email = email.replace(/ /g, "");
      this.compte.nom = this.compte.idMusee.label;
      this.compte.mail = email;
      let idMusee = this.compte.idMusee.val;
      this.compte.idMusee = this.compte.idMusee.id;
      await this.$store.dispatch("createPartenaire", { compte: this.compte });
      this.loading = false;
      this.add = false;
    },
  },
};
</script>
