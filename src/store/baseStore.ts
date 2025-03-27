import { defineStore } from 'pinia'
import axios from 'axios'
import { type Categorie } from '@/types/typeFile'

export const baseStore = defineStore('baseStore', {
  state: () => ({
    categories: [] as Categorie[],
  }),

  actions: {
    async getAllCategories() {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/v1/categorie')
        this.categories = response.data.data
      } catch (error) {
        console.error(error)
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

    async deleteDepense(depenseId: number) {
      try {
        await axios.delete(`http://127.0.0.1:8000/api/v1/depense/${depenseId}`)
        await this.getAllCategories()
      } catch (error) {
        console.error(error)
      }
    },
  },
})
