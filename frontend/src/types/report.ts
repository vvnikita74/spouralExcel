export default interface Report {
	id: number
	filename: string
	reportName: string
	uniqueId: string
	isReady: 0 | 1 | 2
	dateCreated: string
	user: number
	deleted?: boolean
}
