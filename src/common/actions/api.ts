import axios from 'axios'

import { configRequest } from '../utils/config-request.util'
import { errorResponse } from '../utils/error-response.util'

export const APP_API = axios.create({
	headers: {
		'Content-Type': 'application/json',
	},
	baseURL: import.meta.env.VITE_API_APP_URL,
})

APP_API.interceptors.request.use(config => configRequest(config))
APP_API.interceptors.response.use(
	config => config,
	error => errorResponse(error, APP_API)
)
