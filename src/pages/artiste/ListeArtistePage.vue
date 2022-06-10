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
          once
          transition="scale"
          v-for="(artiste, index) in artistes"
          :key="index"
          class="q-ma-md"
        >
          <CardArtiste :id="res.docs[index].id" :proArtiste="artiste" />
        </q-intersection>

        <div v-if="artistes.length == 0">
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
      full-width
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
              <div class="col">
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
                  ><template v-slot:prepend> <q-icon name="person" /> </template
                ></q-input>
                <q-input
                  lazy-rules
                  :rules="[
                    (val) =>
                      (val && val.length > 0) ||
                      'Le prenom du artiste doit être saisie !',
                  ]"
                  v-model="artiste.prenom"
                  color="secondary"
                  class="col q-mr-md"
                  label="Prénom"
                  ><template v-slot:prepend> <q-icon name="person" /> </template
                ></q-input>
              </div>
              <div class="col">
                <q-file
                  v-if="artiste.image === null"
                  lazy-rules
                  :rules="[(val) => val || 'Choisir une image.']"
                  accept="image/*"
                  color="secondary"
                  bottom-slots
                  v-model="artiste.image"
                  counter
                >
                  <template v-slot:before>
                    <q-icon name="wallpaper" />
                  </template>

                  <template v-slot:hint> Image de l'artiste </template>

                  <template v-slot:append>
                    <q-btn round dense flat icon="add" @click.stop />
                  </template>
                </q-file>
                <div v-else class="row justify-center">
                  <q-btn
                    @click="artiste.image = null"
                    flat
                    color="negative"
                    label="Changer l'image"
                  />
                </div>
                <div class="row justify-center">
                  <q-checkbox
                    class="q-mt-md q-mr-sm"
                    v-for="(type, index) in types"
                    :key="index"
                    dense
                    v-model="artiste.style"
                    :val="type"
                    :label="type.nom"
                    :style="'color:' + type.couleur"
                  />
                </div>
              </div>
            </div>
            <q-editor
              class="col"
              v-model="artiste.bibliographie"
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
import CardArtiste from "components/artiste/CardArtiste.vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
import { useQuasar } from "quasar";
export default {
  components: {
    CardArtiste,
  },
  data() {
    return {
      utils: useQuasar(),
      types: [],
      add: false,
      loading: false,
      artistes: null,
      res: null,
      artiste: {
        nom: "",
        prenom: "",
        image: null,
        style: [],
        bibliographie: "",
        idOeuvre: [],
        archiver: false,
      },
    };
  },
  async mounted() {
    await this.refresh();
    let types = await this.$store.dispatch("fetchAllTypeOeuvre");
    types.docs.forEach((type) => {
      let temp = type.data();
      this.types.push(temp);
    });
    let res = await query(collection(fire.firebasebd, "artistes"));
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
      for (let i = 0; i < this.res.docs.length; i++) {
        artistes.push(this.res.docs[i].data());
      }
      this.artistes = Object.values(artistes);
    },
    async submit() {
      this.loading = true;
      await this.$store.dispatch("addArtiste", { artiste: this.artiste });
      this.loading = false;
      this.add = false;
      this.artiste = {
        nom: "",
        prenom: "",
        image: null,
        style: [],
        bibliographie: "",
        idOeuvre: [],
        archiver: false,
      };
    },
  },
};
</script>
