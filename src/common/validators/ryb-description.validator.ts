import { rybMaxLength } from './ryb-max-length.validator'
import { TEXT_MAX_LEN } from './validation-constants'

export const rybDescription = (length = TEXT_MAX_LEN) => ({
	maxLengthValue: rybMaxLength('Description', length),
})
