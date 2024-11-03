import axios, {
	AxiosError,
	type AxiosInstance,
	type AxiosRequestConfig,
} from 'axios'

import router from '../../router/index'

export const errorResponse = async (
	error: unknown,
	instance: AxiosInstance
) => {
	if (axios.isAxiosError(error)) {
		const axiosError: Omit<AxiosError, 'config'> & {
			config: AxiosRequestConfig & { __isRetryRequest?: boolean }
		} = error

		if (
			axiosError.response?.status === 401 &&
			!axiosError.config.__isRetryRequest
		) {
			router.push({ name: 'Login' })
		}
		if (
			axiosError.response?.status === 403 &&
			router.currentRoute.value.name !== 'Forbidden'
		) {
			router.push({ name: 'Forbidden' })
		}
	}
	return Promise.reject(error)
}
