<template>
  <div class="pa-6">
    <!-- Filtres : catégories -->
    <div class="d-flex flex-wrap align-center justify-space-between mb-6">
      <!-- Chips -->
      <div class="d-flex flex-wrap align-center">
        <v-chip
          v-for="(cat, index) in store.categories"
          :key="cat.id"
          class="ma-1"
          :closable="selectedCategorie?.id === cat.id"
          @click="selectCategorie(cat)"
          @click:close="resetToFirstCategorie"
          :color="selectedCategorie?.id === cat.id ? 'primary' : 'grey-lighten-2'"
        >
          {{ cat.name }}
        </v-chip>
        <!-- Icône crayon global -->
        <v-btn icon class="ma-1" @click="showManager = true">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
      </div>

      <!-- Bouton Ajouter -->
      <v-btn color="primary" prepend-icon="mdi-plus" @click="showManager = true">Ajouter</v-btn>
    </div>

    <!-- Dépenses de la catégorie sélectionnée -->
    <v-card v-if="activeCategorie" class="pa-4 mt-4" max-width="700" elevation="2">
      <v-card-title>
        Dépenses de {{ activeCategorie.name }}
        <v-spacer />
        <v-btn icon @click="selectedCategorie = null">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>
      <v-card-text>
        <div v-for="depense in activeCategorie.depense" :key="depense.id">
          <v-card class="mb-3 pa-4" elevation="0" color="grey-lighten-4">
            <div class="d-flex justify-space-between align-center">
              <div>
                <p class="text-subtitle-1 font-weight-medium mb-1">
                  {{ depense.titre }}
                </p>
                <strong>{{ formatCurrency(depense.montant) }}</strong>
                <p class="text-caption mt-1">{{ depense.date }}</p>
              </div>
              <div>
                <v-btn icon>
                  <v-icon>mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon>
                  <v-icon>mdi-delete</v-icon>
                </v-btn>
              </div>
            </div>
          </v-card>
        </div>
      </v-card-text>
    </v-card>

    <!-- Modale de gestion globale des catégories -->
    <CategorieShow v-model="showManager" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { baseStore } from '../store/baseStore'
import CategorieShow from './CategorieShow.vue'

const store = baseStore()

const selectedCategorie = ref<{ id: number; name: string } | null>(null)
const showManager = ref(false)

const activeCategorie = computed(() =>
  store.categories.find((c) => c.id === selectedCategorie.value?.id),
)

onMounted(() => {
  store.getAllCategories().then(() => {
    // Sélectionne la première catégorie automatiquement
    if (store.categories.length && !selectedCategorie.value) {
      selectedCategorie.value = store.categories[0]
    }
  })
})

function resetToFirstCategorie() {
  if (store.categories.length) {
    selectedCategorie.value = store.categories[0]
  }
}
function formatCurrency(montant: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(montant)
}

function selectCategorie(cat: { id: number; name: string }) {
  selectedCategorie.value = cat
}

function removeFilter(cat: { id: number }) {
  if (selectedCategorie.value?.id === cat.id) {
    selectedCategorie.value = null
  }
}
</script>
