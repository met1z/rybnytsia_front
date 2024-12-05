import { Product } from './product.interface'

export type CreateProduct = Pick<
	Product,
	'name' | 'published' | 'imageUrl' | 'price' | 'categoryId'
>
