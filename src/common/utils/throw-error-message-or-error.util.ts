import axios, { AxiosError } from 'axios'

export const throwErrorMessageOrError = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    const error = e as AxiosError<{ message: string }>
    throw error.response?.data.message
  }
  throw e
}
