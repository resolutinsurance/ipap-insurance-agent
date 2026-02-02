"use client";

import FinanceLogSheet from "@/components/modals/finance-log-sheet";
import { RenderDataTable } from "@/components/table";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WidthConstraint from "@/components/ui/width-constraint";
import {
  useFinancialAccountingEntriesByEntityId,
  useTransactionJournalEntriesByEntityId,
} from "@/hooks/use-finances";

import { FINANCIAL_ENTRIES_COLUMNS, TRANSACTION_JOURNAL_COLUMNS } from "@/lib/columns";
import { prepareObjectFieldsWithManualExclusionsOnly } from "@/lib/data-renderer";
import { useMemo, useState } from "react";

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
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [type, setType] = useState<"FINANCIAL_ENTRIES" | "TRANSACTION_JOURNALS">(
    "FINANCIAL_ENTRIES"
  );
  const [selectedRow, setSelectedRow] = useState<Record<string, unknown> | null>(null);

  const selectedRowFields = useMemo(() => {
    if (!selectedRow) return [];
    return prepareObjectFieldsWithManualExclusionsOnly(selectedRow, [
      "id",
      "updatedAt",
      "createdAt",
      "currency",
      "local_currency",
      "userAgentID",
      "entity_code",
      "account_number",
      "credit_account",
    ]);
  }, [selectedRow]);

  const handleRowClick = (row: unknown, context: keyof typeof TABS) => {
    if (!row || typeof row !== "object") return;
    setSelectedRow(row as Record<string, unknown>);
    setType(context);
    setIsDetailsOpen(true);
  };

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
                  onRowClicked={(row) => handleRowClick(row, TABS.FINANCIAL_ENTRIES)}
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
                  onRowClicked={(row) => handleRowClick(row, TABS.TRANSACTION_JOURNALS)}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <FinanceLogSheet
        isDetailsOpen={isDetailsOpen}
        setIsDetailsOpen={setIsDetailsOpen}
        selectedRow={selectedRow}
        setSelectedRow={setSelectedRow}
        type={type}
        selectedRowFields={selectedRowFields}
      />
    </WidthConstraint>
  );
}
