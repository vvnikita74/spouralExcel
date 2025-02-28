import SpinnerIcon from 'assets/icons/spinner.svg?react'

export function Spinner({ className = '', ...props }) {
  return (
    <figure role='status' className='pointer-events-none' {...props}>
      <SpinnerIcon className={`${className} animate-spin`} />
      <span className='sr-only'>Загрузка...</span>
    </figure>
  )
}

export function SpinnerContainer({
  text = 'Получение данных'
}: {
  text?: string
}) {
  return (
    <div className='flex size-full flex-col items-center justify-center'>
      <Spinner className='size-6 rounded-full fill-black text-indigo-500' />
      <span className='mt-1 text-sm'>{text}</span>
    </div>
  )
}
