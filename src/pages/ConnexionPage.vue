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
export default {
  data() {
    return {
      loading: false,
      email: "",
      password: "",
    };
  },
  methods: {
    async submit() {
      this.loading = true;
      let user = await this.$store.dispatch("signIn", {
        infos: { password: this.password, email: this.email },
      });
      this.loading = false;
      if (user) {
        this.$router.push({ name: "home" });
      }
    },
  },
};
</script>
