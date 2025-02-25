import type { Field } from 'types/field'

import { usePostMutation } from 'utils/mutations'
import { generateSchema } from './utils'
import FormView from './view'
import useAuthSuspenseQuery from 'utils/auth-suspense-query'

export default function FormManager({
  queryKey,
  path
}: {
  queryKey: string[]
  path: string
}) {
  const { data: fields, authHeader } = useAuthSuspenseQuery(
    queryKey,
    'data'
  ) as { data: Field[]; authHeader: string }

  const mutation = usePostMutation()

  const { schemaShape, defaultValues } = generateSchema(fields)

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
