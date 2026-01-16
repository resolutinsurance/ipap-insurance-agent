import { flattenObject, prepareObjectFields } from "@/lib/data-renderer";
import { PaymentRecord } from "@/lib/interfaces";
import InfoRow from "./info-row";

const PolicyDetails = ({ record }: { record: PaymentRecord }) => {
  // Transaction details
  const transactionDetailsSource = {
    "Transaction Number": record.transaction_no,
    "Created At": record.createdAt,
    "Updated At": record.updatedAt,
  } as Record<string, unknown>;

  const transactionFields = prepareObjectFields(flattenObject(transactionDetailsSource));

  // Payment record details
  const paymentDetailsSource = {
    "Premium Amount": record.premiumAmount,
    "Quote Type": record.quoteType,
    Method: record.method,
    "Insurance Company": record.insuranceCompany?.name,
    "Method Name": record.methodName,
    "Method Code": record.methodCode,
    "Account Number": record.accountNumber,
    "Account Name": record.accountName,
    "Reference ID": record.refId,
    Status: record.status,
    "Transaction Number": record.transaction_no,
    "Policy Number": record.PolicyNumber,
    "User Agent (ID)": record.user_agent?.id,
    "User Agent (Name)": record.user_agent?.user?.fullname,
    "User (Name)": record.user?.fullname,
    "User (Email)": record.user?.email,
    "User (Phone)": record.user?.phone,
  } as Record<string, unknown>;

  const paymentFields = prepareObjectFields(flattenObject(paymentDetailsSource));

  // Policy entity details (generic object)
  const policyFields =
    record.entityObj && Object.keys(record.entityObj).length > 0
      ? prepareObjectFields(
          flattenObject(record.entityObj as unknown as Record<string, unknown>)
        )
      : [];

  return (
    <section className="space-y-6">
      <div className="space-y-6">
        <div className="space-y-5">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold mb-4">Transaction Details</h3>
          </div>
        </div>
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
          {transactionFields.map((field) => (
            <InfoRow key={field.key} label={field.label} value={field.value} />
          ))}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">Payment Record Details</h3>
          <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
            {paymentFields.map((field) => (
              <InfoRow key={field.key} label={field.label} value={field.value} />
            ))}
          </div>
        </div>

        <div>
          {policyFields.length > 0 && (
            <>
              <h3 className="text-lg font-semibold mb-4">Policy Details</h3>
              <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
                {policyFields.map((field) => (
                  <InfoRow key={field.key} label={field.label} value={field.value} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default PolicyDetails;
