import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { API_URL } from 'utils/config'

export interface PostMutationVariables {
	data: FormData
	authHeader: string
	path: string
}

export const postMutation = {
	mutationFn: async ({
		data,
		authHeader,
		path
	}: PostMutationVariables) => {
		const req = await fetch(`${API_URL}/report/${path}/`, {
			method: 'POST',
			body: data,
			headers: {
				Authorization: authHeader
			}
		})

		return await req.json()
	},
	retry: 3
}

export const usePostMutation = () => {
	const queryClient = useQueryClient()
	const navigate = useNavigate()

	return useMutation<unknown, unknown, PostMutationVariables>({
		mutationKey: ['req-post'],
		onMutate: variables => {
			queryClient.setQueryData(['user-data'], (prev: Report[]) => {
				const filename = variables.data.get('filename')
				const uniqueId = variables.data.get('uniqueId')

				return [
					{
						filename,
						reportName: filename,
						dateCreated: variables.data.get('dateCreated'),
						uniqueId,
						isReady: 0
					},
					...prev
				]
			})
		},
		onSettled: () => {
			navigate('/profile')
		}
		// TODO: onError, onSuccess
		// onSuccess must call invalidateQueries
	})
}
