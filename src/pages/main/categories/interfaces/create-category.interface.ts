import { Category } from "./category.interface"

export type CreateCategory = Pick<Category, 'name' | 'published' | 'imageUrl'>
