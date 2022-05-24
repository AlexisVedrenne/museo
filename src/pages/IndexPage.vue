<template>
  <q-page>
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
    async refresh() {
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchAllOeuvres");
    },
    async refreshByArtiste() {
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByArtiste", {
        idArtiste: this.$route.params.idArtiste,
      });
    },
    async refreshByMusee() {
      this.oeuvres = null;
      this.oeuvres = await this.$store.dispatch("fetchOeuvreByMusee", {
        idMusee: this.$route.params.idMusee,
      });
    },
    async refreshByType() {
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
