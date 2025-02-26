import type Report from 'types/report'
import type { Ref } from 'react'

import useAuthSuspenseQuery from 'utils/auth-suspense-query'

import { forwardRef, MouseEvent, useCallback } from 'react'
import { Link } from 'react-router-dom'

import { API_URL } from 'utils/config'

import ErrorIcon from 'assets/icons/error.svg?react'
import { Spinner } from 'components/icons/Spinner'

import { timeAgo } from './utils'
import { useDeleteMutation } from 'utils/mutations'
import { useQueryClient } from '@tanstack/react-query'
import useLoader from 'utils/use-loader'

const UpdatePanel = forwardRef<
  HTMLButtonElement,
  { handleClick: () => void }
>(function UpdatePanel({ handleClick }, ref: Ref<HTMLButtonElement>) {
  return (
    <div className='absolute bottom-0 right-0 z-10 mx-4 my-3 bg-transparent'>
      <button
        type='button'
        ref={ref}
        onClick={handleClick}
        className='btn-loader base-padding base-text relative rounded-xl bg-indigo-500
          text-white'>
        <span className='pointer-events-none text-inherit'>
          Обновить
        </span>
        <Spinner
          className='absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6
            rounded-full fill-black text-white'
        />
      </button>
    </div>
  )
})

export default function ReportsList({
  queryKey = [''],
  path = ''
}: {
  queryKey: string[]
  path: string
}) {
  const { data: reports, authHeader } = useAuthSuspenseQuery(
    queryKey,
    path
  ) as { data: Report[]; authHeader: string }

  const { btnRef, toggleLoader } = useLoader()

  const queryClient = useQueryClient()
  const mutation = useDeleteMutation()

  const handleDeleteButton = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      const { currentTarget: btn } = event
      const id = Number(btn.dataset.id)

      mutation.mutate({
        id,
        authHeader
      })
    },
    [authHeader, mutation]
  )

  const handleRevalidate = useCallback(async () => {
    toggleLoader(true)
    await queryClient.invalidateQueries({ queryKey })
    toggleLoader(false)
  }, [queryClient, queryKey, toggleLoader])

  if (reports.length === 0) {
    return (
      <>
        <UpdatePanel ref={btnRef} handleClick={handleRevalidate} />
        <h1 className='title-text'>Отчеты отсутствуют</h1>
      </>
    )
  }

  return (
    <div className='base-text flex flex-col'>
      <UpdatePanel ref={btnRef} handleClick={handleRevalidate} />
      {reports.map(
        ({
          id,
          dateCreated,
          filename,
          reportName,
          isReady,
          deleted,
          uniqueId
        }) => (
          <div
            className={`relative mt-2 flex flex-col overflow-hidden rounded-xl border p-4
            first:mt-0 ${isReady !== 2 ? 'border-indigo-500' : 'border-red-500'}`}
            key={uniqueId}>
            {(isReady === 0 || deleted) && (
              <div
                className='absolute left-0 top-0 z-10 flex size-full items-start justify-end
                  bg-white/60 p-4'>
                {isReady === 0 && (
                  <Spinner className='size-6 rounded-full fill-indigo-500 text-black' />
                )}
              </div>
            )}
            {isReady === 2 && (
              <ErrorIcon className='absolute right-4 top-4 size-6 text-red-500' />
            )}
            <h2 className='title-text whitespace-nowrap'>
              {reportName}
              <span className='base-text block opacity-60 2xs:ml-2 2xs:inline'>
                {deleted
                  ? '(удалено)'
                  : dateCreated
                    ? `(${timeAgo(dateCreated)})`
                    : ''}
              </span>
            </h2>
            <div className='-mx-1 mt-2.5 flex flex-row text-center text-white'>
              {isReady !== 2 && (
                <a
                  href={`${API_URL}/media/${filename}.pdf`}
                  download
                  rel='noopener noreferrer'
                  target='_blank'
                  className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl bg-indigo-500'>
                  PDF
                </a>
              )}
              <Link
                to='emergencyreport?continue=id'
                className={`base-padding base-text mx-1 min-w-fit flex-1 rounded-xl opacity-60
                ${isReady !== 2 ? 'bg-indigo-500' : 'bg-red-500'}`}>
                {isReady !== 2 ? 'Редактировать' : 'Повторить'}
              </Link>
              <button
                type='button'
                onClick={handleDeleteButton}
                data-id={id}
                className={`base-padding base-text relative mx-1 min-w-fit flex-1 rounded-xl
                ${isReady !== 2 ? 'bg-indigo-500' : 'bg-red-500'}`}>
                <span className='pointer-events-none text-inherit'>
                  Удалить
                </span>
              </button>
            </div>
          </div>
        )
      )}
    </div>
  )
}
