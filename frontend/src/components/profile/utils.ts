import type Report from 'types/report'

const forms: { [key: string]: string[] } = {
  секунда: ['секунда', 'секунды', 'секунд'],
  минута: ['минута', 'минуты', 'минут'],
  час: ['час', 'часа', 'часов'],
  день: ['день', 'дня', 'дней'],
  неделя: ['неделя', 'недели', 'недель'],
  месяц: ['месяц', 'месяца', 'месяцев'],
  год: ['год', 'года', 'лет']
}

const units: { name: string; seconds: number }[] = [
  { name: 'секунда', seconds: 1 },
  { name: 'минута', seconds: 60 },
  { name: 'час', seconds: 3600 },
  { name: 'день', seconds: 86400 },
  { name: 'неделя', seconds: 604800 },
  { name: 'месяц', seconds: 2592000 },
  { name: 'год', seconds: 31536000 }
]

const getPluralForm = (count: number, unit: string): string => {
  if (count % 10 === 1 && count % 100 !== 11) {
    return forms[unit][0]
  }
  if (
    [2, 3, 4].includes(count % 10) &&
    ![12, 13, 14].includes(count % 100)
  ) {
    return forms[unit][1]
  }
  return forms[unit][2]
}

export function timeAgo(isoDate: string): string {
  const now = new Date()
  const past = new Date(isoDate)
  const diffInSeconds = Math.floor(
    (now.getTime() - past.getTime()) / 1000
  )

  for (let i = units.length - 1; i >= 0; i -= 1) {
    const unit = units[i]
    const count = Math.floor(diffInSeconds / unit.seconds)
    if (count >= 1) {
      return `${count} ${getPluralForm(count, unit.name)} назад`
    }
  }

  return 'только что'
}

export function mergeReportData(
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
