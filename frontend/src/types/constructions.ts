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
