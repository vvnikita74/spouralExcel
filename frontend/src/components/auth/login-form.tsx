import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'

import useSignIn from 'react-auth-kit/hooks/useSignIn'

import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { Spinner } from 'components/icons/Spinner'
import TextInput from 'components/input/text-input'

import { API_URL } from 'utils/config'
import useLoader from 'utils/use-loader'

const schema = z.object({
  username: z.string().min(1, 'Обязательное поле'),
  password: z.string().min(1, 'Обязательное поле')
})

export default function LoginForm({ className = '' }) {
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema)
  })

  const { btnRef, toggleLoader } = useLoader()
  const signIn = useSignIn()
  const navigate = useNavigate()

  const onSubmit = useCallback(
    async (data: { username: string; password: string }) => {
      toggleLoader(true)

      try {
        const req = await fetch(`${API_URL}/token/`, {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(data)
        })

        if (req.status === 401) throw new Error('credentials')

        const { access: token } = await req.json()

        if (
          signIn({
            auth: {
              token,
              type: 'Bearer'
            },
            userState: {
              username: data.username
            }
          })
        )
          navigate('/')
        else throw new Error('signIn')
      } catch (error) {
        setError('username', {
          type: 'manual',
          message:
            error.message === 'credentials'
              ? 'Неверный логин или пароль'
              : 'Ошибка авторизации'
        })
        setValue('password', '')
      }

      toggleLoader(false)
    },
    [toggleLoader, setError, setValue, navigate, signIn]
  )

  return (
    <form className={className} onSubmit={handleSubmit(onSubmit)}>
      <TextInput
        name='username'
        placeholder='Имя пользователя'
        type='text'
        required={false}
        error={(errors.username?.message as string) || ''}
        inputProps={register('username')}
      />
      <TextInput
        name='password'
        required={false}
        placeholder='Пароль'
        type='password'
        error={(errors.password?.message as string) || ''}
        inputProps={register('password')}
      />
      <button
        type='submit'
        ref={btnRef}
        className='base-text btn-loader base-padding w-full rounded-xl bg-indigo-500
          text-white'>
        <span className='pointer-events-none text-inherit'>
          Войти
        </span>
        <Spinner
          className='absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6
            rounded-full fill-black text-white'
        />
      </button>
    </form>
  )
}
