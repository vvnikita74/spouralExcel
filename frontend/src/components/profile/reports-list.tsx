import type Report from 'types/report'

import { useEffect, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'

import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

import timeAgo from 'utils/time-ago'
import formatDate from 'utils/format-date'
import queryFetch from 'utils/query-fetch'

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
			setCurrentData(newData)
		}, 5000)

		return () => {
			clearInterval(interval)
		}
	}, [authHeader, queryClient, path, queryKey])

	return (
		<div className='base-text flex flex-col'>
			{currentData.map(({ id, date_created }) => (
				<div
					className='mt-2 flex flex-col rounded-xl border border-indigo-500 p-4
						first:mt-0'
					key={id}>
					<h2>
						Отчет от {formatDate(date_created)}
						<span className='ml-2 opacity-60'>
							({timeAgo(date_created)})
						</span>
					</h2>
				</div>
			))}
		</div>
	)
}
