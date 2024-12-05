import { defineStore } from 'pinia'

import { EntityMeta } from '../common/interfaces/entity-connection.interface'
import { Product } from '../pages/main/products/interfaces/product.interface'

interface State {
	entities: Product[]
	meta: EntityMeta | undefined
}

export const useProductStore = defineStore({
	id: 'Product',
	state: (): State => ({
		entities: [],
		meta: undefined,
	}),
	getters: {
		entitiesExist: state => !!state.entities.length,
	},
	actions: {
		addToEnd(entity: Product) {
			this.entities.push(entity)
			this.meta.itemCount += 1
		},
		addEntityConnection(entities: Product[], meta: EntityMeta) {
			this.$patch({
				entities,
				meta,
			})
		},
		updateOnConnection(entityId: number, data: Partial<Product>) {
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
