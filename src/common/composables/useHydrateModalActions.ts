import { useToast } from 'primevue/usetoast'
import { computed, ref } from 'vue'

import { DIALOG_ID_CREATE } from '../constants'
import { hydrateErrorMessage } from '../utils/hydrate-error-message.util'

export const useHydrateModalActions = <C extends object, U = object | string | number>(v?: {
  dialogHeader: string
}) => {
  const toast = useToast()

  const dialog = ref(false)
  const dialogLoading = ref(false)
  const dialogDataId = ref<string | number>(DIALOG_ID_CREATE)
  const dialogData = ref<U | undefined>(undefined)

  const dialogOptions = computed(() => {
    const isCreated = dialogDataId.value === DIALOG_ID_CREATE
    return { isCreated, header: isCreated ? `Create ${v?.dialogHeader}` : `Update ${v?.dialogHeader}` }
  })

  const hydrateOptions = computed(() => ({
    dialog: dialog.value,
    loading: dialogLoading.value,
    options: dialogOptions.value,
    data: dialogData.value,
  }))

  const openCreateDialog = () => {
    dialogDataId.value = DIALOG_ID_CREATE
    dialog.value = true
  }

  const closeDialog = () => {
    dialog.value = false
    dialogData.value = undefined
    dialogDataId.value = DIALOG_ID_CREATE
  }

  const hydrate = async (data: C, sendHydratedData: (data: C) => Promise<void>) => {
    dialogLoading.value = true
    try {
      await sendHydratedData(data)
      closeDialog()
    } catch (e) {
      hydrateErrorMessage(e, toast)
    } finally {
      dialogLoading.value = false
    }
  }

  return {
    openCreateDialog,
    closeDialog,
    hydrate,
    dialog,
    dialogLoading,
    dialogDataId,
    dialogData,
    dialogOptions,
    hydrateOptions,
  }
}
