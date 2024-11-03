import api from '../actions/files'
import { getFileName } from '../utils/get-file-id.util'

export const useFiles = () => {
	const createFile = async (item: File) => {
		const formData = new FormData()
		formData.append('image', item)
		const data = await api.createFile(formData)
		return data
	}

	const removeFile = async (url: string) => {
		const id = getFileName(url)
		await api.deleteFile(id)
		return true
	}

	return {
		createFile,
		removeFile,
	}
}
