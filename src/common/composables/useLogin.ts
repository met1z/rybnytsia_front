import { useToast } from 'primevue/usetoast'
import api from '../actions/login'
import { useUserStore } from '../../stores/user'
import { ERROR_MESSAGE, SUCCESS_MESSAGE } from '../constants'

export const useLogin = () => {
	const store = useUserStore()
	const toast = useToast()

	const login = async (email: string, password: string) => {
		try {
			const resp = await api.login(email, password)
			if (resp.user) {
				store.addUser(resp.user)
				store.addToken(resp.token)
				toast.add(SUCCESS_MESSAGE('Successfully log in!'))
			}
		} catch (e) {
			toast.add(ERROR_MESSAGE(e))
		}
	}

	return { login }
}
