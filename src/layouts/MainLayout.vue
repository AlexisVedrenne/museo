<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <div v-if="user">
          <q-btn
            v-if="user.role !== 'visiteur'"
            flat
            dense
            round
            icon="menu"
            aria-label="Menu"
            @click="toggleLeftDrawer"
          />
        </div>

        <q-toolbar-title v-if="user">
          {{ !user.role === "1" ? "2istrateur" : user.nom }}
          <q-avatar> <q-img src="~assets/logoMuseoBlanc.png" /> </q-avatar
        ></q-toolbar-title>
      </q-toolbar>
    </q-header>

    <div v-if="user">
      <q-drawer
        v-if="user.role !== 'visiteur'"
        v-model="leftDrawerOpen"
        show-if-above
        bordered
      >
        <q-list>
          <q-item-label header>
            <div class="row justify-center q-pa-md">
              <q-img
                src="~assets/logoMuseo.png"
                loading="lazy"
                spinner-color="white"
                height="140px"
                style="max-width: 150px"
              />

              <q-btn
                @click="left"
                class="q-mt-md"
                flat
                style="color: #e69138"
                label="Deconnexion"
              />
            </div>
          </q-item-label>
          <div v-for="link in essentialLinks" :key="link.title">
            <EssentialLink
              v-if="link.type === type || link.type === 'all'"
              v-bind="link"
            />
          </div>
        </q-list>
      </q-drawer>
    </div>
    <q-page-container>
      <transition
        :enter-active-class="
          this.$route.name === 'detailOeuvre'
            ? 'animated slideInLeft'
            : 'animated slideInDown'
        "
        :leave-active-class="
          this.$route.name === 'detailOeuvre'
            ? 'animated slideOutLeft'
            : 'animated slideOutDown'
        "
        appear
        :duration="2000"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";
import { useQuasar } from "quasar";
const linksList = [
  {
    title: "Oeuvres",
    caption: "",
    icon: "vrpano",
    link: { name: "home" },
    type: "all",
  },
  {
    title: "Types oeuvres",
    caption: "",
    icon: "description",
    link: { name: "ListTypeOeuvre" },
    type: "2",
  },
  {
    title: "Artistes",
    caption: "",
    icon: "person",
    link: { name: "ListeArtiste" },
    type: "2",
  },

  {
    title: "Musées",
    caption: "",
    icon: "account_balance",
    link: { name: "listMusee" },
    type: "2",
  },
  {
    title: "Compte partenaire",
    caption: "",
    icon: "apartment",
    link: { name: "listeComptePartenaire" },
    type: "2",
  },
  {
    title: "Gestion des demandes",
    caption: "",
    icon: "bookmark",
    link: { name: "gestionDemande" },
    type: "2",
  },
  {
    title: "Suivi des demandes",
    caption: "",
    icon: "shopping_cart",
    link: { name: "listeDemandes" },
    type: "1",
  },

  {
    title: "Mes emprunts",
    caption: "",
    icon: "bookmark",
    link: { name: "listeEmprunts" },
    type: "1",
  },
];

export default defineComponent({
  name: "MainLayout",

  components: {
    EssentialLink,
  },
  methods: {
    async left() {
      await this.$store.dispatch("signLeft");
      this.$router.push({ name: "connexion" });
    },
  },
  data() {
    return {
      utils: useQuasar(),
      user: null,
      type: "",
    };
  },
  mounted() {
    this.user = this.utils.localStorage.getItem("user");
    if (this.user.role === "part") {
      this.type = "1";
    } else {
      this.type = "2";
    }
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      essentialLinks: linksList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
});
</script>
