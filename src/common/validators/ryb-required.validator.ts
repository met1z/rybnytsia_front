import { helpers, required } from '@vuelidate/validators'

export const rybRequired = (param: string) => helpers.withMessage(`${param} is required`, required)
