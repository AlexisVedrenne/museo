<template>
  <q-page>
    <q-card square class="bg-primary text-white"
      ><q-card-section
        ><p v-if="user" class="text-center text-bold" style="font-size: 30px">
          {{
            this.$route.params.id
              ? "Emprunts du musée " + user.nom
              : "Mes emprunts"
          }}
        </p></q-card-section
      ></q-card
    >
    <div v-if="this.$route.params.id" class="row">
      <q-btn
        :to="{ name: 'listeComptePartenaire' }"
        class="q-ml-md"
        round
        flat
        color="secondary"
        icon="arrow_back_ios"
      />
    </div>
    <div v-if="emprunts">
      <q-intersection
        transition="scale"
        v-for="(emprunt, index) in emprunts.docs"
        :key="index"
        class="q-ma-md"
      >
        <CardEmprunt :id="emprunt.id" :emprunt="emprunt.data()" />
      </q-intersection>
      <div v-if="emprunts.docs.length === 0">
        <p class="text-grey text-center q-mt-md">
          Aucune oeuvre(s) empruntée(s) pour le moment...
        </p>
      </div>
    </div>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import CardEmprunt from "components/demande/CardEmprunt.vue";
import { collection, query, onSnapshot, where } from "firebase/firestore";
import fire from "src/boot/Firebase";
export default {
  components: {
    CardEmprunt,
  },
  data() {
    return {
      utils: useQuasar(),
      user: null,
      emprunts: null,
    };
  },
  async mounted() {
    let user = null;
    if (!this.$route.params.id) {
      await this.$store.dispatch("fetchUserInfo");
      user = this.utils.localStorage.getItem("user");
      if (user.role === "part") {
        if (user.etat === false) {
          await this.$store.dispatch("signLeft");
          this.$router.push("connexion");
        }
      }
    } else {
      user = await this.$store.dispatch("fetchUserInfosById", {
        id: this.$route.params.id,
      });
      this.user = user;
    }
    let res = await await query(
      collection(fire.firebasebd, "demande"),
      where("idUser", "==", user.uid)
    );
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
      this.emprunts = null;
      let emprunts = null;
      if (!this.$route.params.id) {
        emprunts = await this.$store.dispatch("fetchAllEmprunt");
      } else {
        emprunts = await this.$store.dispatch("fetchEmpruntById", {
          id: this.$route.params.id,
        });
      }

      this.emprunts = emprunts;
    },
  },
};
</script>
