<template>
  <v-card class="pa-4" max-width="600">
    <v-card-text>
      <div v-for="categorie in store.categories" :key="categorie.id" class="mb-4">
        <p class="font-weight-bold d-flex justify-space-between align-center">
          {{ categorie.name }}
          <v-btn icon @click="openEditModal(categorie)">
            <v-icon>mdi-pencil</v-icon>
          </v-btn>
        </p>

        <div v-for="depense in categorie.depense" :key="depense.id" class="ml-4">
          <Depense :depense="depense" />
        </div>
      </div>
    </v-card-text>
  </v-card>

  <!-- Modal de modification -->
  <v-dialog v-model="editModal" max-width="500">
    <v-card>
      <v-card-title>Modifier la catégorie</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="editedCategorie.name"
          label="Nom de la catégorie"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="updateCategorie">Enregistrer</v-btn>
        <v-btn @click="editModal = false">Annuler</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>


<script setup lang="ts">
import {  onMounted } from 'vue'
import { baseStore } from '../store/baseStore'
import Depense from './Depense.vue'
const store = baseStore()
import { ref } from 'vue'
const editModal = ref(false)
const editedCategorie = ref({ id: null, name: '' })

function openEditModal(categorie: any) {
  editedCategorie.value = { ...categorie }
  editModal.value = true
}


onMounted(() => {
    store.getAllCategories()
    console.log(store.categories)
})
</script>

<style scoped>

</style>
