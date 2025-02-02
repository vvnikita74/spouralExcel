export default interface Field {
	type: 'text' | 'table' | 'date' | 'select'
	mask: string
	key: string
	name: string
	placeholder: string
	settings: string
	construction_type: constructionType
	step: number
	position: number
	required: boolean
}

interface constructionType {
	name: string
	materials: {
		name: string
		defects: string[]
		recs: string[]
	}[]
}

export interface TableFieldCell {
	label: string
	key: string
	mask: string
}

// TODO: replace with string array without objects
export interface SelectValue {
	name: string
	value: string
}
