export default interface Field {
	type: 'text' | 'table' | 'date' | 'select'
	mask: string
	key: string
	name: string
	placeholder: string
	settings: string
	construction_type: {
		name: string
		materials: {
			name: string
			defects: string[]
			recs: string[]
		}[]
	}
	step: number
	position: number
	required: boolean
}

export interface TableFieldCell {
	label: string
	key: string
	mask: string
}
