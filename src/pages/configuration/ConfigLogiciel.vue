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
        <p class="q-ma-none q-ml-sm" style="font-size: 30px">Configuration pour,</p>
        <q-separator
          class="q-mb-lg"
          color="secondary"
          style="height: 1.5px; width: 30%"
        />
        <p style="width: 60%; font-size: 17px" class="q-mt-lg text-center">
          L'assistant de configuration du logiciel Muséo.
        </p>
        <p class="q-mt-lg text-center text-grey-8" style="width: 60%; font-size: 17px">
          Le logiciel de gestion du musée
        </p>
        <div style="width: 60%" class="row justify-center">
          <q-radio
            color="secondary"
            v-model="configuration.type"
            val="1"
            label="Gestion musée"
          />
        </div>
        <p style="width: 60%; font-size: 18px" class="text-secondary text-center q-mt-md">
          ou
        </p>
        <p class="q-mt-lg text-center text-grey-8" style="width: 60%; font-size: 17px">
          Le logiciel de guide pour les visiteurs
        </p>
        <div style="width: 60%" class="row justify-center q-pr-lg">
          <q-radio
            color="secondary"
            v-model="configuration.type"
            val="0"
            label="Logiciel guide"
          />
        </div>
      </section>
    </div>
    <div class="row justify-end q-mr-lg q-mt-md">
      <q-btn @click="setType" color="secondary" flat label="Terminer" />
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
    let config = this.utils.localStorage.getItem("config");
    if (config) {
      if (config.fin) {
        this.$router.push("connexion");
      }
    }
  },
  methods: {
    setType() {
      this.configuration.fin = true;
      this.utils.localStorage.set("config", this.configuration);
      if (this.configuration.type === "0") {
        this.utils.localStorage.set("user", {
          etat: true,
          nom: "Visiteur",
          role: "visiteur",
        });
        this.utils.localStorage.set("authCredential", true);
        this.$router.push({ name: "home" });
      } else {
        this.$router.push({ name: "connexion" });
      }
    },
  },
};
</script>
