import type Report from 'types/report'

export default function mergeReportData(
	initialData: Report[],
	receivedData: Report[]
): Report[] {
	const uniqueFilesMap = new Map()

	receivedData.forEach(item => {
		uniqueFilesMap.set(item.file_name, item)
	})

	initialData.forEach(item => {
		if (!uniqueFilesMap.has(item.file_name)) {
			uniqueFilesMap.set(item.file_name, item)
		}
	})

	const uniqueFilesArray = []

	receivedData.forEach(item => {
		if (
			!initialData.some(
				initItem => initItem.file_name === item.file_name
			)
		) {
			uniqueFilesArray.push(item)
		}
	})

	initialData.forEach(item => {
		uniqueFilesArray.push(uniqueFilesMap.get(item.file_name))
	})

	return uniqueFilesArray
}
