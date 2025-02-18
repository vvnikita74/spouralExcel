import type {
	DateField,
	Field,
	SelectField,
	TableField,
	TextField
} from 'types/field'
import type Report from 'types/report'
import type { PostMutationVariables } from 'utils/mutations'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { getDateMask, getDateType } from 'components/input/date-input'
import addFieldToSchema from 'utils/add-field-to-schema'
import { z, ZodString } from 'zod'
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

	fields.forEach(({ type, key, ...rest }) => {
		let validator: z.ZodType

		switch (type) {
			case 'text': {
				const { required, mask, placeholder } = rest as TextField

				validator = z
					.string()
					.min(required ? 1 : 0, 'Обязательное поле')

				if (mask)
					(validator as z.ZodString).regex(
						new RegExp(mask || ''),
						'Введите корректное значение'
					)

				defaultValues[key] = required ? '' : placeholder || ''
				break
			}
			case 'select': {
				const { required, placeholder } = rest as SelectField

				validator = z
					.string()
					.min(required ? 1 : 0, 'Обязательное поле')
				defaultValues[key] = required ? '' : placeholder
				break
			}
			case 'date': {
				const { mask } = rest as DateField

				validator = z.string({
					message: 'Введите корректное значение'
				})

				const regex: RegExp = getDateMask(getDateType(mask))

				if (regex)
					validator = (validator as z.ZodString).regex(
						new RegExp(regex),
						'Введите корректное значение'
					)

				break
			}
			case 'table': {
				const {
					construction_type,
					required,
					settings: { cells = [] } = { cells: [] }
				} = rest as TableField

				const objectCellSchema: Record<string, z.ZodTypeAny> = {}
				if (!construction_type) {
					cells.forEach(({ key: cellKey, mask: cellMask }) => {
						objectCellSchema[cellKey] = z
							.string()
							.min(1, 'Введите значение')

						if (cellMask) {
							objectCellSchema[cellKey] = (
								objectCellSchema[cellKey] as ZodString
							).regex(
								new RegExp(cellMask),
								'Введите корректное значение'
							)
						}
					})

					validator = z
						.array(z.object(objectCellSchema))
						.min(required ? 1 : 0, 'Обязательное поле')
					defaultValues[key] = []
				} else {
					objectCellSchema['material'] = z
						.string()
						.min(1, 'Выберите значение')

					objectCellSchema['values'] = z
						.array(
							z.object({
								def: z.string(),
								rec: z.string()
							})
						)
						.superRefine((values, ctx) => {
							values.forEach((item, index) => {
								// Если нужно чтобы хотя бы один дефект был заполнен
								// if (values.length < 1) {
								// 	ctx.addIssue({
								// 		code: z.ZodIssueCode.custom,
								// 		message: 'Обязательное поле',
								// 		path: []
								// 	})
								// }
								if (
									item.def.trim() === '' &&
									item.rec.trim() === ''
								) {
									ctx.addIssue({
										code: z.ZodIssueCode.custom,
										message:
											'Хотя бы одно из полей должно быть заполнено',
										path: [index]
									})
								}
							})
						})

					validator = z.object(objectCellSchema)

					defaultValues[key] = {
						material: '',
						values: []
					}
				}
			}
		}

		if (validator) addFieldToSchema(schemaShape, key, validator)
	})

	const queryClient = useQueryClient()

	const mutation = useMutation<
		unknown,
		unknown,
		PostMutationVariables
	>({
		mutationKey: ['req-post'],
		onMutate: variables => {
			queryClient.setQueryData(queryKey, (prev: Report[]) => {
				const filename = variables.data.get('filename')
				const uniqueId = variables.data.get('uniqueId')

				return [
					{
						filename,
						reportName: filename,
						dateCreated: variables.data.get('dateCreated'),
						uniqueId,
						isReady: 0
					},
					...prev
				]
			})
		}
		// TODO: onError
	})

	return (
		<FormView
			defaultValues={defaultValues}
			validationSchema={z.object(schemaShape)}
			fields={fields}
			mutation={mutation}
			path={path}
		/>
	)
}
