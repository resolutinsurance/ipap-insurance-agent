'use client'
import PaymentScheduleDetails from '@/components/dashboard/payment/details/payment-schedule'
import PolicyDetails from '@/components/dashboard/payment/details/policy-details'
import { usePaymentScheduleData } from '@/hooks/use-premium-financing'
import { useSingleQuotePayment } from '@/hooks/use-quote-payments'
import { PaymentSchedule } from '@/lib/interfaces'
import {
  Card,
  CardContent,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@resolutinsurance/ipap-shared/components'

const AgentPaymentPage = ({ id }: { id: string }) => {
  const activeTab = 'details'

  // Fetch all payments for this entityid
  const { data: purchaseData, isLoading: isLoadingProductPayments } =
    useSingleQuotePayment(id)

  const { paymentScheduleData, isLoadingPaymentSchedule, hasPaymentSchedule } =
    usePaymentScheduleData(purchaseData, id)

  const isLoading = isLoadingProductPayments

  return (
    <Card>
      <CardContent>
        <Tabs defaultValue={activeTab} className="space-y-3 sm:space-y-4">
          <TabsList className="w-full sm:w-max">
            <TabsTrigger
              value="details"
              className="flex-1 text-sm sm:flex-none sm:text-base"
            >
              Details
            </TabsTrigger>
            {hasPaymentSchedule && (
              <TabsTrigger
                value="payment-schedule"
                className="flex-1 text-sm sm:flex-none sm:text-base"
              >
                Payment Schedule
              </TabsTrigger>
            )}
          </TabsList>
          <TabsContent value="details" className="space-y-4 sm:space-y-6">
            {isLoading ? (
              <div className="py-6 text-center sm:py-8">
                <p className="text-muted-foreground text-sm sm:text-base">
                  Loading policy details...
                </p>
              </div>
            ) : purchaseData ? (
              <PolicyDetails record={purchaseData} />
            ) : (
              <div className="py-6 text-center sm:py-8">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No policy details available
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="payment-schedule"
            className="space-y-3 sm:space-y-4"
          >
            {isLoadingPaymentSchedule ? (
              <div className="py-6 text-center sm:py-8">
                <p className="text-muted-foreground text-sm sm:text-base">
                  Loading payment schedule...
                </p>
              </div>
            ) : paymentScheduleData ? (
              <PaymentScheduleDetails
                record={paymentScheduleData as PaymentSchedule}
                purchaseData={purchaseData}
              />
            ) : (
              <div className="py-6 text-center sm:py-8">
                <p className="text-muted-foreground text-sm sm:text-base">
                  No payment schedule available
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

export default AgentPaymentPage
