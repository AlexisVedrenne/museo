<template>
  <q-page>
    <q-card class="bg-primary text-white" square
      ><q-card-section class="row items-center"
        ><q-select
          class="col-2 q-mr-md"
          color="accent"
          bg-color="secondary"
          filled
          v-model="sss"
          :options="artistes"
          label="Choisir un artiste"
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
          class="col-2 q-mr-md"
          color="accent"
          bg-color="secondary"
          filled
          v-model="model"
          :options="types"
          label="Choisir un type d'oeuvre"
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
          color="accent"
          bg-color="secondary"
          filled
          v-model="model"
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
        <q-input
          color="secondary"
          bg-color="white"
          outlined
          v-model="text"
          class="col q-mr-sm"
          label="Rechercher une oeuvre..."
        >
          <template v-slot:prepend> <q-icon name="search" /> </template
        ></q-input>
        <q-btn color="secondary" flat icon="search" /> </q-card-section
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
    <div v-if="oeuvres" class="row q-col-gutter-md q-ma-sm">
      <q-intersection
        once
        transition="scale"
        class="col-4"
        v-for="(oeuvre, index) in oeuvres.docs"
        :key="index"
      >
        <CardPainting
          @detail="detail(index)"
          :index="index"
          :id="oeuvre.id"
          :proOeuvre="oeuvre.data()"
        />
      </q-intersection>
    </div>
    <div v-else>
      <p class="text-center text-grey q-mt-lg" style="font-size: 18px">
        Aucune oeuvres n'a été trouvé...
      </p>
    </div>

    <q-page-sticky
      v-if="!this.$route.params.idMusee"
      style="z-index: 2"
      position="bottom-right"
      :offset="[18, 18]"
    >
      <q-btn :to="{ name: 'ajoutOeuvre' }" fab icon="add" color="secondary" />
    </q-page-sticky>
  </q-page>
</template>

<script>
import { collection, getDocs, query, onSnapshot, where } from "firebase/firestore";
import fire from "src/boot/Firebase";
import CardPainting from "components/Oeuvres/CardPainting.vue";
import { useQuasar } from "quasar";
export default {
  name: "IndexPage",
  components: { CardPainting },
  data() {
    return {
      utils: useQuasar(),
      oeuvres: null,
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
    if (this.$route.params.idMusee) {
      await this.snapshotByMusee();
    } else if (this.$route.params.idType) {
      await this.snapshotByType();
    } else if (this.$route.params.idArtiste) {
      await this.snapshotByArtiste();
    } else {
      await this.snapshot();
    }
  },
  methods: {
    async refreshOptions() {
      let types = await this.$store.dispatch("fetchAllTypeOeuvre");
      let artistes = await this.$store.dispatch("fetchAllArtist");
      types.docs.forEach((type) => {
        let data = type.data();
        if (!this.types.find((element) => element.nom === data.nom)) {
          this.types.push(data);
        }
      });
      artistes.forEach((artiste) => {
        let data = artiste.data();
        if (!this.artistes.find((element) => element.nom === data.nom)) {
          this.artistes.push(data);
        }
      });
    },
    async refresh() {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchAllOeuvres");
    },
    async refreshByArtiste() {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByArtiste", {
        idArtiste: this.$route.params.idArtiste,
      });
    },
    async refreshByMusee() {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByMusee", {
        idMusee: this.$route.params.idMusee,
      });
    },
    async refreshByType() {
      await this.refreshOptions();
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByType", {
        idType: this.$route.params.idType,
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
            await this.refreshByType();
          }
          if (change.type === "modified") {
            await this.refreshByType();
          }
          if (change.type === "removed") {
            await this.refreshByType();
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
            await this.refreshByArtiste();
          }
          if (change.type === "modified") {
            await this.refreshByArtiste();
          }
          if (change.type === "removed") {
            await this.refreshByArtiste();
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
