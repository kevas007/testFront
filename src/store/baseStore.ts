import { defineStore } from 'pinia'
import axios from 'axios'
import { type Categorie } from '@/types/typeFile'

export const baseStore = defineStore('baseStore', {
  state: () => ({
    categories: [] as Categorie[],
  }),

  actions: {
    //call api depenses
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
    //end
  },
})
