import { useToast } from 'primevue/usetoast'
import { isEqual } from 'lodash'

import {
	CREATED_MESSAGE,
	ERROR_MESSAGE,
	REMOVED_MESSAGE,
	UPDATED_MESSAGE,
} from '../../../../common/constants'
import api from '../actions'
import { RybNoChangesError } from '../../../../common/errors/ryb-no-changes-error'
import { useFiles } from '../../../../common/composables/useFiles'
import { useCategoryStore } from '../../../../stores/category'
import { CreateCategoryModal } from '../interfaces/create-category-modal.interface'
import { Category } from '../interfaces/category.interface'
import { UpdateCategoryModal } from '../interfaces/update-category-modal.interface'
import { UpdateCategory } from '../interfaces/update-category.interface'

export const useCategory = () => {
	const store = useCategoryStore()
	const toast = useToast()
	const { createFile, removeFile } = useFiles()

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

	const create = async ({ imageFile, ...rest }: CreateCategoryModal) => {
		const imageUrl = imageFile ? await createFile(imageFile) : undefined
		const item = await api.create({ ...rest, imageUrl })
		store.addToEnd(item)
		toast.add(CREATED_MESSAGE)
	}

	const update = async (
		id: number,
		{ imageFile, ...newItem }: UpdateCategoryModal,
		oldItem: UpdateCategory
	) => {
		const imageUrl = imageFile ? await createFile(imageFile) : undefined
		const newItemToCompare = { ...newItem, imageUrl }

		if (isEqual(oldItem, newItemToCompare)) throw new RybNoChangesError()
		const data = await api.update(id, { ...oldItem, ...newItemToCompare })
		store.updateOnConnection(id, data)

		if (imageFile && oldItem.imageUrl) {
			removeFile(oldItem.imageUrl).catch(() => {
				throw new Error('Failed to remove old image')
			})
		}
		toast.add(UPDATED_MESSAGE)
	}

	const remove = async ({ id }: Category) => {
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
		update,
		remove,
	}
}
