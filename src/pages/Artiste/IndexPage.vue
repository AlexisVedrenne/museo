<template>
  <q-page>
    <main>
      <q-card square class="bg-primary"
        ><q-card-section
          ><p class="text-white text-center text-bold" style="font-size: 30px">
            Liste des artistes
          </p></q-card-section
        ></q-card
      >
      <div v-if="artistes">
        <q-intersection
          transition="scale"
          v-for="(artiste, index) in artistes"
          :key="index"
          class="q-ma-md"
        >
          <CardAtiste :id="res.docs[index].id" :proArtiste="artiste" />
        </q-intersection>

        <div v-if="artiste.length == 0">
          <p class="text-grey text-center q-mt-lg">Aucun artiste trouvés...</p>
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
          <div class="text-h6">Ajout d'un artiste</div>
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
                    (val && val.length > 0) || 'Le nom du artiste doit être saisie !',
                ]"
                v-model="artiste.nom"
                color="secondary"
                class="col q-mr-md"
                label="Nom"
              ></q-input>
            </div>
            <div class="row">
              <q-input
                lazy-rules
                :rules="[
                  (val) =>
                    (val && val.length > 0) || 'Le prenom du artiste doit être saisie !',
                ]"
                v-model="artiste.prenom"
                color="secondary"
                class="col q-mr-md"
                label="Prenom"
              ></q-input>
            </div>
            <div class="row">
              <q-input
                v-model="artiste.image"
                color="secondary"
                class="col q-mr-md"
                label="image"
              ></q-input>
            </div>

            <div class="row">
              <q-input
                v-model="artiste.bibliographie"
                color="secondary"
                class="col q-mr-md"
                label="bibliographie"
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
import CardAtiste from "components/Artiste/CardAtiste.vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardAtiste,
  },
  data() {
    return {
      add: false,
      loading: false,
      artistes: null,
      res: null,
      artiste: {
        nom: "",
        adresse: "",
        tel: "",
      },
    };
  },
  async mounted() {
    console.log("teeeeeeeeeeeeeeest");
    let res = await query(collection(fire.firebasebd, "artistes"));
    console.log("teeeeeeeeeeeeeeest 1", res);

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
      this.artistes = null;
      this.res = await this.$store.dispatch("fetchAllArtist");
      let artistes = [];
      console.log("test3", this.res);
      for (let i = 0; i < this.res.docs.length; i++) {
        console.log("a");
        artistes.push(this.res.docs[i].data());
        console.log(this.res.docs[i].data());
      }

      this.artistes = Object.values(artistes);
      console.log(this.artistes);
    },
    async submit() {
      this.loading = true;
      await this.$store.dispatch("addArtiste", { artiste: this.artiste });
      this.loading = false;
      this.add = false;
      this.artiste = {
        nom: "",
        adresse: "",
        tel: "",
      };
    },
  },
};
</script>
