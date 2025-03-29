<template>
  <v-dialog v-model="show">
    <v-card class="pa-4 rounded-xl">
      <div class="d-flex justify-space-between align-center mb-4">
        <strong class="text-h6">Gérer les catégories</strong>
        <v-btn icon size="small" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Loader global -->
      <div v-if="loading" class="d-flex justify-center py-4">
        <v-progress-circular indeterminate color="primary" />
      </div>

      <!-- Liste des catégories -->
      <div
        v-else
        v-for="cat in store.categories"
        :key="cat.id"
        class="d-flex justify-space-between align-center mb-2"
      >
        <span>{{ cat.name }}</span>
        <v-btn icon size="x-small" @click="deleteCategorie(cat.id)">
          <v-icon size="16">mdi-delete</v-icon>
        </v-btn>
      </div>

      <!-- Champ pour ajouter une nouvelle catégorie -->
      <div class="mt-4 d-flex align-center">
        <v-text-field
          v-model="newCategorie"
          placeholder="Nouvelle catégorie"
          density="compact"
          hide-details
          variant="outlined"
          class="flex-grow-1"
          :disabled="loading"
        />
        <v-btn icon @click="createCategorie" :disabled="!newCategorie || loading">
          <v-icon>mdi-plus</v-icon>
        </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { baseStore } from '@/store/baseStore'

const store = baseStore()
const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue'])

const show = ref(props.modelValue)
watch(
  () => props.modelValue,
  (v) => (show.value = v),
)
watch(show, (v) => emit('update:modelValue', v))

const newCategorie = ref('')
const loading = ref(false)

async function createCategorie() {
  if (!newCategorie.value) return
  loading.value = true
  try {
    await store.createCategorie(newCategorie.value)
    newCategorie.value = ''
  } finally {
    loading.value = false
  }
}

async function deleteCategorie(id: number) {
  loading.value = true
  try {
    await store.deleteCategorie(id)
  } finally {
    loading.value = false
  }
}

function close() {
  show.value = false
}
</script>
<style scoped>
  .categorie-dialog .v-card {
    max-width: 150px;
    margin: 0 auto;
  }
@media screen and (max-width: 600px) {
  .categorie-dialog .v-card {
    max-width: 95vw;
    margin: 0 auto;
  }
}

</style>