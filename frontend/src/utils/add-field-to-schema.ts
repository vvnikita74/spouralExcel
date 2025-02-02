import { z, ZodObject, ZodTypeAny, ZodRawShape } from 'zod'

export default function addFieldToSchema(
	schemaShape: Record<string, ZodTypeAny>,
	key: string,
	validator: ZodTypeAny
) {
	const keysArr = key.split('.')

	if (keysArr.length > 1) {
		const parentKey = keysArr[0]
		const childKey = keysArr[1]

		if (schemaShape[parentKey] instanceof z.ZodObject) {
			const parentSchema = schemaShape[
				parentKey
			] as ZodObject<ZodRawShape>

			schemaShape[parentKey] = parentSchema.extend({
				[childKey]: validator
			})
		}
	} else {
		schemaShape[key] = validator
	}
}
