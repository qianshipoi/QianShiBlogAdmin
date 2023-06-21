import { defineStore } from 'pinia'
import { login } from '../api/api.ts'
import { LoginResponse } from '../types/appTypes.ts'

export const useAuthStore = defineStore('authStore', {
  state: () => ({
    isAuthenticated: false,
    loading: false,
    userInfo: null as null | LoginResponse
  }),
  actions: {
    async login(email: string, password: string) {
      this.loading = true;

      const message = window.$message;
      try {
        const response = await login(email, password);

        if (!response.succeeded) {
          message.error(response.message!)
          return false
        }

        this.userInfo = response.data
        this.isAuthenticated = true
        return true
      } catch (error) {
        message.error("登录失败");
        return false
      } finally {
        this.loading = false
      }
    }
  },
  persist: {
    key: 'auth',
    storage: localStorage,
    paths: ['isAuthenticated', 'userInfo']
  }
})
