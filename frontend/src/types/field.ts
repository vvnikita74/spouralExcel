export default interface Field {
	type:
		| 'text'
		| 'number'
		| 'multiselect'
		| 'multinumber'
		| 'documentation'
		| 'date'
		| 'bool'
		| 'select'
	mask: string
	key: string
	name: string
	placeholder: string
	settings: string
	constructionType: object
	step: number
	position: number
	required: boolean
}
