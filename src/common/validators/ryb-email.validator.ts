import { email, helpers } from '@vuelidate/validators'

export const rybEmail = (param = 'Email') => helpers.withMessage(`${param} is not a valid email address`, email)
