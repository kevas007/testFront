<template>
  <div class="pa-6">
    <!-- Filtres : catégories -->
    <div class="d-flex flex-wrap align-center justify-space-between mb-6">
      <div class="d-flex">
        <v-chip
          v-for="(cat, index) in store.categories"
          :key="cat.id"
          class="ma-1 d-flex align-center"
          closable
          @click:close="removeFilter(cat)"
          @click="selectCategorie(cat)"
          :color="selectedCategorie?.id === cat.id ? 'primary' : 'grey-lighten-2'"
          variant="flat"

        >
          {{ cat.name }}

        </v-chip>
        <v-btn icon size="x-small" class="ms-2" @click.stop="openEditModal(cat)">
            <v-icon size="16">mdi-pencil</v-icon>
          </v-btn>
      </div>

      <v-btn color="primary" prepend-icon="mdi-plus" @click="openEditModal()">Ajouter</v-btn>
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

    <!-- Modale création / modification catégorie -->
    <v-dialog v-model="editModal" max-width="500">
      <v-card>
        <v-card-title>
          {{ editedCategorie.id ? 'Modifier' : 'Ajouter' }} une catégorie
        </v-card-title>
        <v-card-text>
          <v-text-field
            v-model="editedCategorie.name"
            label="Nom de la catégorie"
            autofocus
            required
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" @click="submitCategorie">
            {{ editedCategorie.id ? 'Enregistrer' : 'Créer' }}
          </v-btn>
          <v-btn @click="editModal = false">Annuler</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { baseStore } from '../store/baseStore'
import axios from 'axios'

const store = baseStore()

const selectedCategorie = ref<{ id: number; name: string } | null>(null)
const editModal = ref(false)

const editedCategorie = ref<{ id: number | null; name: string }>({
  id: null,
  name: '',
})

const activeCategorie = computed(() =>
  store.categories.find((c) => c.id === selectedCategorie.value?.id)
)

onMounted(() => {
  store.getAllCategories()
})

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

function openEditModal(categorie: { id?: number; name: string } | null = null) {
  if (categorie) {
    editedCategorie.value = {
      id: categorie.id ?? null,
      name: categorie.name,
    }
  } else {
    editedCategorie.value = { id: null, name: '' }
  }
  editModal.value = true
}

async function submitCategorie() {
  try {
    if (editedCategorie.value.id) {
      // Mise à jour
      await axios.put(
        `http://127.0.0.1:8000/api/v1/categorie/${editedCategorie.value.id}`,
        { name: editedCategorie.value.name }
      )
    } else {
      // Création
      await axios.post(`http://127.0.0.1:8000/api/v1/categorie`, {
        name: editedCategorie.value.name,
      })
    }

    await store.getAllCategories()
    editModal.value = false
  } catch (error) {
    console.error('Erreur lors de l’enregistrement :', error)
  }
}
</script>
