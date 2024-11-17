export const removeConfirmGeneric = (
  acceptOrConfig:
    | (() => Promise<void>)
    | {
        message?: string
        header?: string
        icon?: string
        acceptClass?: string
        group?: string
        accept: () => Promise<void>
      },
) => {
  const defaultConfig = {
    message: 'Do you want to delete this item?',
    header: 'Delete Confirmation',
    icon: 'pi pi-info-circle',
    acceptClass: 'p-button-danger',
  }
  if (acceptOrConfig instanceof Function) return { ...defaultConfig, accept: acceptOrConfig }
  return { ...defaultConfig, ...acceptOrConfig }
}
