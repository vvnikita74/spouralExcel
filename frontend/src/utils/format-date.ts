export default function formatDate(isoDate: string): string {
	const date = new Date(isoDate)

	const day = String(date.getUTCDate()).padStart(2, '0')
	const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Месяцы в JavaScript начинаются с 0
	const year = String(date.getUTCFullYear()).slice(-2) // Последние две цифры года

	return `${day}.${month}.${year}`
}
