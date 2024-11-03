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

export const DEFAULT_ROW_PER_PAGE = [5, 10, 20] as const
