<template>
  <div class="pa-6">
    <!-- Loader pendant chargement -->
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 200px">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Contenu principal -->
    <div v-else>
      <!-- Filtres : catégories -->
      <div class="d-flex flex-wrap align-center justify-space-between mb-6">
        <div class="d-flex flex-wrap align-center">
          <v-chip
            v-for="cat in store.categories"
            :key="cat.id"
            class="ma-1"
            :closable="selectedCategorie?.id === cat.id"
            @click="selectCategorie(cat)"
            @click:close="resetToFirstCategorie"
            :color="getCategorieColor(cat)"
          >
            {{ cat.name }}
          </v-chip>
          <v-btn icon class="ma-1" @click="showManager = true">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </div>

        <v-btn color="primary" prepend-icon="mdi-plus" @click="showDepenseModal = true">
          Ajouter
        </v-btn>
      </div>

      <!-- Modale d'ajout -->
      <AddDepenseModal v-model="showDepenseModal" @saved="handleNewDepense" />

      <!-- Dépenses -->
      <v-card v-if="activeCategorie" class="pa-4 mt-4" max-width="700" elevation="2">
        <v-card-title>
          {{ activeCategorie.name }}
          <v-spacer />
        </v-card-title>

        <v-card-text>
          <div v-for="depense in activeCategorie.depense" :key="depense.id">
            <Depense :depense="depense" :color="getCategorieColor(activeCategorie)" />
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Modale de gestion globale des catégories -->
    <CategorieShow v-model="showManager" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { baseStore } from '../store/baseStore'
import CategorieShow from './CategorieShow.vue'
import AddDepenseModal from './AddDepenseModal.vue'
import Depense from './Depense.vue'
import type { Categorie, Depense as DepenseType } from '@/types/typeFile'

const store = baseStore()

const loading = ref(true)
const showManager = ref(false)
const showDepenseModal = ref(false)

const selectedCategorie = ref<Categorie | null>(null)

const activeCategorie = computed(() =>
  store.categories.find((c) => c.id === selectedCategorie.value?.id)
)

onMounted(async () => {
  await store.getAllCategories()
  if (store.categories.length && !selectedCategorie.value) {
    selectedCategorie.value = store.categories[0]
  }
  loading.value = false
})

function resetToFirstCategorie() {
  if (store.categories.length) {
    selectedCategorie.value = store.categories[0]
  }
}

function selectCategorie(cat: Categorie) {
  selectedCategorie.value = cat
}

function removeFilter(cat: Categorie) {
  if (selectedCategorie.value?.id === cat.id) {
    selectedCategorie.value = null
  }
}

function getCategorieColor(categorie: Categorie): string {
  switch (categorie.id) {
    case 1:
      return 'warning'
    case 2:
      return 'primary'
    case 3:
      return 'success'
    case 4:
      return 'blue'
    default:
      return 'grey'
  }
}

// Optionnel si tu veux faire quelque chose après ajout
function handleNewDepense() {
  if (selectedCategorie.value) {
    store.getAllCategories()
  }
}
</script>
