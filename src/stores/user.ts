import { defineStore } from 'pinia'

import { User } from '../common/interfaces/user.interface'
import { UserRoles } from '../common/enums/user-roles.enum'
import { EntityMeta } from '../common/interfaces/entity-connection.interface'

interface State {
	user: User | undefined
	token: string | undefined
	entities: User[]
	meta: EntityMeta | undefined
}

export const useUserStore = defineStore({
	id: 'User',
	state: (): State => ({
		user: undefined,
		token: undefined,
		entities: [],
		meta: undefined,
	}),
	getters: {
		editorAccess: state => state.user?.role === UserRoles.EDITOR,
		adminAccess: state => state.user?.role === UserRoles.ADMIN,
		entitiesExist: state => !!state.entities.length,
	},
	actions: {
		addToken(token: string) {
			this.token = token
		},
		addUser(user: User) {
			this.user = user
		},
		addToStart(entity: User) {
			this.entities.unshift(entity)
			this.meta.itemCount += 1
		},
		addEntityConnection(entities: User[], meta: EntityMeta) {
			this.$patch({
				entities,
				meta,
			})
		},
		updateOnConnection(entityId: number, data: Partial<User>) {
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
