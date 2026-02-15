'use client'

import InfoRow from '@/components/dashboard/payment/details/info-row'
import { useAgent } from '@/hooks/use-agent'
import { prepareObjectFields } from '@/lib/data-renderer'
import { formatDateForInput } from '@/lib/utils'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'

export const AgentProfileSection = () => {
  const { agent, isLoading } = useAgent()

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">Loading agent profile...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!agent) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="py-8 text-center">
            <p className="text-muted-foreground">No agent profile found</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  // Prepare agent data for display
  const agentDisplayData: Record<string, unknown> = {
    'Agent ID': agent.id,
    'Years of Experience': agent.yearsofExperience,
    'Company ID': agent.companyID || 'N/A (Independent Agent)',
    'Created At': agent.createdAt ? formatDateForInput(agent.createdAt) : 'N/A',
    'Updated At': agent.updatedAt ? formatDateForInput(agent.updatedAt) : 'N/A',
  }

  // Prepare user data if available
  const userDisplayData: Record<string, unknown> = agent.user
    ? {
        'Full Name': agent.user.fullname,
        Email: agent.user.email || 'N/A',
        Phone: agent.user.phone,
        Address: agent.user.address || 'N/A',
        'Date of Birth': agent.user.dob
          ? formatDateForInput(agent.user.dob)
          : 'N/A',
      }
    : {}

  // Prepare document links if available
  const documentData: Record<string, unknown> = {}
  if (agent.passportpicAgent) {
    documentData['Passport Picture'] = agent.passportpicAgent
  }
  if (agent.pasportpicGuarantor) {
    documentData['Guarantor Passport'] = agent.pasportpicGuarantor
  }
  if (agent.agentidCard) {
    documentData['Agent ID Card'] = agent.agentidCard
  }
  if (agent.guarantoridCard) {
    documentData['Guarantor ID Card'] = agent.guarantoridCard
  }
  if (agent.educationQualification) {
    documentData['Education Qualification'] = agent.educationQualification
  }

  return (
    <div className="space-y-6">
      {Object.keys(userDisplayData).length > 0 && (
        <Card>
          <CardContent className="space-y-10">
            <div className="space-y-4">
              <h2 className="text-lg font-medium">Agent Information</h2>
              <p className="text-muted-foreground text-sm">
                Your agent profile details
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {prepareObjectFields(agentDisplayData).map(({ key, value }) => (
                  <InfoRow key={key} label={key} value={value as unknown} />
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-lg font-medium">User Information</h2>
              <p className="text-muted-foreground text-sm">
                Associated user account details
              </p>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {prepareObjectFields(userDisplayData).map(({ key, value }) => (
                  <InfoRow key={key} label={key} value={value as unknown} />
                ))}
              </div>
            </div>

            {Object.keys(documentData).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-medium">Documents</h2>
                <p className="text-muted-foreground text-sm">
                  Uploaded documents and certificates
                </p>
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  {prepareObjectFields(documentData).map(({ key, value }) => (
                    <InfoRow key={key} label={key} value={value as unknown} />
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
