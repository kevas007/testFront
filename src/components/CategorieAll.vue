<template>
  <div class="pa-6">
    <!-- Loader -->
    <div v-if="loading" class="d-flex justify-center align-center" style="height: 200px">
      <v-progress-circular indeterminate color="primary" size="48" />
    </div>

    <!-- Contenu -->
    <div v-else>
      <!-- Filtres -->
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

      <!-- Modal ajout dépense -->
      <AddDepenseModal v-model="showDepenseModal" @saved="handleNewDepense" />

      <!-- Liste des dépenses -->
      <v-card v-if="activeCategorie" class="pa-4 mt-4" max-width="100%" elevation="2">
        <v-card-text>
          <div v-if="activeCategorie.depense && activeCategorie.depense.length">
            <div v-for="depense in activeCategorie.depense" :key="depense.id">
              <Depense
                :depense="depense"
                :categorie-name="activeCategorie.name"
                :color="getCategorieColor(activeCategorie)"
                @delete="confirmDelete"
              />
            </div>
          </div>
          <div v-else>
            <p class="text-subtitle-2 text-grey">Pas de dépense</p>
          </div>
        </v-card-text>
      </v-card>
    </div>

    <!-- Dialog de confirmation -->
    <v-dialog v-model="confirmDialog.visible" max-width="400" persistent>
      <v-card class="rounded-xl pa-4 text-center">
        <div class="d-flex justify-space-between align-center mb-2">
          <span class="text-h6 font-weight-bold">Supprimer la dépense</span>
          <v-btn icon @click="confirmDialog.visible = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <p class="mt-2 mb-4 text-body-2">Vous allez supprimer cette dépense, êtes-vous sûr ?</p>

        <v-btn
          block
          color="primary"
          class="mb-2"
          @click="deleteDepense"
          :loading="confirmDialog.loading"
        >
          Supprimer
        </v-btn>

        <v-btn block variant="outlined" @click="confirmDialog.visible = false">Annuler</v-btn>
      </v-card>
    </v-dialog>

    <!-- Modale de gestion globale -->
    <CategorieShow v-model="showManager" style="max-width: 30%" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { baseStore } from '../store/baseStore'
import CategorieShow from './CategorieShow.vue'
import AddDepenseModal from './AddDepenseModal.vue'
import Depense from './Depense.vue'
import type { Categorie } from '@/types/typeFile'

const store = baseStore()

const loading = ref(true)
const showManager = ref(false)
const showDepenseModal = ref(false)
const selectedCategorie = ref<Categorie | null>(null)

const activeCategorie = computed(() =>
  store.categories.find((c) => c.id === selectedCategorie.value?.id),
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

function handleNewDepense() {
  store.getAllCategories()
}

// 🔒 Confirmation de suppression
const confirmDialog = ref({
  visible: false,
  loading: false,
  depense: null as { id: number } | null,
})

function confirmDelete(depense: { id: number }) {
  confirmDialog.value.visible = true
  confirmDialog.value.depense = depense
}

async function deleteDepense() {
  if (!confirmDialog.value.depense) return
  try {
    confirmDialog.value.loading = true
    await store.deleteDepense(confirmDialog.value.depense.id)
    await store.getAllCategories()
    confirmDialog.value.visible = false
  } catch (e) {
    console.error('Erreur suppression dépense :', e)
  } finally {
    confirmDialog.value.loading = false
    confirmDialog.value.depense = null
  }
}
</script>
