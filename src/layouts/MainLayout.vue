<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-btn flat dense round icon="menu" aria-label="Menu" @click="toggleLeftDrawer" />

        <q-toolbar-title> Quasar App </q-toolbar-title>

        <div>Quasar v{{ $q.version }}</div>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered>
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

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { defineComponent, ref } from "vue";
import EssentialLink from "components/EssentialLink.vue";

const linksList = [
  {
    title: "Oeuvres",
    caption: "",
    icon: "vrpano",
    link: { name: "home" },
  },
  {
    title: "Types oeuvres",
    caption: "",
    icon: "description",
    link: "https://github.com/quasarframework",
  },
  {
    title: "Artistes",
    caption: "",
    icon: "person",
    link: "https://chat.quasar.dev",
  },
  {
    title: "Musées",
    caption: "",
    icon: "account_balance",
    link: { name: "listMusee" },
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
