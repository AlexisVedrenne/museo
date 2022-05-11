<template>
  <div class="q-pa-lg">
    <div class="row">
      <div class="col-6">
        <div class="q-gutter-y-md" style="max-width: 400px; margin-left: 120px">
          <q-input color="orange" v-model="text" label="Nom de l'oeuvre">
            <template v-slot:before>
              <q-icon name="vrpano" />
            </template>
          </q-input>
          <q-select color="orange" v-model="model" :options="options" label="Type">
            <template v-slot:before>
              <q-icon name="description" />
            </template>
          </q-select>
          <q-input type="date" color="orange" hint="Date de l'oeuvre">
            <template v-slot:before>
              <q-icon name="edit_calendar" />
            </template>
          </q-input>
          <q-select color="orange" v-model="model" :options="options" label="Artiste">
            <template v-slot:before>
              <q-icon name="person" />
            </template>
          </q-select>
          <q-file color="orange" bottom-slots v-model="model" counter max-files="12">
            <template v-slot:before>
              <q-icon name="folder_open" />
            </template>

            <template v-slot:hint> Image(s) de l'oeuvre </template>

            <template v-slot:append>
              <q-btn round dense flat icon="add" @click.stop />
            </template>
          </q-file>
          <q-page-sticky position="bottom-left" :offset="[18, 18]">
            <q-fab icon="close" direction="up" color="red"> </q-fab>
          </q-page-sticky>
          <q-page-sticky position="bottom-right" :offset="[18, 18]">
            <q-fab icon="done" direction="up" color="green"> </q-fab>
          </q-page-sticky>
        </div>
      </div>
      <div class="col-6">
        <div class="q-gutter-y-md column" style="max-width: 400px; margin-left: 120px">
          <q-select
            color="orange"
            v-model="model"
            :options="options"
            label="Musée d'apartenance"
          >
            <template v-slot:before>
              <q-icon name="account_balance" />
            </template>
          </q-select>
          <q-select
            color="orange"
            v-model="model"
            :options="options"
            label="Musée d'expostion"
          >
            <template v-slot:before>
              <q-icon name="account_balance" />
            </template>
          </q-select>
          <q-select
            color="orange"
            v-model="model"
            :options="options"
            label="Etat de l'oeuvre"
          >
            <template v-slot:before>
              <q-icon name="account_balance" />
            </template>
          </q-select>
          <div class="q-pa-md" style="max-width: 400px">
            <q-input v-model="text" filled type="textarea" label="Description brève" />
          </div>
          <div class="q-pa-md" style="max-width: 400px">
            <q-input v-model="text" filled type="textarea" label="Description complete" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { ref } from "vue";

export default {
  setup() {
    return {
      model: ref(null),
      options: ["Google", "Facebook", "Twitter", "Apple", "Oracle"],
    };
  },
};
</script>
