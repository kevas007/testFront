import { defineStore } from 'pinia'
import axios from 'axios'
import { type Categorie, type Depense } from '@/types/typeFile'

export const baseStore = defineStore('baseStore', {
  state: () => ({
    isLoading: false,
    toast: {
      message: '',
      type: '' as 'success' | 'error' | '', // pour styliser selon le type
      show: false,
    },
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
    showToast(message: string, type: 'success' | 'error' = 'success') {
      this.toast.message = message
      this.toast.type = type
      this.toast.show = true
      setTimeout(() => {
        this.toast.show = false
        this.toast.message = ''
        this.toast.type = ''
      }, 5000)
    },

    async getSate() {
      this.isLoading = true
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/state')
        this.states = response.data.data
      } catch (error: string) {
        console.error(error)
        this.showToast(error?.response?.data?.message || 'Erreur lors de la récupération des stats', 'error')
      } finally {
        this.isLoading = false
      }
    },

    async getAllCategories() {
      this.isLoading = true
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/categorie')
        this.categories = response.data.data
      } catch (error: any) {
        console.error(error)
        this.showToast(error?.response?.data?.message || 'Erreur récupération catégories', 'error')
      } finally {
        this.isLoading = false
      }
    },

    async createCategorie(name: string) {
      this.isLoading = true
      try {
        await axios.post('http://127.0.0.1:8000/api/v1/categorie', { name })
        await this.getAllCategories()
        this.showToast('Catégorie créée avec succès !', 'success')
      } catch (error: any) {
        console.error('Erreur création catégorie', error)
        this.showToast(error?.response?.data?.message || 'Erreur création catégorie', 'error')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateCategorie(updated: { id: number; name: string }) {
      this.isLoading = true
      try {
        await axios.put(`http://127.0.0.1:8000/api/v1/categorie/${updated.id}`, {
          name: updated.name,
        })
        await this.getAllCategories()
        this.showToast('Catégorie mise à jour avec succès', 'success')
      } catch (error: any) {
        console.error(error)
        this.showToast(error?.response?.data?.message || 'Erreur mise à jour catégorie', 'error')
      } finally {
        this.isLoading = false
      }
    },

    async deleteCategorie(id: number) {
      this.isLoading = true
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/categorie/${id}`)
        await this.getAllCategories()
        this.showToast('Catégorie supprimée', 'success')
      } catch (error: any) {
        console.error('Erreur suppression catégorie', error)
        this.showToast(error?.response?.data?.message || 'Erreur suppression catégorie', 'error')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async createDepense(payload: FormData) {
      this.isLoading = true
      try {
        const res = await axios.post('http://127.0.0.1:8000/api/v1/depense', payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        this.depenses.push(res.data.data)
        this.showToast('Dépense ajoutée', 'success')
        return res.data.data
      } catch (error: any) {
        console.error('Erreur ajout dépense:', error)
        this.showToast(error?.response?.data?.message || 'Erreur ajout dépense', 'error')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async updateDepense(id: number) {
      this.isLoading = true
      try {
        const formData = new FormData()
        formData.append('_method', 'PUT')
        formData.append('titre', this.form.titre)
        formData.append('date', this.form.date)
        formData.append('categorie_id', this.form.categorie_id?.id.toString())
        formData.append('montant', this.form.montant.toString())

        if (this.form.description) {
          formData.append('description', this.form.description)
        }

        if (this.form.src instanceof File) {
          formData.append('src', this.form.src)
        } else if (this.form.src === '') {
          formData.append('delete_src', '1')
        }

        const res = await axios.post(`http://127.0.0.1:8000/api/v1/depense/${id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        await this.getAllCategories()
        this.showToast('Dépense mise à jour', 'success')
        return res.data
      } catch (error: any) {
        console.error('Erreur updateDepense :', error)
        this.showToast(error?.response?.data?.message || 'Erreur mise à jour dépense', 'error')
        throw error
      } finally {
        this.isLoading = false
      }
    },

    async deleteDepense(id: number) {
      this.isLoading = true
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/depense/${id}`)
        await this.getAllCategories()
        this.showToast('Dépense supprimée', 'success')
      } catch (error: any) {
        console.error('Erreur suppression dépense:', error)
        this.showToast(error?.response?.data?.message || 'Erreur suppression dépense', 'error')
        throw error
      } finally {
        this.isLoading = false
      }
    },
  },
})
