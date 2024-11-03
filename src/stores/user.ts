import { defineStore } from 'pinia'

import { User } from '../common/interfaces/user.interface'
import { UserRoles } from '../common/enums/user-roles.enum'

interface State {
	user: User | undefined
	token: string | undefined
}

export const useUserStore = defineStore({
	id: 'User',
	state: (): State => ({
		user: undefined,
		token: undefined,
	}),
	getters: {
		editorAccess: state => state.user?.role === UserRoles.EDITOR,
		adminAccess: state => state.user?.role === UserRoles.ADMIN,
	},
	actions: {
		addToken(token: string) {
			this.token = token
		},
		addUser(user: User) {
			this.user = user
		},
	},
})
