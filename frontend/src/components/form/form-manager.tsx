import type Field from 'types/field'

import { z } from 'zod'
import FormView from './form-view'

export default function FormManager({ fields }: { fields: Field[] }) {
	const schemaShape = {}
	const defaultValues = {}

	fields.forEach(({ type, mask, key, required }) => {
		let validator: z.ZodType

		switch (type) {
			case 'text':
				validator = z
					.string()
					.min(required ? 1 : 0, 'Обязательное поле')
					.regex(
						new RegExp(mask || ''),
						'Введите корректное значение'
					)
				break
			case 'select':
				validator = z
					.string()
					.min(required ? 1 : 0, 'Обязательное поле')
				defaultValues[key] = ''
				break
		}

		schemaShape[key] = validator
	})

	return (
		<FormView
			defaultValues={defaultValues}
			validationSchema={z.object(schemaShape)}
			fields={fields}
		/>
	)
}
