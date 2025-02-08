import type Field from 'types/field'
import type { TableFieldCell } from 'types/field'
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

	fields.forEach(
		({ type, mask, key, required, settings, construction_type }) => {
			let validator: z.ZodType

			switch (type) {
				case 'text': {
					validator = z
						.string()
						.min(required ? 1 : 0, 'Обязательное поле')
						.regex(
							new RegExp(mask || ''),
							'Введите корректное значение'
						)
					break
				}
				case 'select': {
					validator = z
						.string()
						.min(required ? 1 : 0, 'Обязательное поле')
					defaultValues[key] = ''
					break
				}
				case 'date': {
					const regex: RegExp = getDateMask(getDateType(mask))
					validator = z.string({
						message: 'Введите корректное значение'
					})

					if (regex)
						validator = (validator as z.ZodString).regex(
							new RegExp(regex),
							'Введите корректное значение'
						)

					break
				}
				case 'table': {
					const cells =
						(JSON.parse(settings || '')?.cells as [TableFieldCell]) ||
						[]

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
							.min(1, 'Обязательное поле')
							.superRefine((values, ctx) => {
								values.forEach((item, index) => {
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
		}
	)

	// console.log(schemaShape)

	const queryClient = useQueryClient()

	const mutation = useMutation<
		unknown,
		unknown,
		PostMutationVariables
	>({
		mutationKey: ['req-post'],
		onMutate: variables => {
			const dateCreated = variables.data.get('dateCreated')

			queryClient.setQueryData(queryKey, (prev: Report[]) => {
				return [
					{
						filename: dateCreated,
						dateCreated,
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
