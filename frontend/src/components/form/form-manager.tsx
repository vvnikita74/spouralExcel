import { Field } from 'types/field'

import { z } from 'zod'
import FormView from './form-view'

export default function FormManager({
	fields,
	queryKey,
	path
}: {
	fields: Field[]
	queryKey: string[]
	path: string
}) {
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
			case 'date': {
				let regex: string

				switch (mask) {
					case 'monthYear':
						regex = '\b(0[1-9]|1[0-2]).d{4}\b'
						break
					case 'dayMonth':
						regex = '\b(0[1-9]|[12]d|3[01]).(0[1-9]|1[0-2])\b'
						break
					default:
						regex = ''
				}

				validator = z.string()

				if (regex)
					validator = (validator as z.ZodString).regex(
						new RegExp(regex),
						'Введите корректное значение'
					)
			}
		}

		schemaShape[key] = validator
	})

	return (
		<FormView
			defaultValues={defaultValues}
			validationSchema={z.object(schemaShape)}
			fields={fields}
			queryKey={queryKey}
			path={path}
		/>
	)
}
