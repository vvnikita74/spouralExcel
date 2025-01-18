import type Report from 'types/report'

export default function mergeReportData(
	initialData: Report[],
	receivedData: Report[]
): Report[] {
	const result = []
	const seenFileNames = new Set()

	receivedData.forEach(item => {
		result.push(item)
		seenFileNames.add(item.file_name)
	})

	result.unshift(
		...initialData.filter(
			item => !seenFileNames.has(item.file_name) && item.isReady === 0
		)
	)

	return result
}
