import type Report from 'types/report'

export default function mergeReportData(
	initialData: Report[],
	receivedData: Report[]
): Report[] {
	const result = []
	const seenFileNames = new Set()

	receivedData.forEach(item => {
		result.push(item)
		seenFileNames.add(item.filename)
	})

	result.unshift(
		...initialData.filter(
			item => !seenFileNames.has(item.filename) && item.isReady === 0
		)
	)

	return result
}
