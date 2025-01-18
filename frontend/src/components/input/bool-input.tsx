export function getBoolValue(
	values: {
		default: 'true' | 'false'
		true: string
		false: string
	},
	value?: 'false' | 'true'
) {
	if (value) {
		return values[value]
	} else return values.default
}

export default function BoolInput() {
	return null
}
