import type { Validation } from '@vuelidate/core'
import { useToast } from 'primevue/usetoast'
import type { Ref } from 'vue'
import { ref } from 'vue'

import { ERROR_MESSAGE } from '../constants'

export const useModal = (v$: Ref<Validation>, state: Ref<object>) => {
  const toast = useToast()

  const submitted = ref(false)

  const validateModal = async () => {
    submitted.value = true
    await v$.value.$validate()
    if (v$.value.$invalid) {
      const detail = v$.value.$errors
        .map((item) => (item.$params as Record<string, string>).detailedErrorMessage ?? item.$message.toString())
        .join(', ')
      toast.add(ERROR_MESSAGE(detail))
      return false
    }
    return true
  }

  const afterHide = (stateInitial: object) => {
    state.value = { ...stateInitial }
    submitted.value = false
  }

  return { validateModal, afterHide, submitted }
}
