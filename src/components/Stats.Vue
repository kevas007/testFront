<template>
  <div class="text-center">
    <h2 class="text-h6 font-weight-medium mb-6">Totaux par catégorie</h2>

    <div v-if="store.states && store.states.length" class="d-flex flex-column align-center gap-4">
      <v-card
        v-for="cat in store.states"
        :key="cat.id"
        class="pa-4 rounded-xl"
        elevation="2"
        max-width="300"
      >
        <div class="text-body-1 font-weight-medium mb-1">
          {{ cat.name }}
        </div>
        <div class="text-h5 font-weight-bold">
          {{ format(cat.depense_sum_montant || 0) }}
        </div>
      </v-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { baseStore } from '@/store/baseStore'
import { onMounted } from 'vue'
const store = baseStore()

onMounted(async () => {
  store.getSate()
})

function format(val: number): string {
  return val.toLocaleString('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  })
}
</script>

<style scoped>
.gap-4 {
  gap: 1rem;
}
</style>
