<template>
  <q-card class="q-pa-lg">
    <div class="row justify-start items-center">
      <div class="col-1">
        <q-avatar>
          <img src="https://cdn.quasar.dev/img/avatar.png" />
        </q-avatar>
      </div>
      <div class="col-1">Nom</div>
      <div class="col-1">
        <q-badge outline color="primary" label="Type" />
      </div>
      <div class="col-2" style="width: 250px">
        <q-expansion-item expand-separator label="Bibliographie"> </q-expansion-item>
      </div>
      <div class="col row justify-end">
        <q-btn flat color="secondary" icon="edit" />
        <q-btn flat color="negative" icon="delete" />
        <q-btn text-color="primary" color="accent" no-caps label="Voir les oeuvres" />
      </div>
    </div>
  </q-card>
</template>
