<template>
  <q-page>
    <q-card square class="bg-primary"
      ><q-card-section
        ><p class="text-white text-center text-bold" style="font-size: 30px">
          Liste des Artistes
        </p></q-card-section
      ></q-card
    >
    <main v-if="artistes">
      <q-intersection
        transition="scale"
        v-for="(artiste, index) in artistes"
        :key="index"
        class="q-ma-md"
      >
        <CardArtiste />
      </q-intersection>
      <div v-if="artistes.length == 0">
        <p class="text-grey text-center q-mt-lg">Aucun artiste(s) trouvés...</p>
      </div>
    </main>
  </q-page>
</template>

<script>
import CardArtiste from "components/artiste/CardArtiste.vue";
import { collection, getDocs, query, onSnapshot } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardArtiste,
  },
  data() {
    return {
      artistes: [],
    };
  },
  async mounted() {
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
      let artistes = await this.$store.dispatch("fetchAllArtist");
      this.artistes = artistes.docs;
    },
  },
};
</script>
