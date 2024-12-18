import SpinnerIcon from 'public/icons/spinner.svg'

export default function Spinner({ className = '', ...props }) {
	return (
		<figure role='status' className='pointer-events-none' {...props}>
			<SpinnerIcon className={`${className} animate-spin`} />
			<span className='sr-only'>Загрузка...</span>
		</figure>
	)
}
