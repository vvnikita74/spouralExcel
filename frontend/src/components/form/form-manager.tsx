import type Field from 'types/field'
import type Report from 'types/report'
import type { PostMutationVariables } from 'utils/mutations'

import { useMutation, useQueryClient } from '@tanstack/react-query'
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
				let regex: RegExp

				switch (mask) {
					case 'monthFullYear':
						regex = /^(0[1-9]|1[0-2])\.\d{4}$/
						break
					case 'dayMonth':
						regex = /^(0?[1-9]|[12][0-9]|3[01])\.(0?[1-9]|1[0-2])$/
						break
					default:
						regex = /^(0[1-9]|1[0-2])\.\d{2}$/
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

	const queryClient = useQueryClient()

	const mutation = useMutation<
		unknown,
		unknown,
		PostMutationVariables
	>({
		mutationKey: ['req-post'],
		onMutate: variables => {
			const dateCreated = variables.data.get('dateCreated')

			queryClient.setQueryData(queryKey, (prev: Report[]) => [
				{
					file_name: dateCreated,
					date_created: dateCreated,
					isReady: 0
				},
				...prev
			])
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
