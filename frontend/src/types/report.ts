export default interface Report {
	id: number
	file_name: string
	data: object
	isReady: 1 | 2 | 3
	date_created: string
	user: number
}
