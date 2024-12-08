import type Field from 'types/field'
import type { ZodType } from 'zod'

// import { useMutation } from '@tanstack/react-query'
import { useCallback } from 'react'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import useLoader from 'utils/use-loader'

import { zodResolver } from '@hookform/resolvers/zod'
import { API_URL } from 'utils/config'

import Spinner from 'components/icons/Spinner'
import SelectInput from 'components/input/select-input'
import TextInput from 'components/input/text-input'

export default function FormView({
	validationSchema,
	fields,
	defaultValues
}: {
	validationSchema: ZodType
	fields: Field[]
	defaultValues: { [key: string]: string }
}) {
	const {
		register,
		handleSubmit,
		setValue,
		setError,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(validationSchema),
		defaultValues
	})

	const { btnRef, toggleLoader } = useLoader()
	const authHeader = useAuthHeader()
	const navigate = useNavigate()

	// const mutation = useMutation({ mutationKey: ['emergency-report'] })

	const onSubmit = useCallback(
		async (data: { [key: string]: string }) => {
			toggleLoader(true)

			const formData = new FormData()

			for (const key in data) {
				formData.append(key, data[key] || '')
			}

			// mutation.mutate({ data: formData, authHeader })

			const req = await fetch(`${API_URL}/report/emergency`, {
				method: 'POST',
				headers: {
					Authorization: authHeader
				},
				body: formData
			})

			if (req.status === 200) navigate('/profile')
			toggleLoader(false)
		},
		[toggleLoader, navigate, authHeader]
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
			className='base-text mb-14 flex flex-col'
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
					}
				}
			)}
			<button
				type='submit'
				ref={btnRef}
				className='base-text btn-loader base-padding absolute bottom-4 right-4 w-fit
					rounded-xl bg-indigo-500 text-white'>
				<span className='pointer-events-none text-inherit transition-opacity'>
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
