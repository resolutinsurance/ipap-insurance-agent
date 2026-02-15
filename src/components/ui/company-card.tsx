import { API_BASE_URL } from '@/lib/constants'
import { InsuranceCompany } from '@/lib/interfaces'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'

const CompanyCard = ({ company }: { company: InsuranceCompany }) => {
  const remoteLogo = company.companylogo
    ? API_BASE_URL + '/uploads/' + company.companylogo
    : '/assets/placeholder.svg'
  const logo = remoteLogo ?? '/assets/placeholder.svg'
  return (
    <Card className="overflow-clip border-none p-0">
      <CardContent className="p-0">
        <div className="relative h-60 w-full">
          <Image
            src={logo}
            alt={company.name ?? 'Company Logo'}
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-4 p-5">
          <div>
            <h3 className="font-semibold">{company.name}</h3>
            <p className="text-muted-foreground text-sm">
              {company.postAddress ?? 'No address'}
            </p>
          </div>
          {company.coveredRiskTypes.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {company.coveredRiskTypes.map((type) => (
                <span
                  key={type}
                  className={`rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium`}
                >
                  {type}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              No risk types covered
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default CompanyCard
