import type Report from 'types/report'

import {
	MouseEvent,
	useCallback,
	useEffect,
	useRef,
	useState
} from 'react'
import { Link } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import queryFetch from 'utils/query-fetch'

import { API_URL } from 'utils/config'
import { formatDate } from 'utils/format-date'
import mergeReportData from 'utils/merge-data'
import timeAgo from 'utils/time-ago'

import Spinner from 'components/icons/Spinner'
import ErrorIcon from 'public/icons/error.svg'

export default function ReportsList({
	data = [],
	queryKey = [''],
	path = ''
}: {
	data: Report[]
	queryKey: [string]
	path: string
}) {
	const queryClient = useQueryClient()
	const authHeader = useAuthHeader()
	const disableIntervalRef = useRef(false)

	/*
	mergeReportData
	для реализации отображения оффлайн post-запроса
	В случае отправки запроса в оффлайн и дальнейшей переходе
	в онлайн запрос еще не отправился, следовательно - требуется
	merge данных с кеша и полученных данных с запроса
	*/
	const [currentData, setCurrentData] = useState(
		mergeReportData(
			queryClient.getQueryData(queryKey) as Report[],
			data
		)
	)

	const handleDeleteButton = useCallback(
		async (event: MouseEvent<HTMLButtonElement>) => {
			const { currentTarget: btn } = event
			const id = Number(btn.dataset.id)

			btn.classList.add('loading')
			btn.disabled = true
			disableIntervalRef.current = true

			try {
				const req = await fetch(`${API_URL}/${path}/${id}`, {
					method: 'DELETE',
					headers: {
						Authorization: authHeader
					}
				})

				if (req.status === 204) {
					queryClient.setQueryData(queryKey, (prev: Report[]) =>
						prev.filter(item => item.id !== id)
					)

					setCurrentData(prev =>
						prev.map(item =>
							item.id === id ? { ...item, deleted: true } : item
						)
					)
				} else {
					throw new Error('delete request error')
				}
			} catch {
				alert(
					'Произошла ошибка удаления. Проверьте интернет-подключение'
				)
				/* empty */
			}

			btn.classList.remove('loading')
			btn.disabled = false
			disableIntervalRef.current = false
		},
		[authHeader, queryClient, queryKey, path]
	)

	useEffect(() => {
		const interval = setInterval(async () => {
			const { current: isDisabled } = disableIntervalRef

			if (!isDisabled) {
				const receivedData = await queryFetch(
					queryClient,
					queryKey,
					authHeader,
					path
				)

				setCurrentData(prev => mergeReportData(prev, receivedData))
			} else {
				disableIntervalRef.current = false
			}
		}, 5000)

		return () => {
			clearInterval(interval)
		}
	}, [authHeader, queryClient, path, queryKey])

	if (currentData.length === 0) {
		return <h1 className='title-text'>Отчеты отсутствуют</h1>
	}

	return (
		<div className='base-text flex flex-col'>
			{currentData.map(
				({ id, date_created, file_name, isReady, deleted }) => (
					<div
						className={`relative mt-2 flex flex-col overflow-hidden rounded-xl border p-4
						first:mt-0 ${isReady !== 2 ? 'border-indigo-500' : 'border-red-500'}`}
						key={file_name}>
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
							Отчет от {formatDate(date_created)}
							<span className='base-text block opacity-60 2xs:ml-2 2xs:inline'>
								({deleted ? 'удалено' : timeAgo(date_created)})
							</span>
						</h2>
						<div className='-mx-1 mt-2.5 flex flex-row text-center text-white'>
							{isReady !== 2 && (
								<a
									href={`${API_URL}/media/${file_name}.pdf`}
									download
									rel='noopener noreferrer'
									target='_blank'
									className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl bg-indigo-500'>
									PDF
								</a>
							)}
							<Link
								to='emergencyreport?continue=id'
								className={`base-padding base-text mx-1 min-w-fit flex-1 rounded-xl
								${isReady !== 2 ? 'bg-indigo-500' : 'bg-red-500'}`}>
								{isReady !== 2 ? 'Редактировать' : 'Повторить'}
							</Link>
							<button
								type='button'
								onClick={handleDeleteButton}
								data-id={id}
								className={`btn-loader base-padding base-text relative mx-1 min-w-fit flex-1
								rounded-xl ${isReady !== 2 ? 'bg-indigo-500' : 'bg-red-500'}`}>
								<span className='pointer-events-none text-inherit'>
									Удалить
								</span>
								<Spinner
									className='absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6
										rounded-full fill-black text-white'
								/>
							</button>
						</div>
					</div>
				)
			)}
		</div>
	)
}
