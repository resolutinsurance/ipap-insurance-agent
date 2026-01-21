"use client";

import { RenderDataTable } from "@/components/table";
import { PAYMENT_SCHEDULE_ITEM_COLUMNS } from "@/lib/columns";
import { API_BASE_URL, COOKIE_KEYS } from "@/lib/constants";
import type { PremiumFinancingScheduleRequest } from "@/lib/interfaces";
import type { PaymentScheduleItem } from "@/lib/interfaces/response";
import { formatCurrencyToGHS } from "@/lib/utils";
import Cookies from "js-cookie";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

interface ScheduleData {
  initialDeposit: string | number;
  loanAmount: string | number;
  totalRepayment: string | number;
  paymentFrequency: string;
  regularInstallment: string | number;
  schedule: PaymentScheduleItem[];
}

const RepaymentSchedulePreviewPage = () => {
  const searchParams = useSearchParams();
  const [paymentData, setPaymentData] = useState<PremiumFinancingScheduleRequest | null>(
    null
  );
  const [scheduleData, setScheduleData] = useState<ScheduleData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchRepaymentSchedule = async () => {
      const encodedData = searchParams.get("data");

      if (!encodedData) {
        setError(
          new Error("Missing required parameters to render repayment schedule preview")
        );
        setIsLoading(false);
        return;
      }

      try {
        // Decode base64 data (browser-compatible)
        const decodedString = atob(encodedData);
        const decodedData = JSON.parse(decodedString) as PremiumFinancingScheduleRequest;

        setPaymentData(decodedData);
        setError(null);

        // Fetch schedule data
        setIsLoading(true);

        // Try getting token from query params first (for PDF generation), then from cookies
        const accessToken =
          searchParams.get("authorization") || Cookies.get(COOKIE_KEYS.accessToken);

        const response = await fetch(`${API_BASE_URL}/PremiumFinancing/direct-schedule`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          body: JSON.stringify(decodedData),
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch repayment schedule: ${response.statusText}`);
        }

        const data = await response.json();
        // The response may be wrapped in a message property
        const schedule = data.message || data;
        setScheduleData(schedule);
      } catch (err) {
        setError(
          err instanceof Error ? err : new Error("Failed to load repayment schedule")
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchRepaymentSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  const scheduleItems = scheduleData?.schedule || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading repayment schedule...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="p-6">
          <div className="border border-red-200 bg-red-50 rounded-lg p-4">
            <p className="text-sm text-red-600">
              {error instanceof Error
                ? error.message
                : "Failed to load repayment schedule"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!paymentData) {
    return (
      <div className="p-6">
        <h1 className="text-xl font-semibold">Repayment Schedule</h1>
        <p className="text-sm text-muted-foreground mt-2">
          Missing required parameters to render repayment schedule preview.
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Repayment Schedule</h1>
          <p className="text-sm text-muted-foreground">
            Printable preview of your repayment schedule
          </p>
        </div>
      </div>

      {scheduleData && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted/50 rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Initial Deposit</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.initialDeposit)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Loan Amount</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.loanAmount)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Repayment</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.totalRepayment)}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Payment Frequency</p>
              <p className="text-lg font-semibold">{scheduleData.paymentFrequency}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Regular Installment</p>
              <p className="text-lg font-semibold">
                {formatCurrencyToGHS(scheduleData.regularInstallment)}
              </p>
            </div>
          </div>

          <div className="border rounded-lg">
            <RenderDataTable
              data={scheduleItems}
              columns={PAYMENT_SCHEDULE_ITEM_COLUMNS}
              title="Payment Schedule"
              isLoading={isLoading}
              showPagination={false}
              hideTitle={true}
              showColumnsFilter={false}
              showExportAction={false}
            />
          </div>
        </div>
      )}

      {!scheduleData && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No repayment schedule available</p>
        </div>
      )}
    </div>
  );
};

export default RepaymentSchedulePreviewPage;
