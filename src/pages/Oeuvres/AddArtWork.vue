<template>
  <q-page class="q-pa-lg">
    <q-form @submit="submit">
      <div class="row">
        <div class="col-6">
          <div class="q-gutter-y-md" style="max-width: 400px; margin-left: 120px">
            <q-input
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Entrez un nom.']"
              color="secondary"
              v-model="oeuvre.nom"
              label="Nom de l'oeuvre"
            >
              <template v-slot:before>
                <q-icon name="vrpano" />
              </template>
            </q-input>
            <q-select
              lazy-rules
              :rules="[(val) => val || 'Selectionner un type.']"
              color="secondary"
              v-model="type"
              :options="typeOptions"
              label="Type"
            >
              <template v-slot:before>
                <q-icon name="description" />
              </template>
            </q-select>
            <q-input
              lazy-rules
              :rules="[(val) => (val && val.length > 0) || 'Entrez une date.']"
              v-model="oeuvre.date"
              type="date"
              color="secondary"
              hint="Date de l'oeuvre"
            >
              <template v-slot:before>
                <q-icon name="edit_calendar" />
              </template>
            </q-input>
            <q-select
              lazy-rules
              :rules="[(val) => val || 'Selectionner un artiste.']"
              color="secondary"
              v-model="artiste"
              :options="artisteOptions"
              label="Artiste"
            >
              <template v-slot:before>
                <q-icon name="person" />
              </template>
            </q-select>
            <q-file
              v-if="oeuvre.image === null"
              lazy-rules
              :rules="[(val) => val || 'Choisir une image.']"
              accept="image/*"
              color="secondary"
              bottom-slots
              v-model="oeuvre.image"
              counter
            >
              <template v-slot:before>
                <q-icon name="folder_open" />
              </template>

              <template v-slot:hint> Image(s) de l'oeuvre </template>

              <template v-slot:append>
                <q-btn round dense flat icon="add" @click.stop />
              </template>
            </q-file>
            <div v-else class="row justify-center">
              <q-btn
                @click="oeuvre.image = null"
                flat
                color="negative"
                label="Changer l'image"
              />
            </div>
          </div>
        </div>
        <div class="col-6">
          <div class="q-gutter-y-md column" style="max-width: 400px; margin-left: 120px">
            <q-select
              lazy-rules
              :rules="[(val) => val || 'Choisir un musée']"
              color="secondary"
              v-model="musee"
              :options="museeOptions"
              label="Musée d'apartenance"
            >
              <template v-slot:before>
                <q-icon name="account_balance" />
              </template>
            </q-select>
            <q-select
              lazy-rules
              :rules="[(val) => val || 'Choisir un musée.']"
              color="secondary"
              v-model="expo"
              :options="museeOptions"
              label="Musée d'expostion"
            >
              <template v-slot:before>
                <q-icon name="account_balance" />
              </template>
            </q-select>
            <q-select
              lazy-rules
              :rules="[(val) => val || 'Spécifier son etat']"
              color="secondary"
              v-model="etat"
              :options="etatOptions"
              label="Etat de l'oeuvre"
            >
              <template v-slot:before>
                <q-icon name="account_balance" />
              </template>
            </q-select>
            <div class="q-pa-md" style="max-width: 400px">
              <q-input
                lazy-rules
                :rules="[
                  (val) => (val && val.length > 0) || 'Ecire une courte description.',
                ]"
                color="secondary"
                v-model="oeuvre.briefDescrition"
                filled
                type="textarea"
                label="Description brève"
              />
            </div>
          </div>
        </div>
      </div>
      <p class="text-grey">Description détailler</p>
      <div class="q-pa-md row justify-center">
        <q-editor
          class="col"
          v-model="oeuvre.description"
          min-height="5rem"
          :dense="utils.screen.lt.md"
          :toolbar="[
            [
              {
                label: utils.lang.editor.align,
                icon: utils.iconSet.editor.align,
                fixedLabel: true,
                list: 'only-icons',
                options: ['left', 'center', 'right', 'justify'],
              },
              {
                label: utils.lang.editor.align,
                icon: utils.iconSet.editor.align,
                fixedLabel: true,
                options: ['left', 'center', 'right', 'justify'],
              },
            ],
            ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
            ['token', 'hr', 'link', 'custom_btn'],
            ['print', 'fullscreen'],
            [
              {
                label: utils.lang.editor.formatting,
                icon: utils.iconSet.editor.formatting,
                list: 'no-icons',
                options: ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'code'],
              },
              {
                label: utils.lang.editor.fontSize,
                icon: utils.iconSet.editor.fontSize,
                fixedLabel: true,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'size-1',
                  'size-2',
                  'size-3',
                  'size-4',
                  'size-5',
                  'size-6',
                  'size-7',
                ],
              },
              {
                label: utils.lang.editor.defaultFont,
                icon: utils.iconSet.editor.font,
                fixedIcon: true,
                list: 'no-icons',
                options: [
                  'default_font',
                  'arial',
                  'arial_black',
                  'comic_sans',
                  'courier_new',
                  'impact',
                  'lucida_grande',
                  'times_new_roman',
                  'verdana',
                ],
              },
              'removeFormat',
            ],
            ['quote', 'unordered', 'ordered', 'outdent', 'indent'],

            ['undo', 'redo'],
            ['viewsource'],
          ]"
          :fonts="{
            arial: 'Arial',
            arial_black: 'Arial Black',
            comic_sans: 'Comic Sans MS',
            courier_new: 'Courier New',
            impact: 'Impact',
            lucida_grande: 'Lucida Grande',
            times_new_roman: 'Times New Roman',
            verdana: 'Verdana',
          }"
        />
      </div>
      <q-page-sticky position="bottom-left" :offset="[18, 18]">
        <q-btn size="20px" icon="close" color="negative" round :to="{ name: 'home' }" />
      </q-page-sticky>
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          :loading="loading"
          size="20px"
          icon="done"
          color="positive"
          round
          type="submit"
        />
      </q-page-sticky>
    </q-form>
  </q-page>
</template>
<script>
import { ref } from "vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
import { useQuasar } from "quasar";
export default {
  data() {
    return {
      utils: useQuasar(),
      id: null,
      loading: false,
      museeOptions: [],
      artisteOptions: [],
      typeOptions: [],
      type: "",
      artiste: "",
      musee: "",
      expo: "",
      etat: "",
      etatOptions: [
        {
          label: "exposition",
          value: { icon: "filter_frames", nom: "exposition" },
        },
        {
          label: "stock",
          value: { icon: "inventory_2", nom: "stock" },
        },
        {
          label: "prét",
          value: { icon: "real_estate_agent", nom: "prét" },
        },
        {
          label: "restauration",
          value: { icon: "brush", nom: "restauration" },
        },
      ],
      oeuvre: {
        nom: "",
        type: "",
        date: "",
        idArtiste: "",
        image: null,
        idMuse: "",
        idExposition: "",
        etat: "",
        description: "",
        briefDescrition: "",
      },
    };
  },
  async mounted() {
    if (this.$route.params.index) {
      this.oeuvre = null;
      let oeuvre = await this.$store.dispatch("fetchOeuvre", {
        index: this.$route.params.index,
      });
      this.id = oeuvre.id;
      this.oeuvre = oeuvre.data();
      let artiste = await this.$store.dispatch("fetchArtiste", {
        idArtiste: this.oeuvre.idArtiste,
      });
      let musee = await this.$store.dispatch("fetchMusee", {
        idMusee: this.oeuvre.idMuse,
      });
      let expo = await this.$store.dispatch("fetchMusee", {
        idMusee: this.oeuvre.idExposition,
      });
      this.artiste = {
        label: artiste.nom + " " + artiste.prenom,
        value: this.oeuvre.idArtiste,
      };
      this.type = {
        label: this.oeuvre.type.nom,
        value: { nom: this.oeuvre.type.nom, couleur: this.oeuvre.type.couleur },
      };
      this.etat = {
        label: this.oeuvre.etat.nom,
        value: { icon: this.oeuvre.etat.icon, nom: this.oeuvre.etat.nom },
      };
      this.musee = { label: musee.nom, value: this.oeuvre.idMuse };
      this.expo = { label: expo.nom, value: this.oeuvre.idExposition };
    }
    await this.initMultiposte();
  },
  methods: {
    async setSnapshot(q, collection) {
      onSnapshot(q, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            collection === "musee"
              ? await this.optionsMusee()
              : collection === "artiste"
              ? await this.optionsArtitste()
              : await this.optionsType();
          }
          if (change.type === "modified") {
            collection === "musee"
              ? await this.optionsMusee()
              : collection === "artiste"
              ? await this.optionsArtitste()
              : await this.optionsType();
          }
          if (change.type === "removed") {
            collection === "musee"
              ? await this.optionsMusee()
              : collection === "artiste"
              ? await this.optionsArtitste()
              : await this.optionsType();
          }
        });
      });
    },
    async initMultiposte() {
      let resMusees = await query(collection(fire.firebasebd, "musees"));
      let resArtistes = await query(collection(fire.firebasebd, "artistes"));
      let resType = await query(collection(fire.firebasebd, "typeOeuvre"));
      await this.setSnapshot(resMusees, "musee");
      await this.setSnapshot(resArtistes, "artiste");
      await this.setSnapshot(resType, "type");
    },
    async optionsType() {
      this.typeOptions = [];
      let resTypeOeuvre = await this.$store.dispatch("fetchAllTypeOeuvre");
      resTypeOeuvre.docs.forEach((doc) => {
        let data = doc.data();
        this.typeOptions.push({
          label: data.nom,
          value: { nom: data.nom, couleur: data.couleur },
        });
      });
    },
    async submit() {
      this.loading = true;
      this.oeuvre.type = this.type.value;
      this.oeuvre.idArtiste = this.artiste.value;
      this.oeuvre.idExposition = this.expo.value;
      this.oeuvre.idMuse = this.musee.value;
      this.oeuvre.etat = this.etat.value;
      if (this.$route.params.index) {
        await this.$store.dispatch("updateOeuvre", {
          id: this.id,
          oeuvre: this.oeuvre,
        });
      } else {
        await this.$store.dispatch("addOeuvre", { oeuvre: this.oeuvre });
      }

      this.loading = false;
      this.$router.push({ name: "home" });
    },
    async optionsMusee() {
      this.museeOptions = [];
      let resMusees = await this.$store.dispatch("fetchAllMusee");
      resMusees.docs.forEach((doc) => {
        let data = doc.data();
        if (!this.museeOptions.find((element) => element.label === data.nom)) {
          this.museeOptions.push({ label: data.nom, value: doc.id });
        }
      });
    },
    async optionsArtitste() {
      this.artisteOptions = [];
      let resArtistes = await this.$store.dispatch("fetchAllArtist");
      resArtistes.docs.forEach((doc) => {
        let data = doc.data();
        this.artisteOptions.push({
          label: data.nom + " " + data.prenom,
          value: doc.id,
        });
      });
    },
  },
};
</script>
