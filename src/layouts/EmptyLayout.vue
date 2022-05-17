<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <transition
        enter-active-class="animated slideInLeft"
        leave-active-class="animated slideOutLeft"
        appear
        :duration="2000"
      >
        <router-view />
      </transition>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {};
</script>
