import type Field from 'types/field'

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

	fields.forEach(({ type, mask, key, required, settings }) => {
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
				let regex: RegExp
				const dateType = JSON.parse(settings)?.type || 'monthYear'

				switch (dateType) {
					case 'monthYear':
						regex = /^(0[1-9]|1[0-2]).(d{2})$/
						break
					case 'monthFullYear':
						regex = /^(0[1-9]|1[0-2]).(d{4})$/
						break
					case 'dayMonth':
						regex = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])$/
						break
					default:
						regex = null
				}

				validator = z.string({
					message: 'Введите корректное значение'
				})

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
