export function formatDate(isoDate: string): string {
	const date = new Date(isoDate)

	const day = String(date.getUTCDate()).padStart(2, '0')
	const month = String(date.getUTCMonth() + 1).padStart(2, '0')
	const year = String(date.getUTCFullYear()).slice(-2)

	return `${day}.${month}.${year}`
}

export function getFormattedDate() {
	const date = new Date()

	const hours = String(date.getHours()).padStart(2, '0')
	const minutes = String(date.getMinutes()).padStart(2, '0')
	const seconds = String(date.getSeconds()).padStart(2, '0')
	const day = String(date.getDate()).padStart(2, '0')
	const month = String(date.getMonth() + 1).padStart(2, '0')
	const year = date.getFullYear()

	return `${hours}_${minutes}_${seconds}_${day}_${month}_${year}`
}
