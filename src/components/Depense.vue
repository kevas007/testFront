<template>
  <div>
    <p>
      <strong>{{ depense.titre }}</strong>
    </p>
    <p>{{ depense.montant }} €</p>
    <p>{{ depense.date }}</p>
  </div>
</template>

<script setup lang="ts">
import type { Depense } from '../types/typeFile'

const props = defineProps<{
  depense: Depense
}>()
</script>
