<template>
  <div class="header-bar">
    <img class="logo" :src="logo" alt="Trustup Pro" />
  </div>

  <div class="header-title">
    <h1>Dépenses</h1>
    <div class="header-actions">
      <RouterLink to="/" class="header-btn" :class="{ active: $route.path === '/' }">
        <v-icon size="20" class="mr-1">mdi-view-list</v-icon> Liste
      </RouterLink>
      <RouterLink
        to="/statistiques"
        class="header-btn"
        :class="{ active: $route.path === '/statistiques' }"
      >
        <v-icon size="20" class="mr-1">mdi-chart-bar</v-icon> Statistiques
      </RouterLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import logo from '@/assets/icons/Trustup-pro.svg'

const $route = useRoute()
</script>

<style scoped>
.header-bar {
  width: 100%;
  padding: 16px 20px;
  background: white;
  border-bottom: 1px solid #dfdfdf;
  box-shadow: 0 4px 4px -2px rgba(0, 0, 0, 0.1);
  text-align: left;
  overflow: hidden; /* Empêche le défilement */
}

.logo {
  height: 26px;
  width: auto;
  object-fit: contain;
  display: block;
  margin-right: auto;
}

/* TITRE ET ACTIONS */
.header-title {
  width: 100%;
  padding: 24px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  overflow: hidden; /* Empêche le défilement */
}

.header-title h1 {
  font-size: 32px;
  font-weight: 800;
  margin: 0;
  color: #0f172a;
}

/* BOUTONS DE NAVIGATION */
.header-actions {
  display: flex;
  gap: 12px;
}

.header-btn {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  font-weight: 500;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #cfd4dc;
  background-color: white;
  color: #1e1e1e;
  text-decoration: none;
  transition: all 0.2s ease;
}

.header-btn.active {
  background-color: rgba(255, 194, 0, 1);
  color: white;
  border-color: transparent;
}

.header-btn:hover {
  background-color: rgba(255, 194, 0, 0.85);
  color: white;
}
/* RESPONSIVE MOBILE */
@media screen and (max-width: 600px) {
  .header-bar {
    flex-direction: row;
    align-items: center;
    gap: 10px;
  }

  .logo {
    height: 24px;
  }

  .header-title {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  .header-title h1 {
    font-size: 20px;
    margin: 0;
  }

  .header-actions {
    display: flex;
    gap: 8px;
    width: auto;
  }

  .header-btn {
    width: auto;
    padding: 6px 10px;
    font-size: 13px;
  }
}
@media screen and (max-width: 375px) {
  .header-title {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
  }

  .header-title h1 {
    font-size: 18px;
  }

  .header-actions {
    gap: 6px;
    width: auto;
  }

  .header-btn {
    padding: 4px 8px;
    font-size: 12px;
  }

  .header-btn v-icon {
    font-size: 18px;
  }
}
@media screen and (max-width: 360px) {
  .header-title {
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    gap: 4px;
  }

  .header-title h1 {
    font-size: 16px;
    margin: 0;
    white-space: nowrap;
  }

  .header-actions {
    display: flex;
    gap: 6px;
    width: auto;
    flex-shrink: 0;
  }

  .header-btn {
    display: flex;
    align-items: center;
    padding: 4px 6px;
    font-size: 11px;
    white-space: nowrap;
  }

  .header-btn .v-icon {
    font-size: 16px;
  }
}
</style>
