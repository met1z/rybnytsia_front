import { defineStore } from 'pinia'

import { EntityMeta } from '../common/interfaces/entity-connection.interface'
import { Category } from '../pages/main/categories/interfaces/category.interface'

interface State {
	entities: Category[]
	meta: EntityMeta | undefined
}

export const useCategoryStore = defineStore({
	id: 'Category',
	state: (): State => ({
		entities: [],
		meta: undefined,
	}),
	getters: {
		entitiesExist: state => !!state.entities.length,
	},
	actions: {
		addToEnd(entity: Category) {
			this.entities.push(entity)
			this.meta.itemCount += 1
		},
		addEntityConnection(entities: Category[], meta: EntityMeta) {
			this.$patch({
				entities,
				meta,
			})
		},
		updateOnConnection(entityId: number, data: Partial<Category>) {
			const index = this.entities.findIndex(({ id }) => id === entityId)
			if (index !== -1) {
				Object.assign(this.entities[index], data)
			}
		},
		removeEntityByKey(entityId: number) {
			const index = this.entities.findIndex(v => v.id === entityId)
			if (index !== -1) {
				this.entities.splice(index, 1)
				this.totalCount -= 1
			}
		},
	},
})
