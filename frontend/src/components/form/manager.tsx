import type { Field } from 'types/field'

import { usePostMutation } from 'utils/mutations'
import { generateSchema } from './utils'
import FormView from './view'
import useSuspenseGetQuery from 'utils/suspense-get-query'
import useAuthHeader from 'react-auth-kit/hooks/useAuthHeader'

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
  ) as { data: Record<string, unknown> }) || { data: null }

  console.log(initialData)

  const fields = useSuspenseGetQuery(
    queryKey,
    'data',
    authHeader
  ) as Field[]

  const mutation = usePostMutation()

  const { schemaShape, defaultValues } = generateSchema(
    fields,
    initialData
  )

  const submitFn = (data: FormData) => {
    mutation.mutate({
      data,
      authHeader,
      path
    })
  }

  return (
    <FormView
      defaultValues={defaultValues}
      validationSchema={schemaShape}
      fields={fields}
      submitFn={submitFn}
    />
  )
}
