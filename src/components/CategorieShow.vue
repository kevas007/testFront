<template>
  <v-dialog v-model="show" max-width="400" persistent>
    <v-card class="pa-4 rounded-xl">
      <div class="d-flex justify-space-between align-center mb-4">
        <strong class="text-h6">Gérer les catégories</strong>
        <v-btn icon size="small" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </div>

      <!-- Liste des catégories -->
      <div
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
        />
        <v-btn icon @click="createCategorie" :disabled="!newCategorie">
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

async function createCategorie() {
  if (!newCategorie.value) return
  await store.createCategorie(newCategorie.value)
  newCategorie.value = ''
}

async function deleteCategorie(id: number) {
  await store.deleteCategorie(id)
}

function close() {
  show.value = false
}
</script>
