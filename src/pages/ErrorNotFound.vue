<template>
  <div class="fullscreen bg-orange text-white text-center q-pa-md flex flex-center">
    <div>
      <div style="font-size: 15vh">Erreur :(</div>

      <div class="text-h2" style="opacity: 0.4">Votre compte a été désactivé...</div>

      <q-btn
        icon="undo"
        class="q-mt-xl"
        color="white"
        text-color="orange"
        unelevated
        to="/"
        label="Retour"
        no-caps
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "ErrorNotFound",
});
</script>
