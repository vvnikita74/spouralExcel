import { Suspense } from 'react'

import ReportsList from 'components/profile/reports-list'
import { SpinnerContainer } from 'components/icons/Spinner'

export default function ProfilePage() {
  return (
    <Suspense fallback={<SpinnerContainer />}>
      <ReportsList path='user/data' queryKey={['user-data']} />
    </Suspense>
  )
}
