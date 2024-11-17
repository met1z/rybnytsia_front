export const ERROR_MESSAGE = (detail: string) => ({
	severity: 'error' as 'error',
	summary: 'Error',
	detail,
	life: 3000,
})

export const SUCCESS_MESSAGE = (detail: string) => ({
	severity: 'success' as 'success',
	summary: 'Success',
	detail,
	life: 3000,
})

export const NO_CHANGES_MESSAGE = {
	severity: 'warn' as 'warn',
	summary: 'No changes',
	detail: 'Item not updated',
	life: 3000,
}

export const CHANGED_STATUS_MESSAGE = {
	severity: 'success' as 'success',
	summary: 'Status changed',
	detail: 'Status changed successfully',
	life: 3000,
}

export const CREATED_MESSAGE = {
	severity: 'success' as 'success',
	summary: 'Success',
	detail: 'Item created successfully',
	life: 3000,
}

export const UPDATED_MESSAGE = {
	severity: 'success' as 'success',
	summary: 'Success',
	detail: 'Item updated successfully',
	life: 3000,
}

export const REMOVED_MESSAGE = {
	severity: 'info' as 'info',
	summary: 'Success',
	detail: 'Item removed successfully',
	life: 3000,
}

export const DIALOG_ID_CREATE = -1
export const DEFAULT_ROW_PER_PAGE = [5, 10, 20] as const
