import type Report from 'types/report'

import { MouseEvent, useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { useQueryClient } from '@tanstack/react-query'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

import { API_URL } from 'utils/config'
import formatDate from 'utils/format-date'
import queryFetch from 'utils/query-fetch'
import timeAgo from 'utils/time-ago'

import Spinner from 'components/icons/Spinner'

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

	const [currentData, setCurrentData] = useState(data)

	useEffect(() => {
		const interval = setInterval(async () => {
			const newData = await queryFetch(
				queryClient,
				queryKey,
				authHeader,
				path
			)
			const cachedData = queryClient.getQueryData(queryKey)

			console.log(newData, cachedData)
		}, 5000)

		return () => {
			clearInterval(interval)
		}
	}, [authHeader, queryClient, path, queryKey])

	const handleDeleteButton = useCallback(
		async (event: MouseEvent<HTMLButtonElement>) => {
			const { currentTarget: btn } = event
			const id = Number(btn.dataset.id)

			btn.classList.add('loading')
			btn.disabled = true

			try {
				const req = await fetch(`${API_URL}/user/data/${id}`, {
					method: 'DELETE',
					headers: {
						Authorization: authHeader
					}
				})

				if (req.status === 204) {
					queryClient.setQueryData(queryKey, (prev: Report[]) => {
						const updatedData = prev.filter(item => item.id !== id)
						setCurrentData(updatedData)
						return updatedData
					})
				} else {
					throw new Error('delete request error')
				}
			} catch {
				/* empty */
			}

			btn.classList.remove('loading')
			btn.disabled = false
		},
		[authHeader, queryClient, queryKey]
	)

	if (currentData.length === 0) {
		return <h1 className='title-text'>Отчеты отсутствуют</h1>
	}

	return (
		<div className='base-text flex flex-col'>
			{currentData.map(({ id, date_created, file_name, isReady }) => (
				<div
					className='relative mt-2 flex flex-col overflow-hidden rounded-xl border
						border-indigo-500 p-4 first:mt-0'
					key={id}>
					{isReady === 0 && (
						<div
							className='absolute left-0 top-0 z-10 flex size-full items-start justify-end
								bg-white/60 p-4'>
							<Spinner className='size-6 rounded-full fill-indigo-500 text-black' />
						</div>
					)}
					<h2 className='title-text whitespace-nowrap'>
						Отчет от {formatDate(date_created)}
						<span className='base-text block opacity-60 2xs:ml-2 2xs:inline'>
							({timeAgo(date_created)})
						</span>
					</h2>
					<div className='-mx-1 mt-2.5 flex flex-row text-center text-white'>
						<a
							href={`${API_URL}/media/${file_name}.pdf`}
							download
							rel='noopener noreferrer'
							target='_blank'
							className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl bg-indigo-500'>
							PDF
						</a>
						<Link
							to='emergencyreport?continue=id'
							className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl bg-indigo-500'>
							Редактировать
						</Link>
						<button
							type='button'
							onClick={handleDeleteButton}
							data-id={id}
							className='btn-loader base-padding base-text relative mx-1 min-w-fit flex-1
								rounded-xl bg-indigo-500'>
							<span className='pointer-events-none text-inherit transition-opacity'>
								Удалить
							</span>
							<Spinner
								className='absolute left-[calc(50%-0.75rem)] top-[calc(50%-0.75rem)] size-6
									rounded-full fill-black text-white'
							/>
						</button>
					</div>
				</div>
			))}
		</div>
	)
}
