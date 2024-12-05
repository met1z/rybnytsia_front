import { APP_API } from '../../../../common/actions/api'
import { EntityConnection } from '../../../../common/interfaces/entity-connection.interface'
import { throwErrorMessageOrError } from '../../../../common/utils/throw-error-message-or-error.util'
import { CreateProduct } from '../interfaces/create-product.interface'
import { Product } from '../interfaces/product.interface'
import { UpdateProduct } from '../interfaces/update-product.interface'

const endpoint = '/product'

const fetch = async (params: URLSearchParams) => {
	const { data } = await APP_API.get<EntityConnection<Product>>(endpoint, {
		params,
	})
	return data
}

const create = async (v: CreateProduct) => {
	try {
		const { data } = await APP_API.post<Product>(endpoint, v)
		return data
	} catch (e) {
		throw throwErrorMessageOrError(e)
	}
}

const update = async (id: number, v: UpdateProduct) => {
	try {
		const { data } = await APP_API.put<Product>(`${endpoint}/${id}`, v)
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
