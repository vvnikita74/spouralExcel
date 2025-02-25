import { Suspense } from 'react'

import FormManager from 'components/form/manager'
import { SpinnerContainer } from 'components/icons/Spinner'

export default function EmergencyReportPage() {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      <FormManager
        queryKey={['emergency-report-fields']}
        path='emergency'
      />
    </Suspense>
  )
}
