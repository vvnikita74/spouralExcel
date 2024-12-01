export default interface Report {
	id: number
	file_name: string
	data: object
	isReady: 0 | 1 | 2
	date_created: string
	user: number
}
