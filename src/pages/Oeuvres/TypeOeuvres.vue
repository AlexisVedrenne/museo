<template>
  <q-page>
    <q-card square class="bg-primary"
      ><q-card-section
        ><p class="text-white text-center text-bold" style="font-size: 30px">
          Liste des types d'oeuvre disponible
        </p></q-card-section
      ></q-card
    >
    <main v-if="types">
      <q-list>
        <q-intersection
          v-for="(type, index) in types.docs"
          :key="index"
          transition="scale"
        >
          <CardTypeOeuvre :id="type.id" :proType="type.data()" />
        </q-intersection>
      </q-list>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn @click="add = true" fab icon="add" color="secondary" />
      </q-page-sticky>

      <q-dialog v-model="add">
        <q-card style="width: 500px">
          <q-card-section style="width: 500px" class="row items-center q-pb-none">
            <div class="text-h6">Ajout d'un type d'oeuvre</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>
          <q-form @submit="submit">
            <q-card-section>
              <div class="justify-around row">
                <div class="q-gutter-md row items-start" style="max-width: 300px">
                  <q-input
                    color="secondary"
                    filled
                    v-model="type.nom"
                    label="Nom du type"
                  />
                </div>

                <div class="q-gutter-md row items-start">
                  <q-input color="secondary" filled v-model="type.couleur">
                    <template v-slot:append>
                      <q-icon name="colorize" class="cursor-pointer">
                        <q-popup-proxy
                          cover
                          transition-show="scale"
                          transition-hide="scale"
                        >
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
                  label="Ajouter"
                  no-caps
                  color="secondary"
                />
              </div>
            </q-card-section>
          </q-form>
        </q-card>
      </q-dialog>
    </main>
  </q-page>
</template>

<script>
import CardTypeOeuvre from "components/Oeuvres/CardTypeOeuvre.vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardTypeOeuvre,
  },
  data() {
    return {
      type: {
        nom: "",
        couleur: "",
      },
      add: false,
      loading: false,
      types: null,
    };
  },
  async mounted() {
    let res = await query(collection(fire.firebasebd, "typeOeuvre"));
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
      this.types = null;
      let types = await this.$store.dispatch("fetchAllTypeOeuvre");
      this.types = types;
    },
    async submit() {
      this.loading = true;
      await this.$store.dispatch("addTypeOeuvre", { type: this.type });
      this.loading = false;
      this.type = {
        nom: "",
        couleur: "",
      };
      this.add = false;
    },
  },
};
</script>
