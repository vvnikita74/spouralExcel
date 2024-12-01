import { API_URL } from 'utils/config'
import type { QueryClient } from '@tanstack/react-query'

export default function queryFetch(
	queryClient: QueryClient,
	queryKey = ['data'],
	authHeader = 'Bearer ',
	path = ''
) {
	return queryClient.fetchQuery({
		queryKey,
		queryFn: async () => {
			try {
				const req = await fetch(`${API_URL}/${path}`, {
					headers: {
						Authorization: authHeader
					}
				})
				return req.json()
			} catch {
				const data = queryClient.getQueryData(queryKey) || null

				if (data) return data
				throw new Error('Ошибка получения данных')
			}
		}
	})
}
