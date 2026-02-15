'use client'
import { RenderDataTable } from '@/components/table'
import { Button } from '@resolutinsurance/ipap-shared/components'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@resolutinsurance/ipap-shared/components'
import { useSingleCustomer } from '@/hooks/use-agent'
import {
  useFinancialAccountingEntriesByEntityId,
  useTransactionJournalEntriesByEntityId,
} from '@/hooks/use-finances'
import {
  FINANCIAL_ENTRIES_COLUMNS,
  QUOTE_PAYMENT_COLUMNS,
  TRANSACTION_JOURNAL_COLUMNS,
} from '@/lib/columns'
import { formatDate } from '@/lib/utils'
import { Icon } from '@iconify/react'
import { Flag, Pencil } from 'lucide-react'
import { useParams } from 'next/navigation'
import React from 'react'

const Page = () => {
  const { id } = useParams()
  const [activeTab, setActiveTab] = React.useState('request-quotes')
  const [activeTransactionTab, setActiveTransactionTab] =
    React.useState('financial-entries')

  const {
    getSingleCustomer,
    getCustomerQuotePayments,
    quotePaymentsPagination,
  } = useSingleCustomer(id as string)
  const customer = getSingleCustomer.data

  // Financial data hooks
  const {
    getAllFinancialAccountingEntriesByEntityId,
    pagination: financialPagination,
  } = useFinancialAccountingEntriesByEntityId()
  const {
    getAllTransactionJournalEntriesByEntityId,
    pagination: transactionPagination,
  } = useTransactionJournalEntriesByEntityId()

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-4 gap-6">
        <div className="col-span-1 space-y-6">
          {/* Details Card */}
          <Card>
            <CardContent className="space-y-10 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#BAFAF2] p-2">
                    <Icon
                      icon="material-symbols:check"
                      className="text-4xl"
                      color="#00CEB6"
                    />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{0}</div>
                    <div className="text-muted-foreground text-sm">Quotes</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="rounded-full bg-[#BAFAF2] p-2">
                    <Icon icon="ph:cpu" className="text-4xl" color="#00CEB6" />
                  </div>
                  <div>
                    <div className="text-3xl font-bold">{0}</div>
                    <div className="text-muted-foreground text-sm">
                      Purchases
                    </div>
                  </div>
                </div>
              </div>
              <div className="mb-6 flex items-center justify-between border-b">
                <h2 className="text-lg font-semibold">Details</h2>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">Name:</p>
                  <p>{customer?.fullname}</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-muted-foreground text-sm">
                    Date Of Birth:
                  </p>
                  <p>{formatDate(customer?.dob as string)}</p>
                </div>
                {customer?.phone && (
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Phone:</p>
                    <p>{customer?.phone}</p>
                  </div>
                )}
                {customer?.email && (
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Email:</p>
                    <p>{customer?.email}</p>
                  </div>
                )}
                {customer?.address && (
                  <div className="flex items-center gap-2">
                    <p className="text-muted-foreground text-sm">Address:</p>
                    <p>{customer?.address}</p>
                  </div>
                )}
              </div>
              <div className="space-x-2">
                <Button>
                  <Pencil className="h-4 w-4" /> Edit
                </Button>
                <Button className="bg-red-500">
                  <Flag className="h-4 w-4" /> Flag User
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Policies */}
        <div className="col-span-3">
          <Card>
            <CardContent className="space-y-10 p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-max grid-cols-5">
                  {/* <TabsTrigger value="request-quotes">Find Customer policy</TabsTrigger> */}
                  <TabsTrigger value="claims">Claims</TabsTrigger>
                  <TabsTrigger value="purchased-policies">
                    Purchased Policies
                  </TabsTrigger>
                  <TabsTrigger value="transactions">Transactions</TabsTrigger>
                </TabsList>
                {/* <TabsContent value="request-quotes" className="space-y-4">
                  Show request quotes table here
                </TabsContent> */}
                <TabsContent value="claims" className="space-y-4">
                  <RenderDataTable
                    data={[]} // TODO: Add claims data
                    columns={[]} // TODO: Add claims columns
                    title="Claims"
                    showSearchField
                    searchPlaceHolder="Search claims..."
                    showPagination
                    isLoading={false}
                  />
                </TabsContent>
                <TabsContent value="purchased-policies" className="space-y-4">
                  <div className="space-y-5">
                    <RenderDataTable
                      data={getCustomerQuotePayments?.data?.message || []}
                      columns={QUOTE_PAYMENT_COLUMNS}
                      title="Purchased Policies"
                      showSearchField
                      searchPlaceHolder="Search policies..."
                      showPagination
                      isLoading={getCustomerQuotePayments.isLoading}
                      pagination={quotePaymentsPagination}
                      onPaginate={quotePaymentsPagination.setPage}
                    />
                  </div>
                </TabsContent>
                <TabsContent value="transactions" className="space-y-4">
                  <Tabs
                    value={activeTransactionTab}
                    onValueChange={setActiveTransactionTab}
                  >
                    <TabsList className="grid w-max grid-cols-2">
                      <TabsTrigger value="financial-entries">
                        Financial Entries
                      </TabsTrigger>
                      <TabsTrigger value="journals">Journals</TabsTrigger>
                    </TabsList>

                    <TabsContent
                      value="financial-entries"
                      className="space-y-4"
                    >
                      <RenderDataTable
                        data={
                          getAllFinancialAccountingEntriesByEntityId.data
                            ?.message || []
                        }
                        columns={FINANCIAL_ENTRIES_COLUMNS}
                        pagination={financialPagination}
                        onPaginate={financialPagination.setPage}
                        title="Financial Entries"
                        showSearchField
                        searchPlaceHolder="Search entries..."
                        showPagination
                        isLoading={
                          getAllFinancialAccountingEntriesByEntityId.isLoading
                        }
                      />
                    </TabsContent>

                    <TabsContent value="journals" className="space-y-4">
                      <RenderDataTable
                        data={
                          getAllTransactionJournalEntriesByEntityId.data
                            ?.message || []
                        }
                        columns={TRANSACTION_JOURNAL_COLUMNS}
                        pagination={transactionPagination}
                        onPaginate={transactionPagination.setPage}
                        title="Transaction Journals"
                        showSearchField
                        searchPlaceHolder="Search journals..."
                        showPagination
                        isLoading={
                          getAllTransactionJournalEntriesByEntityId.isLoading
                        }
                      />
                    </TabsContent>
                  </Tabs>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Page
