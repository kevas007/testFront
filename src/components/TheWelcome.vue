<template>
  <div class="header">
    <div>
      <h1>Dépenses</h1>
    </div>
    <div class="nav-links">
      <RouterLink to="/">Liste</RouterLink>
      <RouterLink to="/statistiques">About</RouterLink>
    </div>
  </div>
  <div>
    <CategorieAll />
  </div>
</template>

<script setup lang="ts">
import CategorieAll from './CategorieAll.vue'
</script>

<style scoped>
.header {
  width: 1280px;
  display: flex;
  align-items: center;
  justify-content: space-between; /* corrigé ici */
  top: 68px;
  height: 88px;
  padding: 24px;
}

.nav-links a {
  margin-left: 20px;
  text-decoration: none;
  color: #333;
  font-weight: 500;
}

.nav-links a:hover {
  color: #1976d2; /* Couleur hover optionnelle */
}

@media (max-width: 1250px) {
  .header {
    width: 376px;
    display: flex;
    align-items: center;
    justify-content: space-between; /* corrigé ici */
    top: 64%;
    height: 88px;
    padding: 24px;
  }
}
</style>
