import type Field from 'types/field'
import type Report from 'types/report'
import type { PostMutationVariables } from 'utils/mutations'
import type { ZodType } from 'zod'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useCallback } from 'react'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { Controller, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import useLoader from 'utils/use-loader'

import { zodResolver } from '@hookform/resolvers/zod'

import Spinner from 'components/icons/Spinner'
import DateInput, {
	dateToString,
	stringToDate
} from 'components/input/date-input'
import SelectInput from 'components/input/select-input'
import TextInput from 'components/input/text-input'

export default function FormView({
	validationSchema,
	fields,
	defaultValues,
	queryKey,
	path
}: {
	validationSchema: ZodType
	fields: Field[]
	defaultValues: { [key: string]: string }
	queryKey: string[]
	path: string
}) {
	const authHeader = useAuthHeader()
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	const { btnRef, toggleLoader } = useLoader()

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
						file_name: dateCreated,
						date_created: dateCreated,
						isReady: 0,
						data: {}
					},
					...prev
				]
			})
		}
		// TODO: onError
	})

	const {
		register,
		handleSubmit,
		setValue,
		setError,
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

	const handleSelectChange = useCallback(
		(name: string, value: string) => {
			setValue(name, value)
			setError(name, null)
		},
		[setValue, setError]
	)

	return (
		<form
			className='base-text mb-[4.6875rem] flex flex-col'
			onSubmit={handleSubmit(onSubmit)}>
			{fields.map(
				({ type, key: inputKey, name, placeholder, settings }) => {
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
								<SelectInput
									key={inputKey}
									name={inputKey}
									placeholder={placeholder || ''}
									label={name}
									handleChange={handleSelectChange}
									values={JSON.parse(settings || '')?.values || []}
									error={(errors[inputKey]?.message as string) || ''}
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
										field: { value, onBlur, onChange }
									}) => {
										const dateType = JSON.parse(settings || '')?.type

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
														console.log(dateToString(dateType, date))
														console.log(date)
														onChange(dateToString(dateType, date))
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
				}
			)}
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
