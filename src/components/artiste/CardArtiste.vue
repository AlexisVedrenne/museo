<template>
  <q-card class="q-pa-lg">
    <div class="row justify-start items-center">
      <div class="col-1">
        <q-avatar>
          <img :src="proArtiste.image" />
        </q-avatar>
      </div>
      <div class="col">{{ proArtiste.nom }} {{ proArtiste.prenom }}</div>
      <div class="col row items-center">
        <q-badge
          class="q-mr-sm q-mb-sm"
          v-for="(style, index) in proArtiste.style"
          :key="index"
          outline
          :style="'color:' + style.couleur"
          :label="style.nom"
        />
      </div>
      <div class="col-4 row justify-end">
        <q-btn
          color="info"
          flat
          v-if="proArtiste.archiver"
          @click="active"
          label="Activer"
        />
        <q-btn @click="edit = true" flat color="secondary" icon="edit" />
        <q-btn
          :disable="proArtiste.archiver"
          @click="deleteArtiste"
          flat
          color="negative"
          icon="delete"
        />
        <q-btn
          :to="'/artiste/oeuvre/' + id"
          text-color="primary"
          color="accent"
          no-caps
          label="Voir les oeuvres"
        />
      </div>
    </div>
    <q-expansion-item
      class="q-mt-sm"
      icon="art_track"
      label="Bibliographie"
      expand-separator
      ><p v-html="proArtiste.bibliographie"></p>
    </q-expansion-item>
  </q-card>
  <q-dialog
    transition-show="flip-down"
    transition-hide="flip-up"
    persistent
    v-model="edit"
    full-width
  >
    <q-card style="width: 500px">
      <q-card-section class="row items-center q-pb-none">
        <div class="text-h6">Modification d'un artiste</div>
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
                    (val && val.length > 0) || 'Le prenom du artiste doit être saisie !',
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
              </q-file>
              <div v-else class="row justify-center">
                <q-btn
                  @click="artiste.image = null"
                  flat
                  color="negative"
                  label="Changer l'image"
                />
              </div>
              <q-file
                v-if="artiste.audio === null"
                lazy-rules
                :rules="[(val) => val || 'Choisir un fichier audio']"
                accept="audio/*"
                color="secondary"
                bottom-slots
                v-model="artiste.audio"
                counter
              >
                <template v-slot:before>
                  <q-icon name="audio_file" />
                </template>

                <template v-slot:hint> Description audio de l'artiste </template>
              </q-file>
              <div v-else class="row justify-center">
                <q-btn
                  @click="artiste.audio = null"
                  flat
                  color="negative"
                  label="Changer le fichier audio"
                />
              </div>
              <div class="column items-center">
                <div class="row q-mt-md">
                  <q-badge
                    v-ripple
                    class="q-mr-sm cursor-pointer q-hoverable"
                    @click="deleteStyle(index)"
                    v-for="(sty, index) in artiste.style"
                    :key="index"
                    :label="sty.nom"
                  />
                </div>
                <div class="row">
                  <div v-for="(type, index) in types" :key="index">
                    <q-checkbox
                      class="q-mt-md"
                      dense
                      v-model="style"
                      :val="type"
                      :label="type.nom"
                      :style="'color:' + type.couleur"
                    />
                  </div>
                </div>
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
              style="border-radius: 10px"
              label="Modifier"
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
import { useQuasar } from "quasar";
export default {
  props: {
    id: {
      type: String,
    },
    proArtiste: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      utils: useQuasar(),
      style: [],
      types: [],
      loading: false,
      edit: false,
      artiste: this.proArtiste,
    };
  },
  async mounted() {
    let types = await this.$store.dispatch("fetchAllTypeOeuvre");
    types.docs.forEach((type) => {
      let temp = type.data();
      this.types.push(temp);
    });
  },
  methods: {
    deleteStyle(index) {
      this.artiste.style.splice(1, index);
    },
    async submit() {
      this.loading = true;
      this.style.forEach((sty) => {
        if (!this.artiste.style.find((val) => val.nom === sty.nom)) {
          this.artiste.style.push(sty);
        }
      });
      await this.$store.dispatch("updateArtiste", {
        artiste: this.artiste,
        id: this.id,
      });
      this.loading = false;
      this.edit = false;
    },
    async active() {
      this.utils.loading.show();
      await this.$store.dispatch("activeArtiste", {
        id: this.id,
        artiste: this.artiste,
      });
      this.utils.loading.hide();
    },
    deleteArtiste() {
      this.utils
        .dialog({
          title: "Attention !",
          html: true,
          message:
            "Vous etes sur de vouloir désactiver l'artiste <strong>'" +
            this.artiste.nom +
            "'</strong> et d'archiver toutes ses oeuvres ?",
          cancel: true,
          persistent: true,
          ok: {
            label: "Désactiver",
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
          await this.$store.dispatch("deleteArtiste", {
            id: this.id,
            artiste: this.artiste,
          });
          this.utils.loading.hide();
        });
    },
  },
};
</script>
