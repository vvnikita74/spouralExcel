export default interface Report {
	id: number
	filename: string
	isReady: 0 | 1 | 2
	dateCreated: string
	user: number
	deleted?: boolean
}
