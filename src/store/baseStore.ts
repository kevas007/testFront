import { defineStore } from 'pinia'
import axios from 'axios'
import { type Categorie, type Depense } from '@/types/typeFile'
import { srCyrl } from 'vuetify/locale'

export const baseStore = defineStore('baseStore', {
  state: () => ({
    categories: [] as Categorie[],
    depenses: [] as Depense[],
    form: {
      titre: '',
      date: '',
      categorie_id: null as { id: number; name: string } | null,
      description: '',
      montant: 0,
      src: null as File | null,
    },
    states: {},
  }),

  actions: {
    //stats
    async getSate() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/state')
        this.states = response.data.data
      } catch (error) {
        console.error(error)
      }
    },

    // Récupère toutes les catégories
    async getAllCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/categorie')
        this.categories = response.data.data
      } catch (error) {
        console.error(error)
      }
    },

    async createCategorie(name: string) {
      try {
        await axios.post('http://127.0.0.1:8000/api/v1/categorie', { name })
        await this.getAllCategories()
      } catch (error) {
        console.error('Erreur création catégorie', error)
        throw error
      }
    },

    async updateCategorie(updated: { id: number; name: string }) {
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/categorie/${updated.id}`, {
          name: updated.name,
        })
        await this.getAllCategories()
      } catch (error) {
        console.error(error)
      }
    },

    async deleteCategorie(id: number) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/categorie/${id}`)
        await this.getAllCategories()
      } catch (error) {
        console.error('Erreur suppression catégorie', error)
        throw error
      }
    },

    // Crée une dépense (supporte les fichiers)
    async createDepense(payload: FormData) {
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/depense', payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        this.depenses.push(res.data.data)
        return res.data.data
      } catch (error) {
        console.error('Erreur ajout dépense:', error)
        throw error
      }
    },

    async updateDepense(id: number) {
      try {
        const formData = new FormData()

        // Ajouter la méthode PUT pour Laravel
        formData.append('_method', 'PUT')

        // Ajouter tous les champs obligatoires
        formData.append('titre', this.form.titre)
        formData.append('date', this.form.date)
        formData.append('categorie_id', this.form.categorie_id?.id.toString())
        formData.append('montant', this.form.montant.toString())

        // Champs optionnels
        if (this.form.description) {
          formData.append('description', this.form.description)
        }

        // NE PAS ajouter src s'il n'est pas un fichier ou s'il est vide
        // UNIQUEMENT ajouter src s'il s'agit d'un objet File valide
        if (this.form.src instanceof File) {
          formData.append('src', this.form.src)
        }
        // Si vous voulez supprimer un fichier existant, envoyez une indication spéciale
        else if (this.form.src === '') {
          formData.append('delete_src', '1') // Signal pour supprimer le fichier
        }
        // Ne rien envoyer si vous souhaitez conserver le fichier existant

        const res = await axios.post(`http://127.0.0.1:8000/api/v1/depense/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        await this.getAllCategories()
        return res.data
      } catch (error) {
        console.error('Erreur updateDepense :', error)
        if (error.response && error.response.data) {
          console.error('Détails:', error.response.data)
        }
        throw error
      }
    },

    // Supprime une dépense
    async deleteDepense(id: number) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/depense/${id}`)
        // Optionnel : recharge les catégories si tu veux mettre à jour l'affichage
        await this.getAllCategories()
      } catch (error) {
        console.error('Erreur suppression dépense:', error)
        throw error
      }
    },
  },
})
