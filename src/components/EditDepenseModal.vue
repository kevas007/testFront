<template>
  <v-dialog v-model="visible" max-width="500" persistent>
    <v-card class="pa-6 rounded-xl">
      <v-card-title class="text-h6 font-weight-bold justify-space-between d-flex">
        Modifier une dépense
        <v-btn icon size="small" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <!-- Champs -->
        <v-text-field
          v-model="store.form.titre"
          label="Titre de la dépense *"
          :error-messages="getError('titre')"
          required
        />
        <v-text-field
          v-model="store.form.date"
          label="Date *"
          type="date"
          :error-messages="getError('date')"
          required
        />
        <v-select
          v-model="store.form.categorie_id"
          :items="store.categories"
          item-title="name"
          item-value="id"
          label="Catégorie *"
          :error-messages="getError('categorie_id')"
          return-object
          required
        />
        <v-textarea
          v-model="store.form.description"
          label="Description"
          rows="2"
          maxlength="200"
          counter
        />
        <v-text-field
          v-model="store.form.montant"
          label="Montant *"
          type="number"
          :error-messages="getError('montant')"
          append-inner-icon="mdi-currency-eur"
          required
        />

        <!-- Justificatif actuel -->
        <div v-if="props.depense?.src && !store.form.src && !removeSrc" class="mt-4">
          <label class="text-caption font-weight-medium mb-1 d-block">Justificatif actuel</label>
          <div class="d-flex align-center gap-3">
            <template v-if="isPdf(props.depense.src)">
              <v-icon color="red" size="32">mdi-file-pdf-box</v-icon>
              <a
                :href="`${backendUrl}/storage/${props.depense.src}`"
                target="_blank"
                class="text-body-2 font-weight-medium text-decoration-underline"
              >
                Voir le justificatif
              </a>
            </template>
            <template v-else>
              <v-img
                :src="`${backendUrl}/storage/${props.depense.src}`"
                max-width="150"
                class="rounded"
              />
            </template>

            <!-- Bouton pour supprimer le fichier -->
            <v-btn
              icon
              size="small"
              @click="handleRemoveSrc"
              title="Supprimer le fichier"
              variant="plain"
            >
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Nouveau fichier -->
        <v-file-input
          v-model="store.form.src"
          label="Ajouter un justificatif"
          accept="image/*,.pdf"
          prepend-icon="mdi-paperclip"
          show-size
          dense
          variant="outlined"
        />
      </v-card-text>

      <!-- Actions -->
      <v-card-actions class="pt-0">
        <v-btn block color="primary" @click="submitDepense" :disabled="loading">
          <template v-if="loading">
            <v-progress-circular indeterminate color="white" size="20" class="me-2" />
            Envoi...
          </template>
          <template v-else> Enregistrer </template>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="success" color="success" timeout="2000">
      Dépense modifiée avec succès !
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { baseStore } from '@/store/baseStore'
import type { Depense } from '@/types/typeFile'

const backendUrl = import.meta.env.VITE_BACKEND_URL
const store = baseStore()

const props = defineProps<{
  modelValue: boolean
  depense: Depense
}>()

const emit = defineEmits(['update:modelValue', 'saved'])

const visible = ref(props.modelValue)
const loading = ref(false)
const success = ref(false)
const removeSrc = ref(false)

const errors = ref<Record<string, string>>({})

watch(
  () => props.modelValue,
  (v) => (visible.value = v),
)
watch(visible, (v) => emit('update:modelValue', v))

watch(
  () => props.depense,
  (val) => {
    if (val) {
      store.form = {
        titre: val.titre,
        date: val.date,
        categorie_id: val.categorie ?? null,
        description: val.description ?? '',
        montant: val.montant,
        src: null,
      }
      removeSrc.value = false
      errors.value = {}
    }
  },
  { immediate: true },
)

function getError(field: string) {
  return errors.value[field] || ''
}

function isPdf(path: string): boolean {
  return path.toLowerCase().endsWith('.pdf')
}

function handleRemoveSrc() {
  removeSrc.value = true
  store.form.src = '' // C’est ici que `src` est vidé pour la DB
}

function validateForm(): boolean {
  errors.value = {}

  if (!store.form.titre.trim()) errors.value.titre = 'Le titre est requis.'
  if (!store.form.date) errors.value.date = 'La date est requise.'
  if (!store.form.categorie_id) errors.value.categorie_id = 'La catégorie est requise.'
  if (!store.form.montant || parseFloat(store.form.montant.toString()) <= 0)
    errors.value.montant = 'Le montant doit être supérieur à zéro.'

  return Object.keys(errors.value).length === 0
}

async function submitDepense() {
  if (!validateForm()) return

  try {
    loading.value = true

    const formData = new FormData()
    formData.append('titre', store.form.titre.trim())
    formData.append('date', store.form.date)
    formData.append('categorie_id', store.form.categorie_id!.id.toString())
    formData.append('description', store.form.description || '')
    formData.append('montant', store.form.montant.toString())

    if (store.form.src instanceof File) {
      formData.append('src', store.form.src)
    } else if (removeSrc.value) {
      formData.append('src', '') // Demande de suppression
    }

    await store.updateDepense(props.depense.id)

    success.value = true
    emit('saved')
    close()
  } catch (e) {
    console.error('Erreur lors de la soumission', e)
  } finally {
    loading.value = false
  }
}

function close() {
  visible.value = false
}
</script>
