import { RybNotPredictableError } from '../errors/ryb-not-predictable-error';
import axios from 'axios'
import { APP_API } from './api'
import { User } from '../interfaces/user.interface'

const endpoint = '/profile/login'

const login = async (email: string, password: string) => {
	try {
		const { data } = await APP_API.post<{ token: string; user?: User }>(endpoint, {
			email,
			password,
		})
		if (data.token === 'Wrong Credentials') throw new RybNotPredictableError(data.token)
		if (!data.user) throw new RybNotPredictableError()
		return data
	} catch (e) {
		if (axios.isAxiosError(e)) {
			throw e.response?.data
		}
		throw e
	}
}

export default { login }
