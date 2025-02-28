import type Report from 'types/report'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { API_URL } from 'utils/config'

export interface PostMutationVariables {
  data: FormData
  authHeader: string
  path: string
}

export interface DeleteMutationVariables {
  authHeader: string
  id: number
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

export const deleteMutation = {
  mutationFn: async ({ authHeader, id }: DeleteMutationVariables) => {
    const req = await fetch(`${API_URL}/user/data/${id}/`, {
      method: 'DELETE',
      headers: {
        Authorization: authHeader
      }
    })

    return req.status === 204
  },
  retry: 0
}

export const usePostMutation = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation<unknown, unknown, PostMutationVariables>({
    mutationKey: ['req-post'],
    onMutate: async variables => {
      await queryClient.cancelQueries({ queryKey: ['user-data'] })

      const uniqueId = variables.data.get('uniqueId')
      const filename = variables.data.get('filename')
      const dateCreated = variables.data.get('dateCreated')

      queryClient.setQueryData(['user-data'], (prev: Report[]) => {
        return [
          {
            filename,
            reportName: filename,
            dateCreated,
            uniqueId,
            isReady: 0
          },
          ...prev
        ]
      })

      return { uniqueId, filename, dateCreated }
    },
    onError: (_error, _variables, context) => {
      queryClient.setQueryData(['user-data'], (prev: Report[]) => {
        const { filename, dateCreated, uniqueId } = context as Report

        const arr = [...prev]
        const index = arr.findIndex(
          item =>
            item.uniqueId ===
            (context as { uniqueId: string }).uniqueId
        )
        if (index > -1) arr[index].isReady = 2
        else
          return [
            {
              filename,
              reportName: filename,
              dateCreated,
              uniqueId,
              isReady: 2
            },
            ...arr
          ]
        return arr
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user-data'] })
    },
    onSettled: () => {
      navigate('/profile')
    }
  })
}

export const useDeleteMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<unknown, unknown, DeleteMutationVariables>({
    mutationKey: ['req-delete'],
    onError: () => {
      alert(
        'Ошибка удаления. Пожалуйста, проверьте интернет-соединение'
      )
    },
    onSuccess: (_result, variables) => {
      queryClient.setQueryData(['user-data'], (prev: Report[]) => {
        const arr = [...prev]
        const index = arr.findIndex(
          item => item.id === (variables as { id: number }).id
        )

        if (index > -1) arr[index].deleted = true

        return arr
      })
    }
  })
}
