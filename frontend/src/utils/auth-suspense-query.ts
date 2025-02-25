import { API_URL } from './config'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { useSuspenseQuery } from '@tanstack/react-query'

export default function useAuthSuspenseQuery(
  queryKey: string[],
  path: string
) {
  const authHeader = useAuthHeader()

  const { data } = useSuspenseQuery({
    queryKey: queryKey,
    queryFn: async () => {
      const req = await fetch(`${API_URL}/${path}`, {
        headers: {
          Authorization: authHeader
        }
      })

      return req.json()
    }
  })

  return { data, authHeader }
}
