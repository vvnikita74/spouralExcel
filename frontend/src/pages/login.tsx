import logoText from 'assets/images/logo-text.webp'
import LoginForm from 'components/auth/login-form'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { Navigate } from 'react-router'

export default function LoginPage() {
  const authHeader = useAuthHeader()

  if (authHeader) return <Navigate to='/' replace />

  return (
    <section
      className='relative flex size-full flex-col items-center justify-center
        overflow-hidden p-4'>
      <div
        className='absolute left-4 top-4 flex w-[calc(100%-2rem)] flex-row items-center
          justify-between'>
        <img
          src={logoText}
          alt='СПО-Урал'
          loading='lazy'
          className='h-14 w-auto object-contain sm:h-16'
        />
        <h2 className='text-xl font-medium sm:text-2xl'>
          Авторизация
        </h2>
      </div>
      <LoginForm className='w-full max-w-96' />
    </section>
  )
}
