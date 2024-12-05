import { Category } from './category.interface'

export interface CreateCategoryModal extends Pick<Category, 'name' | 'published'> {
	imageFile?: File
}
