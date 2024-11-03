import type { InternalAxiosRequestConfig } from 'axios'
import { useUserStore } from '../../stores/user'

export const configRequest = async (config: InternalAxiosRequestConfig) => {
  const userStore = useUserStore()

  if (config.headers && userStore.token) {
    config.headers.Authorization = `Bearer ${userStore.token}`
  }
  return config
}
