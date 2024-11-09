import { useCallback } from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import TextInput from 'components/form/text-input'

const schema = z.object({
	username: z.string().min(1, 'Обязательное поле'),
	password: z.string()
})

export default function LoginForm({ className = '' }) {
	const {
		register,
		handleSubmit,
		// setError,
		// setValue,
		formState: { errors }
	} = useForm({
		resolver: zodResolver(schema)
	})

	const onSubmit = useCallback(
		(data: { username: string; password: string }) => {
			console.log(data)
		},
		[]
	)

	return (
		<form
			className={className}
			onSubmit={handleSubmit(onSubmit)}>
			<TextInput
				name='username'
				placeholder='Имя пользователя'
				type='text'
				error={(errors.name?.message as string) || ''}
				inputProps={register('username')}
			/>
			<TextInput
				name='password'
				placeholder='Пароль'
				type='password'
				error={(errors.password?.message as string) || ''}
				inputProps={register('password')}
			/>
		</form>
	)
}
