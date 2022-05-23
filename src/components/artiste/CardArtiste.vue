<template>
  <q-card class="q-pa-lg">
    <div class="row justify-start items-center">
      <div class="col-1">
        <q-avatar>
          <img :src="proArtiste.image" />
        </q-avatar>
      </div>
      <div class="col-1">{{ proArtiste.nom }} {{ proArtiste.prenom }}</div>
      <div class="col-2 row">
        <q-badge
          v-for="(style, index) in proArtiste.style"
          :key="index"
          outline
          :style="'color:' + style.couleur"
          :label="style.nom"
        />
      </div>
      <div class="col" style="width: 250px">
        <q-expansion-item expand-separator label="Bibliographie"
          ><p v-html="proArtiste.bibliographie"></p>
        </q-expansion-item>
      </div>
      <div class="col-4 row justify-end">
        <q-btn @click="edit = true" flat color="secondary" icon="edit" />
        <q-btn @click="deleteArtiste" flat color="negative" icon="delete" />
        <q-btn text-color="primary" color="accent" no-caps label="Voir les oeuvres" />
      </div>
    </div>
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

                <template v-slot:hint> Image(s) de l'oeuvre </template>

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
              <q-checkbox
                class="q-mt-md"
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
      loading: false,
      edit: false,
      artiste: this.proArtiste,
    };
  },
  mounted() {},
  methods: {
    async submit() {
      this.loading = true;
      await this.$store.dispatch("updateArtiste", {
        artiste: this.artiste,
        id: this.id,
      });
      this.loading = false;
      this.edit = false;
    },
    deleteArtiste() {
      this.utils
        .dialog({
          title: "Attention !",
          message:
            "Vous etes sur de vouloir retirer le musée '" + this.artiste.nom + "' ?",
          cancel: true,
          persistent: true,
          ok: {
            label: "Supprimer",
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
          await this.$store.dispatch("deleteArtiste", { id: this.id });
          this.utils.loading.hide();
        });
    },
  },
};
</script>
