<template>
  <q-page>
    <div class="row items-center" style="padding-top: 150px">
      <section class="col q-mr-lg q-pr-lg">
        <div class="row justify-end">
          <q-img
            spinner-color="secondary"
            loading="lazy"
            style="height: 50%; width: 50%"
            src="~assets/logoMuseo.png"
          />
        </div>
      </section>
      <section class="col q-mt-xl q-ml-lg">
        <div class="row">
          <q-btn
            :to="{ name: 'codePartenaire' }"
            class="q-pa-none"
            icon="chevron_left"
            color="secondary"
            flat
            size="20px"
          />
          <p class="q-ma-none q-ml-sm" style="font-size: 30px">Bonjour !</p>
        </div>

        <q-separator
          class="q-mb-lg"
          color="secondary"
          style="height: 1.5px; width: 35%"
        />
        <p
          v-if="partenaire"
          style="width: 60%; font-size: 23px"
          class="q-mt-lg text-center"
        >
          {{ partenaire.nom }}
        </p>
      </section>
    </div>
    <div class="row justify-end q-mr-lg q-mt-xl">
      <q-btn @click="fin" color="secondary" flat label="Terminer" />
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  data() {
    return {
      utils: useQuasar(),
      partenaire: null,
      config: null,
    };
  },
  mounted() {
    this.partenaire = this.utils.localStorage.getItem("user");
    this.config = this.utils.localStorage.getItem("config");
  },
  methods: {
    fin() {
      this.config.fin = true;
      this.utils.localStorage.set("config", this.config);
      this.$router.push({ name: "home" });
    },
  },
};
</script>
