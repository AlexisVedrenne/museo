<template>
  <main v-if="oeuvre && artiste && musee && exposition">
    <q-card square class="bg-primary"
      ><q-card-section
        ><p style="font-size: 30px" class="text-bold text-white text-center">
          {{ oeuvre.nom }}
        </p></q-card-section
      ></q-card
    >
    <div class="row">
      <q-btn
        :to="{ name: 'home' }"
        class="q-ml-md"
        round
        flat
        color="secondary"
        icon="arrow_back_ios"
      />
      <div class="col row justify-end q-mr-md">
        <q-btn round flat color="secondary" icon="edit" />
        <q-btn round flat color="negative" icon="delete" />
      </div>
    </div>
    <section class="row q-mr-md q-ml-md">
      <div class="col">
        <q-img style="border-radius: 10px" :src="oeuvre.image" />
        <q-expansion-item
          class="q-mt-sm"
          icon="art_track"
          label="Bibliographie"
          :caption="artiste.nom + ' ' + artiste.prenom"
        >
          <q-card>
            <q-card-section v-html="artiste.bibliographie" />
          </q-card>
        </q-expansion-item>
      </div>
      <div class="col">
        <div class="row">
          <p class="q-ma-none q-mt-md text-bold q-mr-md q-ml-md" style="font-size: 20px">
            {{ artiste.nom }}
          </p>
          <q-avatar>
            <img :src="artiste.image" />
          </q-avatar>
        </div>

        <div class="row items-center">
          <q-separator class="col-5" color="secondary" style="height: 2px" spaced inset />
          <q-badge
            :style="'color:' + oeuvre.type.couleur"
            outline
            :label="oeuvre.type.nom"
          />
          <p class="q-ma-none q-ml-lg text-grey">
            Parue le <strong>{{ oeuvre.date }}</strong>
          </p>
        </div>
        <section class="row items-center">
          <div class="col">
            <p class="q-ma-none q-ml-md q-mt-lg">
              {{ oeuvre.description }}
            </p>
          </div>
          <span class="vertical text-grey q-mt-md q-ml-md"></span>
          <div class="col q-mt-lg">
            <p style="font-size: 16px" class="text-center text-bold">Appartenance</p>
            <p style="font-size: 16px" class="text-center text-grey">
              {{ musee.nom }}
            </p>
            <p style="font-size: 16px" class="text-center text-bold">Exposition</p>
            <p style="font-size: 16px" class="text-center text-grey">
              {{ exposition.nom }}
            </p>
          </div>
        </section>
        <div class="row items-center justify-center q-mt-md">
          <p class="text-brown text-bold col-5 q-ma-none" style="font-size: 16px">
            En {{ oeuvre.etat.nom }}
            <span><q-icon :name="oeuvre.etat.icon" /></span>
          </p>
          <q-btn
            color="secondary"
            class="col-5"
            no-caps
            label="Voir description détailler"
          />
        </div>
      </div>
    </section>
  </main>
</template>
<script>
export default {
  data() {
    return {
      oeuvre: null,
      artiste: null,
      exposition: null,
      musee: null,
    };
  },
  async mounted() {
    this.oeuvre = await this.$store.dispatch("fetchOeuvre", {
      index: this.$route.params.index,
    });
    this.artiste = await this.$store.dispatch("fetchArtiste", {
      idArtiste: this.oeuvre.idArtiste,
    });
    this.exposition = await this.$store.dispatch("fetchMusee", {
      idMusee: this.oeuvre.idExposition,
    });
    this.musee = await this.$store.dispatch("fetchMusee", {
      idMusee: this.oeuvre.idMuse,
    });
  },
};
</script>

<style>
.vertical {
  border-left: 2px solid;
  height: 250px;
  display: inline-block;
}
</style>
