<template>
  <q-card square class="bg-primary"
    ><q-card-section
      ><p class="text-white text-center text-bold" style="font-size: 30px">
        Liste des Artistes
      </p></q-card-section
    ></q-card
  >
  <q-page class="q-pa-lg">
    <div class="row justify-start">
      <div class="col-1">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </div>
      <div class="col-1">Nom</div>
      <div class="col-1"><q-badge outline color="primary" label="Type" /></div>
      <div class="col-2" style="width: 250px">
        <q-expansion-item expand-separator label="Bibliographie"> </q-expansion-item>
      </div>
      <div class="col row justify-end">
        <q-btn flat color="secondary" icon="edit" />
        <q-btn flat color="negative" icon="delete" />
        <q-btn text-color="primary" color="accent" no-caps label="Voir les oeuvres" />
      </div>
    </div>
  </q-page>
</template>
