import type { Field } from 'types/field'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'
import { useSuspenseQuery } from '@tanstack/react-query'

import { generateSchema, generateDefaultValues } from './utils'
import { usePostMutation } from 'utils/mutations'
import useSuspenseGetQuery from 'utils/suspense-get-query'

import FormView from './view'

export default function FormManager({
  queryKey,
  path,
  search
}: {
  queryKey: string[]
  path: string
  search: string
}) {
  const authHeader = useAuthHeader()

  const { data: initialData } = (useSuspenseGetQuery(
    [`user/data/${search}`],
    search ? `user/data/${search}` : '',
    authHeader
  ) as { data: Record<string, unknown> }) || {
    data: null
  }

  const fields = useSuspenseGetQuery(
    queryKey,
    'data',
    authHeader
  ) as Field[]

  const mutation = usePostMutation()

  const { data: defaultData } = useSuspenseQuery({
    queryKey: ['formConfig', queryKey, search],
    queryFn: async () => generateDefaultValues(fields, initialData),
    staleTime: 0,
    gcTime: 0
  })

  const submitFn = (data: FormData) => {
    mutation.mutate({
      data,
      authHeader,
      path
    })
  }

  return (
    <FormView
      defaultValues={defaultData}
      validationSchema={generateSchema(fields)}
      fields={fields}
      submitFn={submitFn}
    />
  )
}
