<template>
  <q-card :class="!infos.etat ? 'bg-grey-5' : ''">
    <q-card-section
      ><div class="row">
        <div v-if="musee" class="col row items-center">
          <p
            style="font-size: 15px"
            :class="
              infos.etat == true
                ? 'col-2 q-ma-none text-bold'
                : 'col-2 q-ma-none text-grey'
            "
          >
            {{ musee.nom }}
          </p>
          <p style="font-size: 15px" class="col text-grey q-ma-none q-ml-sm">
            {{ infos.uid }}
          </p>
          <p style="font-size: 15px" class="col-3 text-grey q-ma-none q-ml-sm">
            {{ infos.mail }}
          </p>
          <p style="font-size: 15px" class="col-2 text-grey q-ma-none q-ml-sm">
            {{ musee.tel }}
          </p>
        </div>
        <div class="col-3 row justify-end">
          <q-btn
            v-if="infos.etat"
            @click="desactive"
            flat
            color="negative"
            icon="delete"
          />
          <q-btn
            v-if="infos.etat"
            :to="'/partenaire/emprunts/' + infos.uid"
            text-color="primary"
            color="accent"
            no-caps
            label="Voir les emprunts"
          />
          <q-btn
            v-if="!infos.etat"
            @click="active"
            text-color="primary"
            color="accent"
            no-caps
            label="Activer ce compte"
          />
        </div></div
    ></q-card-section>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
export default {
  props: {
    infos: {
      type: Object,
    },
    id: {
      type: String,
    },
  },
  data() {
    return {
      utils: useQuasar(),
      musee: null,
    };
  },
  async mounted() {
    let musee = await this.$store.dispatch("fetchMusee", {
      idMusee: this.infos.idMusee,
    });
    this.musee = musee;
  },
  methods: {
    async desactive() {
      await this.$store.dispatch("desactivePartenaire", {
        id: this.id,
        compte: this.infos,
      });
    },
    async active() {
      await this.$store.dispatch("activePartenaire", {
        id: this.id,
        compte: this.infos,
      });
    },
  },
};
</script>
