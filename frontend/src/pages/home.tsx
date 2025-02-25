import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className='flex size-full flex-col items-start justify-start'>
      <div
        className='flex w-full flex-col overflow-hidden rounded-xl border
          border-indigo-500 p-4 sm:flex-row sm:items-center sm:justify-between'>
        <h2 className='title-text'>Аварийные объекты</h2>
        <div className='base-text flex w-full flex-col items-center sm:w-fit sm:flex-row'>
          <Link
            to='emergencyreport'
            className='base-padding mt-2.5 block w-full rounded-xl bg-indigo-500 text-center
              text-white sm:ml-4 sm:mt-0 sm:w-fit'>
            Начать
          </Link>
          <Link
            to='emergencyreport?type=continue'
            className='base-padding pointer-events-none mt-2 block w-full rounded-xl
              bg-indigo-500 text-center text-white opacity-60 sm:ml-4 sm:mt-0
              sm:w-fit'>
            Продолжить
          </Link>
        </div>
      </div>
    </div>
  )
}
