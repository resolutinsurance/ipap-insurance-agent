"use client";

interface PremiumShieldTermsProps {
  /**
   * Number of installments for repayment schedule
   */
  noofInstallments?: number | string;
  /**
   * Regular installment amount (formatted currency string)
   */
  regularInstallment?: string;
  /**
   * Payment frequency (e.g., "monthly", "quarterly")
   */
  paymentFrequency?: string;
  /**
   * Interest rate as a percentage (number or string)
   */
  interestRate?: string | number;
  /**
   * Initial deposit amount (formatted currency string)
   */
  initialDeposit?: string;
  /**
   * Format currency helper function (optional, defaults to simple formatting)
   */
  formatCurrency?: (value: string | number | undefined | null) => string;
  /**
   * Variant: "full" for all 8 terms, "short" for abbreviated version
   */
  variant?: "full" | "short";
}

export function PremiumShieldTerms({
  noofInstallments,
  regularInstallment,
  paymentFrequency,
  interestRate,
  initialDeposit,
  variant = "full",
}: PremiumShieldTermsProps) {
  // Format interest rate for display
  const formattedInterestRate =
    interestRate !== undefined && interestRate !== null
      ? typeof interestRate === "string"
        ? parseFloat(interestRate).toFixed(2)
        : interestRate.toFixed(2)
      : null;

  if (variant === "short") {
    return (
      <div className="prose max-w-none">
        <div className="whitespace-pre-line text-sm leading-relaxed space-y-4">
          <p>
            <strong>1. LOAN PURPOSE</strong>
            <br />
            This loan agreement is entered into for the purpose of financing the insurance
            premium payment as specified above. The borrower agrees to use the loan amount
            solely for the payment of the insurance premium.
          </p>
          <p>
            <strong>2. ADVANCE MONTHLY PREMIUM PAYMENT CLAUSE</strong>
            <br />
            The Borrower agrees that for each month during the term of this loan, the
            insurance premium(s) corresponding to that month’s coverage shall be paid in
            advance, before or on the first day of the relevant month. The Borrower shall
            provide proof of payment of each month’s premium to the Lender upon request.
            Failure to make such advance payment shall constitute an Event of Default
            under this Agreement.
          </p>
          <p>
            <strong>3. REPAYMENT TERMS</strong>
            <br />
            The borrower agrees to repay the loan amount according to the payment terms
            specified above. Payment shall be made through the designated payment method
            and account as indicated in this agreement.
          </p>
          <p>
            <strong>4. INTEREST AND FEES</strong>
            <br />
            Any applicable interest rates and fees shall be as agreed upon between the
            parties. The borrower acknowledges and agrees to pay all applicable charges
            associated with this loan.
          </p>
          <p>
            <strong>5. DEFAULT</strong>
            <br />
            In the event of default in payment, the lender reserves the right to take
            appropriate legal action to recover the outstanding amount, including but not
            limited to collection fees and legal costs.
          </p>
          <p>
            <strong>6. LOSS PAYEE</strong>
            <br />
            Globafin Limited is designated as Loss Payee on policies financed or supported
            by Globafin. In the event of policyholder default, the policyholder
            irrevocably authorizes Globafin to instruct the underwriting insurer to cancel
            the policy, subject to applicable law, insurer terms, and statutory notice
            requirements.
          </p>
          <p>
            <strong>7. INSURANCE COVERAGE</strong>
            <br />
            The insurance coverage shall commence upon successful payment of the premium
            amount. The borrower acknowledges that the insurance policy is subject to the
            terms and conditions of the insurance company.
          </p>
          <p>
            <strong>8. GOVERNING LAW / JURISDICTION:</strong>
            <br />
            Republic of Ghana.
          </p>
          <p>
            <strong>9. AGREEMENT</strong>
            <br />
            By signing this agreement, both parties acknowledge that they have read,
            understood, and agree to be bound by all terms and conditions stated herein.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="prose max-w-none">
      <div className="whitespace-pre-line text-sm leading-relaxed space-y-4">
        <p>
          <strong>1. LOAN PURPOSE</strong>
          <br />
          This loan agreement is entered into for the purpose of financing the insurance
          premium payment. The borrower agrees to use the loan amount solely for the
          payment of the insurance premium as specified in this agreement.
        </p>
        <p>
          <strong>2. ADVANCE MONTHLY PREMIUM PAYMENT CLAUSE</strong>
          <br />
          The Borrower agrees that for each month during the term of this loan, the
          insurance premium(s) corresponding to that month’s coverage shall be paid in
          advance, before or on the first day of the relevant month. The Borrower shall
          provide proof of payment of each month’s premium to the Lender upon request.
          Failure to make such advance payment shall constitute an Event of Default under
          this Agreement.
        </p>
        <p>
          <strong>3. REPAYMENT SCHEDULE</strong>
          <br />
          The borrower agrees to repay the loan in{" "}
          {noofInstallments
            ? `${noofInstallments} installments`
            : "installments as agreed upon"}{" "}
          {regularInstallment ? `of ${regularInstallment}` : ""}{" "}
          {regularInstallment ? "each, " : ""}
          payable {paymentFrequency || "as agreed"}. The first installment is due on the
          date specified in the payment schedule.
        </p>
        <p>
          <strong>4. INTEREST RATE</strong>
          <br />
          The loan shall bear interest at the rate of{" "}
          {formattedInterestRate
            ? `${formattedInterestRate}%`
            : "as specified in the loan agreement"}{" "}
          per annum, calculated on the outstanding principal balance. Interest shall
          accrue from the date of disbursement until the loan is fully repaid.
        </p>
        <p>
          <strong>5. INITIAL DEPOSIT</strong>
          <br />
          The borrower has made an initial deposit of{" "}
          {initialDeposit ? initialDeposit : "as specified"}. This deposit shall be
          applied towards the premium amount and loan balance as specified.
        </p>
        <p>
          <strong>6. LOSS PAYEE</strong>
          <br />
          Globafin Limited is designated as Loss Payee on policies financed or supported
          by Globafin. In the event of policyholder default, the policyholder irrevocably
          authorizes Globafin to instruct the underwriting insurer to cancel the policy,
          subject to applicable law, insurer terms, and statutory notice requirements.
        </p>
        <p>
          <strong>7. DEFAULT AND REMEDIES</strong>
          <br />
          In the event of default in payment of any installment, the lender reserves the
          right to charge late fees and take appropriate legal action to recover the
          outstanding amount, including but not limited to collection fees and legal
          costs. The borrower shall be liable for all costs incurred in the collection of
          the outstanding balance.
        </p>
        <p>
          <strong>8. INSURANCE COVERAGE</strong>
          <br />
          The insurance coverage shall commence upon successful payment of the initial
          deposit and first installment. The borrower acknowledges that the insurance
          policy is subject to the terms and conditions of the insurance company and that
          failure to maintain payments may result in policy cancellation.
        </p>
        <p>
          <strong>9. PREPAYMENT</strong>
          <br />
          The borrower may prepay the entire loan balance or any portion thereof at any
          time without penalty. Any prepayment shall be applied first to accrued interest
          and then to the principal balance.
        </p>
        <p>
          <strong>10. AGREEMENT</strong>
          <br />
          By signing this agreement, both parties acknowledge that they have read,
          understood, and agree to be bound by all terms and conditions stated herein.
          This agreement constitutes the entire understanding between the parties and
          supersedes all prior agreements or understandings, whether written or oral.
        </p>
        <p>
          <strong>11. GOVERNING LAW / JURISDICTION:</strong>
          <br />
          Republic of Ghana.
        </p>
      </div>
    </div>
  );
}
