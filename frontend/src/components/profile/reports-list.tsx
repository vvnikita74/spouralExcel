import type Report from 'types/report'

import timeAgo from 'utils/time-ago'
import formatDate from 'utils/format-date'

export default function ReportsList({
	data = []
}: {
	data: Report[]
}) {
	return (
		<div className='base-text flex flex-col'>
			{data.map(({ id, date_created }) => (
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
