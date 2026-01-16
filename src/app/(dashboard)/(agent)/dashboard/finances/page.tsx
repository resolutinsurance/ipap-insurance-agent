"use client";

import { RenderDataTable } from "@/components/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidthConstraint from "@/components/ui/width-constraint";
import {
  useFinancialAccountingEntriesByEntityId,
  useTransactionJournalEntriesByEntityId,
} from "@/hooks/use-finances";

import { FINANCIAL_ENTRIES_COLUMNS, TRANSACTION_JOURNAL_COLUMNS } from "@/lib/columns";
import { useState } from "react";

const TABS = {
  FINANCIAL_ENTRIES: "FINANCIAL_ENTRIES",
  TRANSACTION_JOURNALS: "TRANSACTION_JOURNALS",
} as const;

export default function CompanyFinancesPage() {
  const { getAllFinancialAccountingEntriesByEntityId, pagination: financialPagination } =
    useFinancialAccountingEntriesByEntityId();
  const { getAllTransactionJournalEntriesByEntityId, pagination: transactionPagination } =
    useTransactionJournalEntriesByEntityId();

  const [activeTab, setActiveTab] = useState<keyof typeof TABS>(TABS.FINANCIAL_ENTRIES);

  return (
    <WidthConstraint className="px-0">
      <div className="">
        <Card>
          <CardContent className="">
            <Tabs
              value={activeTab}
              onValueChange={(value) => setActiveTab(value as keyof typeof TABS)}
            >
              <TabsList className="flex flex-wrap h-max w-full sm:w-max gap-2">
                <TabsTrigger
                  value={TABS.FINANCIAL_ENTRIES}
                  className="text-xs sm:text-sm"
                >
                  FINANCIAL ENTRIES
                </TabsTrigger>
                <TabsTrigger
                  value={TABS.TRANSACTION_JOURNALS}
                  className="text-xs sm:text-sm"
                >
                  TRANSACTION JOURNALS
                </TabsTrigger>
              </TabsList>

              <TabsContent value={TABS.FINANCIAL_ENTRIES} className="space-y-4">
                <RenderDataTable
                  data={getAllFinancialAccountingEntriesByEntityId.data?.message || []}
                  columns={FINANCIAL_ENTRIES_COLUMNS}
                  pagination={financialPagination}
                  onPaginate={financialPagination.setPage}
                  title="Financial Entries"
                  showSearchField
                  searchPlaceHolder="Search entries..."
                  showPagination
                  isLoading={getAllFinancialAccountingEntriesByEntityId.isLoading}
                />
              </TabsContent>

              <TabsContent value={TABS.TRANSACTION_JOURNALS} className="space-y-4">
                <RenderDataTable
                  data={getAllTransactionJournalEntriesByEntityId.data?.message || []}
                  columns={TRANSACTION_JOURNAL_COLUMNS}
                  pagination={transactionPagination}
                  onPaginate={transactionPagination.setPage}
                  title="Transaction Journals"
                  showSearchField
                  searchPlaceHolder="Search journals..."
                  showPagination
                  isLoading={getAllTransactionJournalEntriesByEntityId.isLoading}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </WidthConstraint>
  );
}
