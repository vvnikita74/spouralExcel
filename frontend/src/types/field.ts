export default interface Field {
	type:
		| 'text'
		| 'number'
		| 'select'
		| 'multiselect'
		| 'multinumber'
		| 'documentation'
		| 'date'
		| 'bool'
	key: string
	mask: string
	name: string
	placeholder: string
	settings: string
	constructionType: object
	step: number
	position: number
	required: boolean
}
