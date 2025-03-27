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
        <v-text-field
          v-model="form.titre"
          label="Titre de la dépense *"
          required
        />

        <v-text-field
          v-model="form.date"
          label="Date de la dépense *"
          type="date"
          required
        />

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
          counter
          maxlength="200"
        />

        <v-text-field
          v-model="form.montant"
          label="Montant de la dépense *"
          type="number"
          append-inner-icon="mdi-currency-eur"
          required
        />

        <div class="my-4">
          <label class="text-caption font-weight-medium mb-1 d-block">Justificatif</label>
          <v-file-input
            v-model="form.justificatif"
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
        <v-btn
          block
          color="primary"
          @click="submitDepense"
          :disabled="!isFormValid"
        >
          Ajouter la dépense
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { baseStore } from '@/store/baseStore'

const props = defineProps<{ modelValue: boolean }>()
const emit = defineEmits(['update:modelValue', 'saved'])

const visible = ref(props.modelValue)
watch(() => props.modelValue, (v) => visible.value = v)
watch(visible, (v) => emit('update:modelValue', v))

const store = baseStore()

const form = ref({
  titre: '',
  date: '',
  categorie_id: null,
  description: '',
  montant: 0,
  justificatif: null,
})

const isFormValid = computed(() =>
  form.value.titre.trim().length > 0 &&
  form.value.date !== '' &&
  form.value.categorie_id !== null &&
  parseFloat(form.value.montant) > 0
)

function submitDepense() {
  const payload = {
    titre: form.value.titre,
    date: form.value.date,
    categorie_id: form.value.categorie_id.id, // car return-object est true
    description: form.value.description,
    montant: parseFloat(form.value.montant),
    justificatif: form.value.justificatif,
  }

  // TODO: envoyer à l'API
  console.log('Soumission de la dépense :', payload)

  emit('saved', payload)
  resetForm()
  close()
}

function close() {
  visible.value = false
}

function resetForm() {
  form.value = {
    titre: '',
    date: '',
    categorie_id: null,
    description: '',
    montant: 0,
    justificatif: null,
  }
}
</script>
