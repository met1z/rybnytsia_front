import { useHydrateModalActions } from '../../../../common/composables/useHydrateModalActions'
import { useUsers } from './useUsers'
import { CreateUser } from '../interfaces/create-user.interface'
import { User } from '../../../../common/interfaces/user.interface'

export const useUserHydrate = () => {
  const { create } = useUsers()

  const { openCreateDialog, closeDialog, hydrate, dialogDataId, dialogOptions, hydrateOptions } =
    useHydrateModalActions<CreateUser, Pick<User, 'email' | 'username'>>({
      dialogHeader: 'User',
    })

  const sendHydratedData = async (data: CreateUser) => {
    if (dialogOptions.value.isCreated) await create(data)
  }

  return {
    sendHydratedData,
    openCreateDialog,
    closeDialog,
    hydrate,
    hydrateOptions,
    dialogDataId,
  }
}
