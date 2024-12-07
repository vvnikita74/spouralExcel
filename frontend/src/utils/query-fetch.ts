import type { QueryClient } from '@tanstack/react-query'
import { API_URL } from 'utils/config'

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
				return await req.json()
			} catch {
				const data = queryClient.getQueryData(queryKey) || null
				if (data) return data
				throw new Error('Ошибка получения данных')
			}
		}
	})
}
