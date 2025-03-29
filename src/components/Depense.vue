<template>
  <v-card class="mb-3 pa-4" elevation="0" color="grey-lighten-4">
    <div class="d-flex justify-space-between align-center">
      <!-- Infos de la dépense -->
      <div>
        <p class="text-subtitle-1 font-weight-medium mb-1">
          {{ depense.titre }}
        </p>

        <div class="d-flex align-center mb-1">
          <strong class="text-h6 me-2">
            {{ formatCurrency(depense.montant) }}
          </strong>

          <v-chip :color="color" text-color="black" size="small" variant="flat">
            {{ depense.categorie?.name || 'Sans catégorie' }}
          </v-chip>
        </div>

        <p class="text-caption text-grey-darken-1">
          {{ depense.date }}
        </p>
      </div>

      <!-- Actions -->
      <div class="d-flex gap-2">
        <v-btn
          icon
          density="comfortable"
          @click="handleEditDepense"
          aria-label="Modifier la dépense"
          title="Modifier"
          class="mx-2"
        >
          <v-icon>mdi-pencil</v-icon>
        </v-btn>

        <v-btn
          icon
          density="comfortable"
          @click="$emit('delete', depense)"
          aria-label="Supprimer la dépense"
          title="Supprimer"
        >
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>

    <!-- Modal d'édition -->
    <EditDepenseModal v-model="showEditModal" :depense="depense" @saved="handleDepenseUpdated" />
  </v-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import EditDepenseModal from './EditDepenseModal.vue'
import type { Depense } from '@/types/typeFile'

const props = defineProps<{
  depense: Depense
  color: string
}>()

const emit = defineEmits(['delete', 'updated'])

const showEditModal = ref(false)

function formatCurrency(montant: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(montant)
}

function handleEditDepense() {
  showEditModal.value = true
}

function handleDepenseUpdated() {
  emit('updated')
  showEditModal.value = false
}
</script>
<style scoped>
@media screen and (max-width: 600px) {
  .v-card {
    padding: 12px;
  }

  .v-card .text-subtitle-1 {
    font-size: 15px;
  }

  .v-card .text-h6 {
    font-size: 18px;
  }

  .v-card .text-caption {
    font-size: 12px;
  }

  .v-card .v-chip {
    font-size: 11px;
    padding: 0 6px;
  }

  .v-card .v-btn {
    width: 32px;
    height: 32px;
  }

  .v-card .v-icon {
    font-size: 18px;
  }

  .v-card .d-flex.justify-space-between {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .v-card .d-flex.gap-1 {
    align-self: flex-end;
  }
}
</style>
