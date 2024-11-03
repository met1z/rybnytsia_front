import { UserRoles } from "../enums/user-roles.enum"

export interface User {
	id: number
	username: string
	email: string
	role: UserRoles
}
