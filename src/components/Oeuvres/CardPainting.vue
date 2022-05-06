<template>
  <div class="q-pa-md row items-start q-gutter-md">
    <q-card class="my-card">
      <img src="https://placeimg.com/500/200/nature" >

      <q-card-section>
        <div class="text-h6">Nom oeuvre</div>
        <div class="text-subtitle2">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ lorem }}
      </q-card-section>
    </q-card>
    <q-card class="my-card">
      <img src="https://placeimg.com/500/200/nature" >

      <q-card-section>
        <div class="text-h6">Nom oeuvre <q-btn to="/start/pick-quasar-flavour" label="Sculpture" outline color="purple"/> <q-btn to="/start/pick-quasar-flavour" label="Artiste" outline color="green"/></div>
        
        <div class="text-subtitle2">Lorem ipsum dolor, sit amet consectetur adipisicing elit.</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        {{ lorem }}
      </q-card-section>
    </q-card>
  </div>
</template>