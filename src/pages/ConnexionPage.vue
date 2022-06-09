<template>
  <q-layout class="bg-accent row items-center" view="lHh Lpr lFf">
    <div class="row col items-center">
      <section class="col">
        <div class="row justify-center">
          <q-img
            spinner-color="secondary"
            :loading="lazy"
            style="height: 70%; width: 70%"
            src="~assets/logoMuseo.png"
          />
        </div>
      </section>
      <transition
        enter-active-class="animated fadeInRight"
        leave-active-class="animated fadeOutRight"
        appear
        :duration="5000"
      >
        <q-form class="col row items-center q-pt-xl q-mr-xl" @submit="submit">
          <section class="col">
            <div class="row items-center">
              <p
                style="font-size: 16px"
                v-if="config"
                class="text-center text-bold q-ma-none"
              >
                Connexion
                {{ config.type === "1" ? "administrateur" : "partenaire" }}
              </p>
              <q-btn
                @click="resetConfig"
                style="border-radius: 50px"
                class="q-ml-sm"
                no-caps
                color="primary"
                label="Réinitialiser la configuration"
              />
            </div>
            <q-input
              v-model="email"
              class="q-mb-lg"
              color="secondary"
              label="Entrer votre identifiant"
              lazy-rules
              :rules="[
                (val) =>
                  (val.includes('@') && val.includes('.')) ||
                  'Entrer une adresse e-mail valide !',
              ]"
            >
              <template v-slot:prepend>
                <q-icon color="grey-10" name="person" /> </template
            ></q-input>

            <q-input
              lazy-rules
              :rules="[(val) => val != '' || 'Vous devez entrer votre mot de passe !']"
              v-model="password"
              class="q-mb-xl"
              color="secondary"
              type="password"
              label="Entrer votre mot de passe"
            >
              <template v-slot:prepend> <q-icon color="grey-10" name="lock" /> </template
            ></q-input>
            <div class="row justify-center">
              <q-btn
                :loading="loading"
                type="submit"
                class="q-pt-sm q-pb-sm"
                style="width: 180px"
                color="secondary"
                no-caps
                label="Connexion"
              />
            </div>
          </section>
        </q-form>
      </transition>
    </div>
  </q-layout>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  data() {
    return {
      config: null,
      utils: useQuasar(),
      loading: false,
      email: "",
      password: "",
    };
  },
  mounted() {
    this.config = this.utils.localStorage.getItem("config");
  },
  methods: {
    resetConfig() {
      this.utils.localStorage.clear();
      this.$router.push({ name: "debut" });
    },
    async submit() {
      this.loading = true;
      if (this.config.type == "1") {
        let user = await this.$store.dispatch("signIn", {
          infos: { password: this.password, email: this.email },
        });
        this.loading = false;
        if (user) {
          this.$router.push({ name: "home" });
        }
      } else {
        let user = await this.$store.dispatch("signInPartenaire", {
          infos: { password: this.password, email: this.email },
        });
        this.loading = false;
        if (user) {
          let u = this.utils.localStorage.getItem("user");
          if (u.etat) {
            this.$router.push({ name: "home" });
          } else {
            await this.$store.dispatch("signLeft");
          }
        }
      }
    },
  },
};
</script>
