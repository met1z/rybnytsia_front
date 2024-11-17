import type { ToastServiceMethods } from 'primevue/toastservice'

import { RybNoChangesError } from '../errors/ryb-no-changes-error'
import { ERROR_MESSAGE, NO_CHANGES_MESSAGE } from '../constants'

export const hydrateErrorMessage = (e: unknown, toast: ToastServiceMethods) => {
  if (e instanceof RybNoChangesError) toast.add(NO_CHANGES_MESSAGE)
  else toast.add(ERROR_MESSAGE(e as string))
}
