<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/NavBar.vue'
</script>

<template>
  <header>
    <NavBar class="nav" />
  </header>

  <RouterView />
</template>

<style scoped>
.nav {
  width: 100%;
}
@media (max-width: 125px) {
  .nav {
    width: 376px;
  }
}
</style>
