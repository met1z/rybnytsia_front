import type { ValidationRuleWithParams } from '@vuelidate/core'
import { helpers, maxLength } from '@vuelidate/validators'

export const rybMaxLength = (param: string, length: number) =>
  helpers.withParams(
    {
      detailedErrorMessage: `The maximum allowed ${param} length is ${length}`,
    },
    maxLength(length),
  ) as ValidationRuleWithParams<{ max: number }>
