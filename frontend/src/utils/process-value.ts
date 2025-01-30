const processValue = (value: unknown): string | Blob => {
	if (
		typeof value === 'object' &&
		!Array.isArray(value) &&
		value !== null
	) {
		return JSON.stringify(value)
	} else if (Array.isArray(value)) {
		return JSON.stringify(value)
	}
	return value as string
}

export default processValue
