<template>
  <div class="text-center">
    <!-- LOADER GLOBAL -->
    <v-overlay :model-value="store.isLoading" class="align-center justify-center" persistent>
      <v-progress-circular indeterminate color="primary" size="64" />
    </v-overlay>

    <!-- TOAST NOTIFICATION -->
    <v-snackbar
      v-model="store.toast.show"
      :color="store.toast.type === 'error' ? 'red-darken-2' : 'green-darken-2'"
      timeout="5000"
      location="top center"
      multi-line
    >
      <div class="d-flex align-center">
        <v-icon class="mr-2" size="24">
          {{ store.toast.type === 'error' ? 'mdi-alert-circle' : 'mdi-check-circle' }}
        </v-icon>
        <span>{{ store.toast.message }}</span>
      </div>
    </v-snackbar>

    <h2 class="text-h6 font-weight-bold mb-6">Totaux par catégorie</h2>

    <div class="cat">
      <div v-if="store.states && store.states.length" class="d-flex flex-column align-center list">
        <v-card
          v-for="cat in store.states"
          :key="cat.id"
          class="pa-4 rounded-xl"
          elevation="2"
          max-width="300"
        >
          <div class="text-body-1 font-weight-bold mb-1">
            {{ cat.name }}
          </div>
          <div class="text-h5 font-weight-bold">
            {{ format(cat.depense_sum_montant || 0) }}
          </div>
        </v-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { baseStore } from '@/store/baseStore'
import { onMounted } from 'vue'
const store = baseStore()

onMounted(async () => {
  await store.getSate()
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
.cat {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 24px;
  margin-top: 16px;
}

.v-card {
  width: 487px;
  text-align: center;
  background-color: white;
  border-radius: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 5%;
}

.v-card .text-body-1 {
  font-size: 16px;
  color: #555;
}

.v-card .text-h5 {
  font-size: 28px;
  font-weight: 800;
  color: #0d0c22;
}
@media screen and (max-width: 375px) {
  .v-card {
    width: 95%;
    padding: 20px;
  }

  .v-card .text-body-1 {
    font-size: 14px;
  }

  .v-card .text-h5 {
    font-size: 24px;
  }

  .cat {
    gap: 16px;
  }
}
@media screen and (max-width: 600px) {
  /* Réduire largeur du dialogue */
  .v-dialog > .v-card {
    max-width: 95vw !important;
    padding: 16px !important;
  }

  /* Adapter le titre */
  .v-card-title {
    font-size: 16px;
    padding: 0 !important;
  }

  /* Espacer les champs */
  .v-card-text > * {
    margin-bottom: 12px !important;
  }

  .v-text-field,
  .v-textarea,
  .v-select,
  .v-file-input {
    font-size: 14px;
  }

  /* Bouton principal */
  .v-btn {
    font-size: 14px;
    padding: 10px 12px;
  }

  /* Circular loader dans le bouton */
  .v-progress-circular {
    width: 18px !important;
    height: 18px !important;
  }
}
</style>
