import { APP_API } from '../../../../common/actions/api'
import { EntityConnection } from '../../../../common/interfaces/entity-connection.interface'
import { throwErrorMessageOrError } from '../../../../common/utils/throw-error-message-or-error.util'
import { User } from '../../../../common/interfaces/user.interface'
import { Category } from '../interfaces/category.interface'
import { CreateCategory } from '../interfaces/create-category.interface'
import { UpdateCategory } from '../interfaces/update-category.interface'

const endpoint = '/category'

const fetch = async (params: URLSearchParams) => {
	const { data } = await APP_API.get<EntityConnection<Category>>(endpoint, {
		params,
	})
	return data
}

const create = async (v: CreateCategory) => {
	try {
		const { data } = await APP_API.post<Category>(endpoint, v)
		return data
	} catch (e) {
		throw throwErrorMessageOrError(e)
	}
}

const update = async (id: number, v: UpdateCategory) => {
	try {
		const { data } = await APP_API.put<Category>(`${endpoint}/${id}`, v)
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

export default { fetch, create, update, remove }
