import type { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers, minLength } from '@vuelidate/validators'

export const rybMinLength = (param: string, length: number) =>
  helpers.withParams(
    {
      detailedErrorMessage: `The minimum allowed ${param} length is ${length}`,
    },
    minLength(length),
  ) as ValidationRuleWithParams<{ min: number }>
