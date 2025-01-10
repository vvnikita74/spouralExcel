import type { UseMutationResult } from '@tanstack/react-query'
import type Field from 'types/field'
import type { PostMutationVariables } from 'utils/mutations'
import type { ZodType } from 'zod'

import { useCallback } from 'react'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import useLoader from 'utils/use-loader'

import { zodResolver } from '@hookform/resolvers/zod'

import Spinner from 'components/icons/Spinner'
import DateInput, {
	dateToString,
	getDateType,
	stringToDate
} from 'components/input/date-input'
import SelectInput from 'components/input/select-input'
import TextInput from 'components/input/text-input'

export default function FormView({
	validationSchema,
	fields,
	defaultValues,
	path,
	mutation
}: {
	validationSchema: ZodType
	fields: Field[]
	defaultValues: { [key: string]: string }
	path: string
	mutation: UseMutationResult<unknown, unknown, PostMutationVariables>
}) {
	const authHeader = useAuthHeader()
	const navigate = useNavigate()

	const { btnRef, toggleLoader } = useLoader()

	const {
		register,
		handleSubmit,
		control,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues
	})

	const onSubmit = useCallback(
		async (data: { [key: string]: string }) => {
			toggleLoader(true)

			const formData = new FormData()

			for (const key in data) {
				formData.append(key, data[key] || '')
			}

			const date = new Date().toISOString()

			formData.append('dateCreated', date)
			formData.append('filename', date)

			mutation.mutate({
				data: formData,
				authHeader,
				path
			})

			setTimeout(() => {
				toggleLoader(false)
				navigate('/profile')
			}, 500)
		},
		[toggleLoader, authHeader, mutation, path, navigate]
	)

	const renderField = useCallback(
		({
			type,
			key: inputKey,
			name,
			placeholder,
			settings,
			mask
		}: Field) => {
			switch (type) {
				case 'text':
					return (
						<TextInput
							key={inputKey}
							name={inputKey}
							placeholder={placeholder || ''}
							label={name}
							type='text'
							error={(errors[inputKey]?.message as string) || ''}
							inputProps={register(inputKey)}
						/>
					)
				case 'select':
					return (
						<Controller
							name={inputKey}
							control={control}
							defaultValue={null}
							key={inputKey}
							render={({ field }) => (
								<SelectInput
									placeholder={placeholder || ''}
									label={name}
									inputProps={field}
									values={JSON.parse(settings || '')?.values || []}
									error={(errors[inputKey]?.message as string) || ''}
								/>
							)}
						/>
					)
				case 'date':
					return (
						<Controller
							name={inputKey}
							control={control}
							defaultValue={null}
							key={inputKey}
							render={({
								field: { value, onBlur, onChange: fieldOnChange }
							}) => {
								const dateType = getDateType(mask)

								return (
									<DateInput
										type={dateType}
										name={inputKey}
										placeholder={placeholder || ''}
										label={name}
										inputProps={{
											value: value
												? stringToDate(dateType, value)
												: null,
											onBlur,
											onChange: (date: Date | null) => {
												fieldOnChange(dateToString(dateType, date))
											}
										}}
										error={
											(errors[inputKey]?.message as string) || ''
										}
									/>
								)
							}}
						/>
					)
			}
		},
		[control, errors, register]
	)

	return (
		<form
			className='base-text mb-[4.6875rem] flex flex-col'
			onSubmit={handleSubmit(onSubmit)}>
			{fields.map(renderField)}
			<button
				type='submit'
				ref={btnRef}
				className='base-text btn-loader base-padding absolute bottom-4 right-4 w-fit
					rounded-xl bg-indigo-500 text-white'>
				<span className='pointer-events-none text-inherit'>
					Отправить
				</span>
				<Spinner
					className='absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6
						rounded-full fill-black text-white'
				/>
			</button>
		</form>
	)
}
