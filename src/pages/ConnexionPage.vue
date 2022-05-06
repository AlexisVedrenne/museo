<template>
  <q-layout class="bg-accent row items-center" view="lHh Lpr lFf">
    <div class="row col items-center">
      <section class="col">
        <div class="row justify-center">
          <q-img style="height: 70%; width: 70%" src="~assets/logoMuseo.png" />
        </div>
      </section>
      <main class="col row items-center q-pt-xl q-mr-xl">
        <section class="col">
          <q-input class="q-mb-lg" color="secondary" label="Entrer votre identifiant">
            <template v-slot:prepend> <q-icon color="grey-10" name="person" /> </template
          ></q-input>
          <q-input
            class="q-mb-xl"
            color="secondary"
            type="password"
            label="Entrer votre mot de passe"
          >
            <template v-slot:prepend> <q-icon color="grey-10" name="lock" /> </template
          ></q-input>
          <div class="row justify-center">
            <q-btn
              class="q-pt-sm q-pb-sm"
              style="width: 180px"
              color="secondary"
              no-caps
              label="Connexion"
            />
          </div>
        </section>
      </main>
    </div>
  </q-layout>
</template>

<script>
export default {};
</script>
