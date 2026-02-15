'use client'

import FindCustomerPolicyDetailsForCompany from '@/components/dashboard/find-policy'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'

const FindPolicyPage = () => {
  return (
    <Card>
      <CardContent>
        <FindCustomerPolicyDetailsForCompany />
      </CardContent>
    </Card>
  )
}

export default FindPolicyPage
