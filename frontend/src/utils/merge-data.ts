import type Report from 'types/report'

export default function mergeReportData(
	initialData: Report[],
	receivedData: Report[],
	mergeKey: string
): Report[] {
	const result = []
	const seenFileNames = new Set()

	receivedData.forEach(item => {
		result.push(item)
		seenFileNames.add(item[mergeKey])
	})

	result.unshift(
		...initialData.filter(
			item => !seenFileNames.has(item[mergeKey]) && item.isReady === 0
		)
	)

	return result
}
