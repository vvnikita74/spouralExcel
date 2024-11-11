import LoginForm from 'components/auth/login-form'
import logoText from 'public/images/logo-text.webp'

export default function LoginPage() {
	return (
		<section
			className='relative flex size-full flex-col items-center justify-center
				overflow-hidden p-4'>
			<img
				src={logoText}
				alt='СПО-Урал'
				className='absolute left-4 top-4 h-14 w-auto object-contain sm:h-20'
			/>
			<h2 className='text-xl font-medium sm:text-2xl'>
				Авторизация
			</h2>
			<LoginForm className='mt-6 w-full max-w-96' />
		</section>
	)
}
