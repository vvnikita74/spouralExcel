import LoginForm from 'components/auth/login-form'

export default function LoginPage() {
	return (
		<div
			className='relative flex h-screen w-screen flex-col items-center
				justify-center overflow-hidden p-4'>
			<img
				src='/logo.webp'
				alt='СПО-Урал'
				loading='lazy'
				className='absolute left-4 top-4 h-12 w-auto max-w-[calc(100%-2rem)]
					object-contain sm:h-16'
			/>
			<h1 className='text-center text-xl font-medium sm:text-2xl'>
				Авторизация
			</h1>
			<LoginForm className='mt-6 w-full max-w-96' />
		</div>
	)
}
