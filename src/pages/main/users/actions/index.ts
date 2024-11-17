import { APP_API } from '../../../../common/actions/api'
import { EntityConnection } from '../../../../common/interfaces/entity-connection.interface'
import { throwErrorMessageOrError } from '../../../../common/utils/throw-error-message-or-error.util'
import { User } from '../../../../common/interfaces/user.interface'
import { CreateUser } from '../interfaces/create-user.interface'
import { UserRoles } from '../../../../common/enums/user-roles.enum'

const endpoint = '/profile'

const fetch = async (params: URLSearchParams) => {
	const { data } = await APP_API.get<EntityConnection<User>>(endpoint, {
		params,
	})
	return data
}

const create = async (challenge: CreateUser) => {
	try {
		const { data } = await APP_API.post<User>(endpoint, challenge)
		return data
	} catch (e) {
		throw throwErrorMessageOrError(e)
	}
}

const updateUserRole = async (id: number, role: UserRoles) => {
	try {
		const { data } = await APP_API.put<User>(`${endpoint}/${id}/role`, { role })
		return data
	} catch (e) {
		throw throwErrorMessageOrError(e)
	}
}

const remove = async (id: number) => {
	try {
		const { data } = await APP_API.delete<boolean>(`${endpoint}/${id}`)
		return data
	} catch (e) {
		throw throwErrorMessageOrError(e)
	}
}

export default { fetch, create, updateUserRole, remove }
