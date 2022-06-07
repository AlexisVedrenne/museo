<template>
  <q-page>
    <main v-if="oeuvre && artiste && musee && exposition">
      <q-card square class="bg-primary"
        ><q-card-section
          ><p style="font-size: 30px" class="text-bold text-white text-center">
            {{ oeuvre.nom }}
          </p></q-card-section
        ></q-card
      >
      <div class="row">
        <q-btn
          :to="{ name: 'home' }"
          class="q-ml-md"
          round
          flat
          color="secondary"
          icon="arrow_back_ios"
        />
        <div v-if="user && user.role !== 'part'" class="col row justify-end q-mr-md">
          <q-btn round flat color="secondary" icon="edit" />
          <q-btn @click="archiveOeuvre" round flat color="negative" icon="delete" />
        </div>
      </div>
      <section class="row items-center q-mr-md q-ml-md">
        <div class="col-5">
          <div class="row justify-center">
            <q-img
              style="border-radius: 10px; max-height: 400px; max-width: 400px"
              :src="oeuvre.image"
            />
          </div>
        </div>
        <div class="col">
          <div class="row">
            <p
              class="q-ma-none q-mt-md text-bold q-mr-md q-ml-md"
              style="font-size: 20px"
            >
              {{ artiste.nom }}
            </p>
            <q-avatar>
              <img :src="artiste.image" />
            </q-avatar>
          </div>

          <div class="row items-center">
            <q-separator
              class="col-5"
              color="secondary"
              style="height: 2px"
              spaced
              inset
            />
            <q-badge
              :style="'color:' + oeuvre.type.couleur"
              outline
              :label="oeuvre.type.nom"
            />
            <p class="q-ma-none q-ml-lg text-grey">
              Parue le <strong>{{ oeuvre.date }}</strong>
            </p>
          </div>
          <section class="row items-center">
            <div class="col">
              <p class="q-ma-none q-ml-md q-mt-lg">
                {{ oeuvre.briefDescrition }}
              </p>
            </div>
            <span class="vertical text-grey q-mt-md q-ml-md"></span>
            <div class="col q-mt-lg">
              <p style="font-size: 16px" class="text-center text-bold">Appartenance</p>
              <p style="font-size: 16px" class="text-center text-grey">
                {{ musee.nom }}
              </p>
              <p style="font-size: 16px" class="text-center text-bold">Exposition</p>
              <p style="font-size: 16px" class="text-center text-grey">
                {{ exposition.nom }}
              </p>
            </div>
          </section>
          <div class="row items-center justify-center q-mt-md">
            <p class="text-brown text-bold col-5 q-ma-none" style="font-size: 16px">
              En {{ oeuvre.etat.nom }}
              <span><q-icon :name="oeuvre.etat.icon" /></span>
            </p>
            <q-btn
              @click="detail = true"
              color="secondary"
              class="col-5"
              no-caps
              label="Description détaillée"
            />
          </div>
        </div>
      </section>

      <q-dialog full-height v-model="detail" position="right">
        <q-card class="bg-accent" style="width: 350px">
          <q-card-section class="row items-center">
            <q-btn v-close-popup flat round icon="close" />
            <div style="font-size: 20px" class="text-bold text-primary q-ml-sm">
              Description détailler
            </div>
            <p v-html="oeuvre.description" />
          </q-card-section>
        </q-card>
      </q-dialog>
      <q-expansion-item
        v-if="user.role === 'admin'"
        class="q-mt-sm"
        icon="art_track"
        label="Bibliographie"
        :caption="artiste.nom + ' ' + artiste.prenom"
      >
        <q-card>
          <q-card-section v-html="artiste.bibliographie" />
        </q-card>
      </q-expansion-item>
    </main>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  data() {
    return {
      utils: useQuasar(),
      detail: false,
      oeuvre: null,
      artiste: null,
      exposition: null,
      musee: null,
      id: null,
      user: null,
    };
  },
  async mounted() {
    this.user = this.utils.localStorage.getItem("user");
    let resMusees = await query(collection(fire.firebasebd, "musees"));
    let resArtistes = await query(collection(fire.firebasebd, "artistes"));
    let resOeuvre = await query(collection(fire.firebasebd, "oeuvre"));
    await this.setSnapshot(resMusees);
    await this.setSnapshot(resArtistes);
    await this.setSnapshot(resOeuvre);
  },
  methods: {
    async setSnapshot(q) {
      onSnapshot(q, (snapshot) => {
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
    async refresh() {
      this.oeuvre = null;
      this.artiste = null;
      this.exposition = null;
      this.musee = null;
      let oeuvre = await this.$store.dispatch("fetchOeuvre", {
        id: this.$route.params.index,
      });
      this.id = oeuvre.id;
      this.oeuvre = oeuvre.data();
      let type = await this.$store.dispatch("fecthTypeOeuvre", {
        id: this.oeuvre.type,
      });
      this.oeuvre.type = type;
      this.artiste = await this.$store.dispatch("fetchArtiste", {
        idArtiste: this.oeuvre.idArtiste,
      });
      this.exposition = await this.$store.dispatch("fetchMusee", {
        idMusee: this.oeuvre.idExposition,
      });
      this.musee = await this.$store.dispatch("fetchMusee", {
        idMusee: this.oeuvre.idMuse,
      });
    },
    archiveOeuvre() {
      this.utils
        .dialog({
          title: "Attention !",
          html: true,
          message:
            "Vous etes sur de vouloir archiver l'oeuvre <strong>'" +
            this.oeuvre.nom +
            "'</strong> ?",
          cancel: true,
          persistent: true,
          ok: {
            label: "Archiver",
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
          await this.$store.dispatch("archiveOeuvre", {
            id: this.id,
            oeuvre: this.oeuvre,
          });
          this.utils.loading.hide();
        });
    },
  },
};
</script>

<style>
.vertical {
  border-left: 2px solid;
  height: 250px;
  display: inline-block;
}
</style>
