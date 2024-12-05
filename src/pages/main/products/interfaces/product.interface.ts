import { Category } from '../../categories/interfaces/category.interface'

export interface Product {
	id: number
	name: string
	price: string
	published: boolean
	imageUrl?: string
	categoryId?: number
	category?: Category
}
