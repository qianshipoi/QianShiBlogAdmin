import { defineStore } from 'pinia'

export const useUserStore = defineStore('userStore', {
  state: () => {
    return {}
  },
  actions: {
    async login(email: string, password: string) {
      
    }
  }
})
