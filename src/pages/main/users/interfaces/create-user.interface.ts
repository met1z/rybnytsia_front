import { User } from '../../../../common/interfaces/user.interface'

export interface CreateUser extends Pick<User, 'email' | 'username' | 'role'> {
	password: string
}
