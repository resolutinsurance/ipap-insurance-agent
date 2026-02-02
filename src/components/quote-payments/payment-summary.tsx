import { formatCurrencyToGHS } from "@/lib/utils";
import { calculateCharges } from "@/lib/utils/payments";

const PaymentSummary = ({
  paymentData,
  actualProcessingFee,
  initialDeposit,
}: {
  paymentData: {
    method: string;
    methodName: string;
    methodCode: string;
    accountName: string;
    accountNumber: string;
  };
  actualProcessingFee: number;
  initialDeposit: number;
}) => {
  return (
    <div className="p-4 bg-gray-50 rounded-lg space-y-2">
      <h4 className="font-semibold text-sm">Payment Summary</h4>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        <div className="text-sm">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium ml-2">{paymentData.methodName}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Account Number:</span>
          <span className="font-medium ml-2">{paymentData.accountNumber}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Account Name:</span>
          <span className="font-medium ml-2">{paymentData.accountName}</span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Processing Fee:</span>
          <span className="font-medium ml-2">
            {formatCurrencyToGHS(actualProcessingFee)}
          </span>
        </div>
        <div className="text-sm">
          <span className="text-gray-600">Total Amount to Pay:</span>
          <span className="font-medium ml-2">
            {formatCurrencyToGHS(calculateCharges(actualProcessingFee, initialDeposit))}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;
