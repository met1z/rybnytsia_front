import { CreateProduct } from './create-product.interface'

export interface CreateProductModal extends Omit<CreateProduct, 'imageUrl'> {
	imageFile?: File
}
