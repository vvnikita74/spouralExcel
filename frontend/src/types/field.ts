export default interface Field {
	type: 'text' | 'table' | 'date' | 'select'
	mask?: string
	key: string
	name: string
	placeholder?: string
	settings?: string
	construction_type?: ConstructionType
	step: number
	position: number
	required?: boolean
}

export interface ConstructionType {
	name: string
	materials: Array<ConstructionMaterials>
}

export interface ConstructionMaterials {
	name: string
	values: {
		def: string
		rec: string
	}[]
}

export interface TableFieldCell {
	label: string
	key: string
	mask?: string
}
