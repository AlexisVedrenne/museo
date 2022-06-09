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
        <p class="q-ma-none q-ml-sm" style="font-size: 30px">Bienvenue,</p>
        <q-separator
          class="q-mb-lg"
          color="secondary"
          style="height: 1.5px; width: 30%"
        />
        <p style="width: 60%; font-size: 17px" class="q-mt-lg text-center">
          L'assistant de configuration du logiciel Muséo.
        </p>
        <p class="q-mt-lg text-center text-grey-8" style="width: 60%; font-size: 17px">
          Vous êtes ?
        </p>
        <div style="width: 60%" class="row justify-center">
          <q-radio
            color="secondary"
            v-model="configuration.type"
            val="1"
            label="Employé Muséo"
          />
        </div>
        <p style="width: 60%; font-size: 18px" class="text-secondary text-center q-mt-md">
          ou
        </p>
        <div style="width: 60%" class="row justify-center q-pr-lg">
          <q-radio
            color="secondary"
            v-model="configuration.type"
            val="2"
            label="Partenaire"
          />
        </div>
      </section>
    </div>
    <div class="row justify-end q-mr-lg q-mt-md">
      <q-btn @click="setType" color="secondary" flat label="Commencé" />
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  data() {
    return {
      utils: useQuasar(),
      configuration: {
        type: "1",
        code: "",
        fin: false,
      },
    };
  },
  mounted() {
    this.utils.localStorage.clear();
  },
  methods: {
    setType() {
      this.utils.localStorage.set("config", this.configuration);
      if (this.configuration.type === "2") {
        this.$router.push({ name: "codePartenaire" });
      } else {
        this.configuration.fin = true;
        this.utils.localStorage.set("config", this.configuration);
        this.$router.push({ name: "connexion" });
      }
    },
  },
};
</script>
