<template>
  <q-card class="my-card">
    <img src="https://placeimg.com/500/200/nature" />

    <q-card-section>
      <div class="text-h6 flex">
        Nom oeuvre
        <div>
          <q-badge
            rounded
            outline
            color="green"
            style="margin-left: 20px; margin-right: 10px"
            label="Peinture"
          />
          <q-badge rounded outline color="black" label="Nom artiste" />
        </div>
      </div>

      <div class="text-subtitle2">
        Lorem ipsum dolor, sit amet consectetur adipisicing elit.
        <q-card-actions align="right">
          <q-btn flat color="orange" icon="edit" size="1.3em" />
          <q-btn flat color="red" icon="delete" size="1.3em" />
        </q-card-actions>
      </div>
    </q-card-section>
  </q-card>
</template>
