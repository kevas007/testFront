import { defineStore } from 'pinia'
import axios from 'axios'
import router from '@/router'
import { type Categorie } from '@/types/typeFile'

export const baseStore = defineStore('baseStore', {
  state: () => ({
    categories: {} as Categorie,
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
  },
  async updateCategorie ({
    name: string
  }){
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/v1/categorie',)
      this.categories = response.data.data
    } catch (error) {
      console.error(error)
    }
  }
})
