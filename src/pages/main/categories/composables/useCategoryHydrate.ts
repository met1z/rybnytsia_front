import { pick } from 'lodash'

import { useHydrateModalActions } from '../../../../common/composables/useHydrateModalActions'
import { useCategory } from './useCategory'
import { CreateCategoryModal } from '../interfaces/create-category-modal.interface'
import { UpdateCategoryModal } from '../interfaces/update-category-modal.interface'
import { RybNotPredictableError } from '../../../../common/errors/ryb-not-predictable-error'
import { Category } from '../interfaces/category.interface'
import { UpdateCategory } from '../interfaces/update-category.interface'

export const useCategoryHydrate = () => {
  const { create, update } = useCategory()

  const { openCreateDialog, closeDialog, hydrate, dialog, dialogDataId, dialogData, dialogOptions, hydrateOptions } =
    useHydrateModalActions<CreateCategoryModal, UpdateCategoryModal, UpdateCategory>({
      dialogHeader: 'Category',
    })

  const openEditDialog = async (v?: Category) => {
    if (!v) throw new RybNotPredictableError()
    dialogDataId.value = v.id
    dialogData.value = pick(v, [
      'name',
      'imageUrl',
      'published',
    ])
    dialog.value = true
  }

  const sendHydratedData = async (data: CreateCategoryModal) => {
    if (dialogOptions.value.isCreated) await create(data)
    else {
      if (!dialogData.value) throw new RybNotPredictableError()
      await update(dialogDataId.value as number, data, dialogData.value)
    }
  }

  return {
    openEditDialog,
    sendHydratedData,
    openCreateDialog,
    closeDialog,
    hydrate,
    hydrateOptions,
    dialogDataId,
  }
}
