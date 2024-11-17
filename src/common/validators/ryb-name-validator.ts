import { rybRequired } from './ryb-required.validator'
import { rybMaxLength } from './ryb-max-length.validator'
import { NAME_MAX_LEN } from './validation-constants'

export const rybName = (maxLength = NAME_MAX_LEN) => ({
	required: rybRequired('Name'),
	maxLengthValue: rybMaxLength('Name', maxLength),
})
