interface BaseField {
	key: string
	name: string
	placeholder: string
	settings: string
	constructionType: object
	step: number
	position: number
	required: boolean
}

interface TextField extends BaseField {
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
}

interface DateField extends BaseField {
	type: 'date'
	mask: 'monthYear' | 'dayMonth'
}

export type Field = TextField | DateField
