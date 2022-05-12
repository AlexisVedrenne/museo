<template>
  <q-card class="my-card">
    <img src="https://placeimg.com/500/200/nature" />

    <q-card-section>
      <div class="text-h6 flex">
        Nom oeuvre
        <q-btn to="/start/pick-quasar-flavour" label="Sculpture" outline color="purple" />
        <q-btn to="/start/pick-quasar-flavour" label="Artiste" outline color="green" />
      </div>

      <div class="text-subtitle2">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        <div class="float-right">
          <q-icon color="yellow-10" name="edit" size="2.3em" />
          <q-icon color="red-10" name="delete" size="2.3em" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      {{ lorem }}
    </q-card-section>
  </q-card>
</template>
