export interface EntityConnection<T> {
	items: T[]
	meta: EntityMeta
}

export interface EntityMeta {
	totalItems: number
	itemCount: number
	itemsPerPage: number
	totalPages: number
	currentPage: number
}
