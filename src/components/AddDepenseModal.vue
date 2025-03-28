<template>
  <v-dialog v-model="visible" max-width="500" persistent>
    <v-card class="pa-6 rounded-xl">
      <v-card-title class="text-h6 font-weight-bold justify-space-between d-flex">
        Ajouter une dépense
        <v-btn icon size="small" @click="close">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-card-title>

      <v-card-text>
        <v-text-field v-model="form.titre" label="Titre de la dépense *" required />
        <v-text-field v-model="form.date" label="Date *" type="date" required />
        <v-select
          v-model="form.categorie_id"
          :items="store.categories"
          item-title="name"
          item-value="id"
          label="Catégorie *"
          return-object
          required
        />
        <v-textarea
          v-model="form.description"
          label="Description"
          rows="2"
          maxlength="200"
          counter
        />
        <v-text-field
          v-model="form.montant"
          label="Montant *"
          type="number"
          append-inner-icon="mdi-currency-eur"
          required
        />
        <div class="my-4">
          <label class="text-caption font-weight-medium mb-1 d-block">Justificatif</label>
          <v-file-input
            v-model="form.src"
            label="Ajouter un justificatif"
            accept="image/*,.pdf"
            prepend-icon="mdi-paperclip"
            show-size
            dense
            variant="outlined"
          />
        </div>
      </v-card-text>

      <v-card-actions class="pt-0">
        <v-btn block color="primary" @click="submitDepense" :disabled="!isFormValid || loading">
          <template v-if="loading">
            <v-progress-circular indeterminate color="white" size="20" class="me-2" />
            Envoi...
          </template>
          <template v-else> Ajouter la dépense </template>
        </v-btn>
      </v-card-actions>
    </v-card>

    <!-- Snackbar -->
    <v-snackbar v-model="success" color="success" timeout="2500">
      Dépense ajoutée avec succès !
    </v-snackbar>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { baseStore } from '@/store/baseStore'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const store = baseStore()

const visible = ref(props.modelValue)
const loading = ref(false)
const success = ref(false)

watch(
  () => props.modelValue,
  (v) => (visible.value = v),
)
watch(visible, (v) => emit('update:modelValue', v))

const form = ref({
  titre: '',
  date: '',
  categorie_id: null as { id: number; name: string } | null,
  description: '',
  montant: 0,
  src: null as File | null,
})

const isFormValid = computed(
  () =>
    form.value.titre.trim().length > 0 &&
    form.value.date !== '' &&
    form.value.categorie_id !== null &&
    parseFloat(form.value.montant.toString()) > 0,
)

async function submitDepense() {
  try {
    loading.value = true

    const formData = new FormData()
    formData.append('titre', form.value.titre)
    formData.append('date', form.value.date)
    formData.append('categorie_id', form.value.categorie_id!.id.toString())
    formData.append('description', form.value.description)
    formData.append('montant', form.value.montant.toString())
    if (form.value.src) {
      formData.append('src', form.value.src)
    }

    await store.createDepense(formData)

    success.value = true
    emit('saved')
    resetForm()
    close()
  } catch (e) {
    console.error('Erreur lors de la soumission', e)
  } finally {
    loading.value = false
  }
}

function resetForm() {
  form.value = {
    titre: '',
    date: '',
    categorie_id: null,
    description: '',
    montant: 0,
    src: null,
  }
}

function close() {
  visible.value = false
}
</script>
