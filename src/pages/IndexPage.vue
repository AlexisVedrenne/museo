<template>
  <q-page>
    <q-card class="bg-primary text-white" square>
      <q-card-section class="row items-center"
        ><q-select
          v-if="!this.$route.params.idArtiste"
          class="col-2 q-mr-md"
          color="primary"
          bg-color="secondary"
          filled
          v-model="filtreArtiste"
          :options="artistes"
          label="Choisir un artiste"
          clearable
        >
          <template v-slot:option="artistes">
            <q-item v-bind="artistes.itemProps">
              <q-item-section>
                <q-avatar> <q-img :src="artistes.opt.image" /></q-avatar>
              </q-item-section>
              <q-item-section>
                <q-item-label
                  >{{ artistes.opt.nom + " " + artistes.opt.prenom }}
                </q-item-label>
              </q-item-section>
            </q-item>
          </template></q-select
        ><q-select
          v-if="!this.$route.params.idType"
          class="col-2 q-mr-md"
          color="primary"
          bg-color="secondary"
          filled
          v-model="filtreType"
          :options="types"
          label="Choisir un type d'oeuvre"
          clearable
        >
          <template v-slot:option="types">
            <q-item v-bind="types.itemProps">
              <q-item-section avatar>
                <div
                  :style="
                    'background-color:' +
                    types.opt.couleur +
                    ';border-radius: 30px;width: 40px;height: 40px'
                  "
                ></div>
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ types.opt.nom }}</q-item-label>
              </q-item-section>
            </q-item>
          </template></q-select
        ><q-select
          class="col-2 q-mr-md"
          color="primary"
          bg-color="secondary"
          filled
          v-model="filtreStatus"
          :options="status"
          label="Status"
          clearable
        >
          <template v-slot:option="status">
            <q-item v-bind="status.itemProps">
              <q-item-section avatar>
                <q-icon :name="status.opt.icon" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ status.opt.label }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
        </q-select>
        <div class="column">
          <q-btn @click="filtre" color="info" flat class="q-mr-sm" label="Filtrer" />
          <q-btn
            @click="resetAll"
            flat
            color="negative"
            class="q-mr-sm"
            label="Effacer filtre"
          />
        </div>

        <q-form class="col row" @submit="search">
          <q-input
            @click="resetSearch"
            rounded
            color="secondary"
            bg-color="white"
            outlined
            v-model="recherche"
            class="col q-mr-sm"
            label="Rechercher une oeuvre..."
          >
            <template v-slot:prepend> <q-icon name="search" /> </template
          ></q-input>
          <q-btn type="submit" color="secondary" flat icon="search"
        /></q-form> </q-card-section
    ></q-card>
    <div v-if="this.$route.params.idMusee" class="row">
      <q-btn
        :to="{ name: 'listMusee' }"
        class="q-ml-md"
        round
        flat
        color="secondary"
        icon="arrow_back_ios"
      />
    </div>
    <div v-if="this.$route.params.idType" class="row">
      <q-btn
        :to="{ name: 'ListTypeOeuvre' }"
        class="q-ml-md"
        round
        flat
        color="secondary"
        icon="arrow_back_ios"
      />
    </div>
    <div v-if="this.$route.params.idArtiste" class="row">
      <q-btn
        :to="{ name: 'ListeArtiste' }"
        class="q-ml-md"
        round
        flat
        color="secondary"
        icon="arrow_back_ios"
      />
    </div>
    <div class="row justify-center q-mt-md">
      <q-badge outline color="info" class="q-mr-sm" v-if="filtreArtiste"
        ><q-avatar><q-img :src="filtreArtiste.image" /></q-avatar
      ></q-badge>
      <q-badge
        outline
        class="q-mr-sm"
        :style="'color:' + filtreType.couleur"
        v-if="filtreType"
        :label="filtreType.nom"
      />
      <q-badge outline color="info" v-if="filtreStatus"
        ><q-avatar><q-icon :name="filtreStatus.icon" /></q-avatar
      ></q-badge>
    </div>
    <div v-if="oeuvres" class="row q-col-gutter-md q-ma-sm">
      <q-intersection
        once
        transition="scale"
        class="col-4"
        v-for="(oeuvre, index) in oeuvres.docs"
        :key="index"
      >
        <div v-if="user.role !== 'part'">
          <CardPainting
            @detail="detail(index)"
            :index="index"
            :id="oeuvre.id"
            :proOeuvre="oeuvre.data()"
          />
        </div>
        <div v-else>
          <CardOeuvrePartenaire
            @detail="detail(index)"
            :index="index"
            :proOeuvre="oeuvre.data()"
          />
        </div>
      </q-intersection>
      <div class="col" v-if="oeuvres.docs.length === 0">
        <p class="text-center text-grey q-mt-lg" style="font-size: 18px">
          Aucune oeuvres n'a été trouvé...
        </p>
      </div>
    </div>
    <div class="row justify-center q-mt-lg" v-else>
      <q-spinner-puff color="primary" size="50px" />
    </div>
    <div v-if="user">
      <q-page-sticky
        v-if="!this.$route.params.idMusee && user.role !== 'part'"
        style="z-index: 2"
        position="bottom-right"
        :offset="[18, 18]"
      >
        <q-btn :to="{ name: 'ajoutOeuvre' }" fab icon="add" color="secondary" />
      </q-page-sticky>
    </div>
  </q-page>
</template>

<script>
import { collection, getDocs, query, onSnapshot, where } from "firebase/firestore";
import fire from "src/boot/Firebase";
import CardPainting from "components/Oeuvres/CardPainting.vue";
import CardOeuvrePartenaire from "components/Oeuvres/CardOeuvrePartenaire.vue";
import { useQuasar } from "quasar";
import { ref } from "vue";
export default {
  name: "IndexPage",
  components: { CardPainting, CardOeuvrePartenaire },
  data() {
    return {
      save: null,
      utils: useQuasar(),
      recherche: "",
      filtreStatus: ref(null),
      filtreType: ref(null),
      filtreArtiste: ref(null),
      oeuvres: null,
      user: null,
      types: [],
      artistes: [],
      status: [
        {
          label: "exposition",
          value: "exposition",
          icon: "filter_frames",
        },
        {
          label: "stock",
          icon: "inventory_2",
          value: "stock",
        },
        {
          label: "prét",
          icon: "real_estate_agent",
          value: "prét",
        },
        {
          label: "restauration",
          icon: "brush",
          value: "restauration",
        },
      ],
    };
  },
  async mounted() {
    this.user = this.utils.localStorage.getItem("user");
    if (this.$route.params.idMusee) {
      await this.snapshotByMusee();
    } else if (this.$route.params.idType) {
      await this.snapshotByType();
    } else if (this.$route.params.idArtiste) {
      await this.snapshotByArtiste();
    } else {
      await this.refresh();
      await this.snapshot();
    }
  },
  methods: {
    async search() {
      await this.resetSearch();
      let oeuvres = this.oeuvres;
      let res = [];
      oeuvres.docs.forEach((oeuvre) => {
        let data = oeuvre.data();
        if (data.nom.trim().toLowerCase().includes(this.recherche.trim().toLowerCase())) {
          res.push(oeuvre);
        }
      });
      this.oeuvres = { docs: res };
    },
    async resetSearch() {
      if (this.$route.params.idMusee) {
        await this.refreshByMusee();
      } else if (this.$route.params.idType) {
        await this.refreshByType();
      } else if (this.$route.params.idArtiste) {
        await this.refreshByArtiste();
      } else {
        await this.refresh();
      }
      await this.filtre();
    },
    async resetAll() {
      this.filtreArtiste = ref(null);
      this.filtreStatus = ref(null);
      this.filtreType = ref(null);
      if (this.$route.params.idMusee) {
        await this.refreshByMusee();
      } else if (this.$route.params.idType) {
        await this.refreshByType();
      } else if (this.$route.params.idArtiste) {
        await this.refreshByArtiste();
      } else {
        await this.refresh();
      }
    },
    async filtre() {
      if (this.filtreArtiste && this.filtreType && this.filtreStatus) {
        await this.refreshByArtiste(this.filtreArtiste.value);
        this.oeuvres = this.filtreLocal(this.oeuvres, this.filtreType.value, "type");
        this.oeuvres = this.filtreLocal(this.oeuvres, this.filtreStatus.value, "status");
      } else if (this.filtreArtiste && this.filtreType) {
        await this.refreshByArtiste(this.filtreArtiste.value);
        this.oeuvres = this.filtreLocal(this.oeuvres, this.filtreType.value, "type");
      } else if (this.filtreArtiste && this.filtreStatus) {
        await this.refreshByArtiste(this.filtreArtiste.value);
        this.oeuvres = this.filtreLocal(this.oeuvres, this.filtreStatus.value, "status");
      } else if (this.filtreType && this.filtreStatus) {
        await this.refreshByType(this.filtreType.value);
        this.oeuvres = this.filtreLocal(this.oeuvres, this.filtreStatus.value, "status");
      } else if (this.filtreArtiste) {
        await this.refreshByArtiste(this.filtreArtiste.value);
      } else if (this.filtreType) {
        await this.refreshByType(this.filtreType.value);
      } else if (this.filtreStatus) {
        await this.refresh();
        this.oeuvres = this.filtreLocal(this.oeuvres, this.filtreStatus.value, "status");
      }
    },
    filtreLocal(oeuvres, filtre, typeFiltre) {
      let reStatus = [];
      oeuvres.docs.forEach((oeuvre) => {
        let data = oeuvre.data();
        if (
          (typeFiltre === "status"
            ? data.etat.nom.trim()
            : typeFiltre === "type"
            ? data.type.trim()
            : "") === filtre.trim()
        ) {
          reStatus.push(oeuvre);
        }
      });
      let oeuvre = { docs: reStatus };
      return oeuvre;
    },
    async refreshOptions() {
      let types = await this.$store.dispatch("fetchAllTypeOeuvre");
      let artistes = await this.$store.dispatch("fetchAllArtist");
      types.docs.forEach((type) => {
        let data = type.data();
        if (!this.types.find((element) => element.nom === data.nom)) {
          data.value = type.id;
          this.types.push(data);
        }
      });
      artistes.forEach((artiste) => {
        let data = artiste.data();
        if (!this.artistes.find((element) => element.nom === data.nom)) {
          data.value = artiste.id;
          this.artistes.push(data);
        }
      });
    },
    async refresh() {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchAllOeuvres");
    },
    async refreshByArtiste(id) {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByArtiste", {
        idArtiste: id,
      });
    },
    async refreshByMusee() {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByMusee", {
        idMusee: this.$route.params.idMusee,
      });
    },
    async refreshByType(id) {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByType", {
        idType: id,
      });
    },
    async snapshotByType() {
      let res = await query(
        collection(fire.firebasebd, "oeuvre"),
        where("type", "==", this.$route.params.idType)
      );
      onSnapshot(res, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            await this.refreshByType(this.$route.params.idType);
          }
          if (change.type === "modified") {
            await this.refreshByType(this.$route.params.idType);
          }
          if (change.type === "removed") {
            await this.refreshByType(this.$route.params.idType);
          }
        });
      });
    },
    async snapshotByArtiste() {
      let res = await query(
        collection(fire.firebasebd, "oeuvre"),
        where("idArtiste", "==", this.$route.params.idArtiste)
      );
      onSnapshot(res, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            await this.refreshByArtiste(this.$route.params.idArtiste);
          }
          if (change.type === "modified") {
            await this.refreshByArtiste(this.$route.params.idArtiste);
          }
          if (change.type === "removed") {
            await this.refreshByArtiste(this.$route.params.idArtiste);
          }
        });
      });
    },
    async snapshotByMusee() {
      let res = await query(
        collection(fire.firebasebd, "oeuvre"),
        where("idExposition", "==", this.$route.params.idMusee)
      );
      onSnapshot(res, (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
          if (change.type === "added") {
            await this.refreshByMusee();
          }
          if (change.type === "modified") {
            await this.refreshByMusee();
          }
          if (change.type === "removed") {
            await this.refreshByMusee();
          }
        });
      });
    },
    async snapshot() {
      let res = await query(collection(fire.firebasebd, "oeuvre"));
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
    detail(index) {
      this.$router.push("/oeuvre/" + index);
    },
  },
};
</script>
