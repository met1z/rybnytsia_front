import axios from 'axios'
import { APP_API } from './api'

const endpoint = '/files'

const createFile = async (file: FormData) => {
  try {
    const { data } = await APP_API.post<string>(`${endpoint}/upload`, file, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data
    }
    throw e
  }
}

const deleteFile = async (url: string) => {
  try {
    const { data } = await APP_API.delete(`${endpoint}/${url}`)
    return data
  } catch (e) {
    if (axios.isAxiosError(e)) {
      throw e.response?.data
    }
    throw e
  }
}

export default { createFile, deleteFile }
