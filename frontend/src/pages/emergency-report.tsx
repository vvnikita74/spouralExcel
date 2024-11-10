import { useQuery } from '@tanstack/react-query'

export default function EmergencyReportPage() {
	const { data } = useQuery({ queryKey: ['emergencyreport'] })
	console.log(data)

	return <h1>{data ? 'Data is here' : 'No data'}</h1>
}
