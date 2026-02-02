"use client";

import ContractHeader from "@/components/preview/contract-header";
import { Card, CardContent } from "@/components/ui/card";
import { PremiumShieldTerms } from "@/components/ui/premium-shield-terms";
import { useAuth } from "@/hooks/use-auth";
import { API_BASE_URL, COOKIE_KEYS, UPLOADS_BASE_URL } from "@/lib/constants";
import { PaymentRecord } from "@/lib/interfaces";
import { formatDate } from "@/lib/utils";
import Cookies from "js-cookie";
import { CheckSquare, Loader2 } from "lucide-react";
import Image from "next/image";
import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const QuotePaymentContractPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const paymentId = id?.toString() || "";

  const [paymentRecord, setPaymentRecord] = useState<PaymentRecord | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchPaymentRecord = async () => {
      if (!paymentId) {
        setError(new Error("Missing payment ID"));
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // Try getting token from query params first (for PDF generation), then from cookies
        const accessToken =
          searchParams.get("authorization") || Cookies.get(COOKIE_KEYS.accessToken);

        const response = await fetch(
          `${API_BASE_URL}/QuotePayment/singleQuote/${paymentId}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch payment record: ${response.statusText}`);
        }

        const data = await response.json();
        setPaymentRecord(data.message || null);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Failed to load payment record"));
      } finally {
        setIsLoading(false);
      }
    };

    fetchPaymentRecord();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentId]);

  // Get customer name
  const customerName = paymentRecord?.user?.fullname || user?.fullname || "N/A";

  // Get insurance company name
  const insuranceCompanyName = paymentRecord?.insuranceCompany?.name || "N/A";

  // Get agent name
  const agentName = paymentRecord?.user_agent?.user?.fullname || "N/A";

  // Get signature URL if available
  const signatureUrl =
    paymentRecord?.signature && typeof paymentRecord.signature === "string"
      ? `${UPLOADS_BASE_URL}${paymentRecord.signature}`
      : null;

  // Helper to format currency
  const formatCurrency = (value: string | number | undefined | null): string => {
    if (!value) return "N/A";
    const num = typeof value === "string" ? parseFloat(value) : value;
    if (isNaN(num)) return "N/A";
    return `GHS ${num.toLocaleString()}`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Loading payment record...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-pdf-ready="true"
      >
        <Card className="max-w-md">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">
                Error loading payment record. Please try again.
              </p>
              <p className="text-sm text-muted-foreground">
                {error instanceof Error ? error.message : "Unknown error"}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!paymentRecord) {
    return (
      <div
        className="flex items-center justify-center min-h-[400px]"
        data-pdf-ready="true"
      >
        <div className="text-center">
          <p className="text-muted-foreground">
            No payment record found. Please check the payment ID.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6 lg:px-8" data-pdf-ready="true">
      {/* Header Section - PREMIUMSHIELD LOAN PRODUCT FORM */}
      <ContractHeader
        productName="PremiumShield"
        productCode={paymentRecord.refId || paymentRecord.id}
      />

      <div className="space-y-8">
        {/* Section 1: Product Details */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            1. Product Details
          </h3>

          {/* Product Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold">Loan Type:</span>
              <span className="flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-primary" />
                {paymentRecord.quoteType}
              </span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Target Borrower Profile:</span>
              <span>{customerName}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Currency:</span>
              <span>GHS (Ghana Cedis)</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Minimum Loan Amount:</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Maximum Loan Amount:</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Tenor (term):</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Interest Rate:</span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Repayment Frequency:</span>
              <span>One-time payment</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Premium Amount:</span>
              <span>{formatCurrency(paymentRecord.premiumAmount)}</span>
            </div>
          </div>

          {/* Purpose of Loan */}
          <div className="mt-4 text-sm">
            <p>
              <span className="font-semibold">Purpose of Loan:</span> To pay insurance
              premium(s) ({paymentRecord.quoteType || "motor / property"}, per selected
              Loan Type)
            </p>
          </div>

          {/* Fees and Early Settlement */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold">
                Fees (processing / facilitation / admin):
              </span>
              <span>N/A</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Early Settlement / Prepayment Terms:</span>
              <span>N/A</span>
            </div>
          </div>
        </div>

        {/* Section 3: Documentation Required */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            3. Documentation Required
          </h3>
          <div className="text-sm space-y-2">
            <p>
              <span className="font-semibold">Declaration Document:</span>{" "}
              {paymentRecord.declarationDoc ? "Provided" : "N/A"}
            </p>
            <p>
              <span className="font-semibold">Signature:</span>{" "}
              {paymentRecord.signature ? "Provided" : "N/A"}
            </p>
          </div>
        </div>

        {/* Section 4: Borrower Information */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            4. Borrower Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-semibold text-muted-foreground">
                Borrower (Customer)
              </p>
              <p className="text-base font-semibold">{customerName}</p>
              <p className="text-sm text-muted-foreground">
                {paymentRecord.user?.email || "N/A"}
              </p>
              <p className="text-sm text-muted-foreground">
                {paymentRecord.user?.phone || "N/A"}
              </p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Lender</p>
              <p className="text-base font-semibold">{insuranceCompanyName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground">Agent</p>
              <p className="text-base font-semibold">{agentName}</p>
            </div>
          </div>
        </div>

        {/* Section 5: Policy Details */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            5. Policy Details
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold">Quote Type:</span>
              <span>{paymentRecord.quoteType || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Policy Number:</span>
              <span>{paymentRecord.PolicyNumber || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Entity ID:</span>
              <span>{paymentRecord.entityid || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Transaction Number:</span>
              <span>{paymentRecord.transaction_no || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Payment Status:</span>
              <span className="capitalize">{paymentRecord.status || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Payment Date:</span>
              <span>{formatDate(paymentRecord.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Section 6: Payment Method */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            6. Payment Method
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex gap-2">
              <span className="font-semibold">Premium Amount:</span>
              <span>{formatCurrency(paymentRecord.premiumAmount)}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Payment Method:</span>
              <span>{paymentRecord.methodName || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Account Number:</span>
              <span>{paymentRecord.accountNumber || "N/A"}</span>
            </div>
            <div className="flex gap-2">
              <span className="font-semibold">Account Name:</span>
              <span>{paymentRecord.accountName || "N/A"}</span>
            </div>
          </div>
        </div>

        {/* Section 7: Terms and Conditions */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            7. Terms and Conditions
          </h3>
          <PremiumShieldTerms variant="short" />
        </div>

        {/* Section 8: Signatures */}
        <div>
          <h3 className="text-lg font-bold mb-6 border-b-2 border-gray-800 pb-2">
            8. Signatures
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">
                Borrower Signature
              </p>
              {signatureUrl ? (
                <Image
                  width={300}
                  height={150}
                  src={signatureUrl}
                  alt="Borrower Signature"
                  className="w-full h-full max-w-[300px] max-h-[150px] object-contain"
                />
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50 h-32 flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">No signature available</p>
                </div>
              )}
              <p className="text-sm font-semibold mt-2">{customerName}</p>
              <p className="text-xs text-muted-foreground">Borrower</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted-foreground mb-2">Date</p>
              <p className="text-sm">{formatDate(new Date().toISOString())}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotePaymentContractPage;
