import { useToast } from 'primevue/usetoast'

import {
	CHANGED_STATUS_MESSAGE,
	CREATED_MESSAGE,
	ERROR_MESSAGE,
	REMOVED_MESSAGE,
} from '../../../../common/constants'
import api from '../actions'
import { User } from '../../../../common/interfaces/user.interface'
import { UserRoles } from '../../../../common/enums/user-roles.enum'
import { useUserStore } from '../../../../stores/user'
import { CreateUser } from '../interfaces/create-user.interface'

export const useUsers = () => {
	const store = useUserStore()
	const toast = useToast()

	const fetch = async (page = 1, limit = 50) => {
		const params = new URLSearchParams()
		if (page) params.append('page', page.toString())
		if (limit) params.append('limit', limit.toString())
		try {
			const { items, meta } = await api.fetch(params)
			store.addEntityConnection(items, meta)
		} catch (e) {
			toast.add(ERROR_MESSAGE(e))
		}
	}

	const create = async (input: CreateUser) => {
		const newCollection = await api.create(input)
		store.addToStart(newCollection)
		toast.add(CREATED_MESSAGE)
	}

	const changeRole = async (entityId: number, role: UserRoles) => {
		try {
			const { id } = await api.updateUserRole(entityId, role)
			store.updateOnConnection(id, { role })
			toast.add(CHANGED_STATUS_MESSAGE)
		} catch (e) {
			toast.add(ERROR_MESSAGE(e))
		}
	}

	const remove = async ({ id }: User) => {
		try {
			const resp = await api.remove(id)
			if (resp) {
				store.removeEntityByKey(id)
				toast.add(REMOVED_MESSAGE)
			}
		} catch (e) {
			toast.add(ERROR_MESSAGE(e))
		}
	}

	return {
		fetch,
		create,
		changeRole,
		remove,
	}
}
