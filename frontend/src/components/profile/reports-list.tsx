import type Report from 'types/report'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

import timeAgo from 'utils/time-ago'
import formatDate from 'utils/format-date'
import queryFetch from 'utils/query-fetch'
import { Link } from 'react-router-dom'
import { API_URL } from 'utils/config'

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
			setCurrentData(
				await queryFetch(queryClient, queryKey, authHeader, path)
			)
		}, 5000)

		return () => {
			clearInterval(interval)
		}
	}, [authHeader, queryClient, path, queryKey])

	return (
		<div className='base-text flex flex-col'>
			{currentData.map(({ id, date_created, file_name }) => (
				<div
					className='mt-2 flex flex-col rounded-xl border border-indigo-500 p-4
						first:mt-0'
					key={id}>
					<h2 className='title-text whitespace-nowrap'>
						Отчет от {formatDate(date_created)}
						<span className='base-text block opacity-60 2xs:ml-2 2xs:inline'>
							({timeAgo(date_created)})
						</span>
					</h2>
					<div className='-mx-1 mt-2.5 flex flex-row text-center text-white'>
						<a
							href={`${API_URL}/media/${file_name}.xlsx`}
							download
							rel='noopener noreferrer'
							target='_blank'
							className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl
								bg-indigo-500'>
							XLSX
						</a>
						<a
							href={`${API_URL}/media/${file_name}.pdf`}
							download
							rel='noopener noreferrer'
							target='_blank'
							className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl
								bg-indigo-500'>
							PDF
						</a>
						<Link
							to='emergencyreport?continue=id'
							className='base-padding base-text mx-1 min-w-fit flex-1 rounded-xl
								bg-indigo-500'>
							Редактировать
						</Link>
					</div>
				</div>
			))}
		</div>
	)
}
