import { API_URL } from './config'
import { useSuspenseQuery } from '@tanstack/react-query'

export default function useSuspenseGetQuery(
  queryKey: string[],
  path: string,
  authHeader?: string
) {
  const { data } = useSuspenseQuery({
    queryKey: queryKey,
    queryFn: async () => {
      if (path) {
        const req = await fetch(`${API_URL}/${path}`, {
          headers: {
            Authorization: authHeader
          }
        })

        return req.json()
      }

      return null
    }
  })

  return data
}
