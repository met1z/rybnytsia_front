import { pick } from 'lodash'

import { useHydrateModalActions } from '../../../../common/composables/useHydrateModalActions'
import { RybNotPredictableError } from '../../../../common/errors/ryb-not-predictable-error'
import { UpdateProduct } from '../interfaces/update-product.interface'
import { UpdateProductModal } from '../interfaces/update-product-modal.interface'
import { CreateProductModal } from '../interfaces/create-product-modal.interface'
import { Product } from '../interfaces/product.interface'
import { useProduct } from './useProduct'

export const useProductHydrate = () => {
  const { create, update } = useProduct()

  const { openCreateDialog, closeDialog, hydrate, dialog, dialogDataId, dialogData, dialogOptions, hydrateOptions } =
    useHydrateModalActions<CreateProductModal, UpdateProductModal, UpdateProduct>({
      dialogHeader: 'Product',
    })

  const openEditDialog = async (v?: Product) => {
    if (!v) throw new RybNotPredictableError()
    dialogDataId.value = v.id
    dialogData.value = pick(v, [
      'name',
      'imageUrl',
      'published',
      'categoryId',
      'price'
    ])
    dialog.value = true
  }

  const sendHydratedData = async (data: CreateProductModal) => {
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
