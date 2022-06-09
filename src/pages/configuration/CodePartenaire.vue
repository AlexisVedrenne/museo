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
            :to="{ name: 'debut' }"
            class="q-pa-none"
            icon="chevron_left"
            color="secondary"
            flat
            size="20px"
          />
          <p class="q-ma-none q-ml-sm" style="font-size: 30px">
            Entrez votre code partenaire
          </p>
        </div>

        <q-separator
          class="q-mb-lg"
          color="secondary"
          style="height: 1.5px; width: 65%"
        />
        <p style="width: 60%; font-size: 17px" class="q-mt-lg text-center">
          Le code vous a été fourni en même temps que le logiciel.
        </p>
        <q-form @submit="setCode" v-if="config">
          <div class="row">
            <q-input
              v-model="config.code"
              class="col-8"
              color="secondary"
              label="Code partenaire"
            >
              <template v-slot:prepend> <q-icon name="qr_code" /> </template
            ></q-input>
          </div>
          <div class="row justify-end q-mr-lg q-mt-xl">
            <q-btn
              :loading="loading"
              type="submit"
              color="secondary"
              flat
              label="Suivant"
            />
          </div>
        </q-form>
      </section>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  data() {
    return {
      loading: false,
      utils: useQuasar(),
      config: null,
    };
  },
  mounted() {
    this.config = this.utils.localStorage.getItem("config");
  },
  methods: {
    async setCode() {
      this.loading = true;
      this.config.code = await this.$store.dispatch("fetchCodePartenaire", {
        code: this.config.code,
      });
      this.loading = false;
      if (this.config.code) {
        this.utils.localStorage.set("config", this.config);
        this.$router.push({ name: "finPartenaire" });
      }
    },
  },
};
</script>
