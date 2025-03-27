<template>
  <v-card class="mb-3 pa-4" elevation="0" color="grey-lighten-4">
    <div class="d-flex justify-space-between align-center">
      <div>
        <p class="text-subtitle-1 font-weight-medium mb-1">
          {{ depense.titre }}
        </p>
        <div class="d-flex align-center">
          <strong class="text-h6 me-2">{{ formatCurrency(depense.montant) }}</strong>

          <!-- Affichage de la catégorie -->
          <v-chip :color="color" text-color="black">
            {{ depense.categorie?.name || 'Sans catégorie' }}
          </v-chip>
        </div>

        <p class="text-caption text-grey-darken-1 mt-1">{{ depense.date }}</p>
      </div>

      <div>
        <v-btn icon @click="$emit('edit', depense)">
          <v-icon>mdi-pencil</v-icon>
        </v-btn>
        <v-btn icon @click="$emit('delete', depense)">
          <v-icon>mdi-delete</v-icon>
        </v-btn>
      </div>
    </div>
  </v-card>
</template>

<script setup lang="ts">
import type { Depense } from '../types/typeFile'

const props = defineProps<{
  depense: Depense
  color: string
}>()

function formatCurrency(montant: number) {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(montant)
}
</script>
