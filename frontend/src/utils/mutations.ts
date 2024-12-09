import { API_URL } from 'utils/config'

export interface PostMutationVariables {
	data: FormData
	authHeader: string
	path: string
}

export const reqPostMutation = {
	mutationFn: async ({
		data,
		authHeader,
		path
	}: PostMutationVariables) => {
		const req = await fetch(`${API_URL}/report/${path}`, {
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
