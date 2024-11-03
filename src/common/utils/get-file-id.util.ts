export const getFileName = (url?: string | undefined) => {
	if (!url) {
		throw new Error('Url not provided')
	}
	const lastPartUrl = url.split('/').pop()
	if (lastPartUrl) return lastPartUrl
	throw new Error('Incorrect url')
}
