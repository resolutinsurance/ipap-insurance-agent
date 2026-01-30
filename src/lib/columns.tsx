import { Button } from "@/components/ui/button";
import {
  Agent,
  FinancialAccountingEntry,
  PaymentRecord,
  TransactionJournalEntry,
  User,
} from "@/lib/interfaces";
import { formatCurrency, formatDate } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { PaymentScheduleItem } from "./interfaces/response";

export const FINANCIAL_ENTRIES_COLUMNS: ColumnDef<FinancialAccountingEntry>[] = [
  {
    accessorKey: "transaction_number",
    header: "Transaction Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("transaction_number")}</div>
    ),
  },
  {
    accessorKey: "transaction_type",
    header: "Transaction Type",
    cell: ({ row }) => {
      const type = row.getValue("transaction_type") as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            type === "CREDIT" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          {type}
        </span>
      );
    },
  },
  {
    accessorKey: "quoteType",
    header: "Insurance Type",
    cell: ({ row }) => {
      const quoteType = row.original.quoteType;
      return <div className="font-medium">{quoteType ?? "N/A"}</div>;
    },
  },
  // {
  //   accessorKey: "policyId",
  //   header: "Policy ID",
  //   cell: ({ row }) => <div className="font-medium">{row.getValue("policyId")}</div>,
  // },
  {
    accessorKey: "transaction_amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-semibold">
        GHS {Number(row.getValue("transaction_amount")).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "transaction_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("transaction_status") as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "transaction_narration",
    header: "Narration",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[300px] truncate">
        {row.getValue("transaction_narration")}
      </div>
    ),
  },
  {
    accessorKey: "transaction_date",
    header: "Transaction Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("transaction_date"))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
];

export const TRANSACTION_JOURNAL_COLUMNS: ColumnDef<TransactionJournalEntry>[] = [
  {
    accessorKey: "transaction_number",
    header: "Transaction Number",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("transaction_number")}</div>
    ),
  },
  {
    accessorKey: "transaction_amount",
    header: "Amount",
    cell: ({ row }) => (
      <div className="font-semibold">
        GHS {Number(row.getValue("transaction_amount")).toLocaleString()}
      </div>
    ),
  },
  {
    accessorKey: "quoteType",
    header: "Insurance Type",
    cell: ({ row }) => {
      const quoteType = row.original.quoteType;
      return <div className="font-medium">{quoteType ?? "N/A"}</div>;
    },
  },
  {
    accessorKey: "transaction_status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("transaction_status") as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs ${
            status === "APPROVED"
              ? "bg-green-100 text-green-800"
              : status === "PENDING"
              ? "bg-yellow-100 text-yellow-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "error_msg",
    header: "Error Message",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground max-w-[200px] truncate">
        {row.getValue("error_msg") || "No Error"}
      </div>
    ),
  },
  {
    accessorKey: "timestamp",
    header: "Transaction Time",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("timestamp"))}
      </div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Created Date",
    cell: ({ row }) => (
      <div className="text-sm text-muted-foreground">
        {formatDate(row.getValue("createdAt"))}
      </div>
    ),
  },
];

export const AGENT_COLUMNS: ColumnDef<Agent>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "createdAt",
    header: "Joined At",
    cell: ({ row }) => formatDate(row.original.createdAt),
  },
  {
    accessorKey: "user.fullname",
    header: "Name",
  },
  {
    accessorKey: "user.email",
    header: "Email",
  },
  {
    accessorKey: "user.phone",
    header: "Phone",
  },
  {
    accessorKey: "yearsofExperience",
    header: "Experience",
    cell: ({ row }: { row: { original: Agent } }) =>
      `${row.original.yearsofExperience} years`,
  },
];

export const CUSTOMER_COLUMNS: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "fullname",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "dob",
    header: "Date of Birth",
    cell: ({ row }) => {
      const date = new Date(row.original.dob || "");
      return date.toLocaleDateString();
    },
  },
  {
    accessorKey: "verified",
    header: "Status",
    cell: ({ row }) => (
      <span
        className={`px-2 py-1 rounded-full text-xs ${
          row.original.verified
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800"
        }`}
      >
        {row.original.verified ? "Verified" : "Pending"}
      </span>
    ),
  },
];

export const QUOTE_PAYMENT_COLUMNS: ColumnDef<PaymentRecord>[] = [
  {
    accessorKey: "quoteType",
    header: "Insurance Type",
    cell: ({ row }) => {
      const purchase = row.original;
      return (
        <div className="space-y-1">
          <h3 className="font-medium">{purchase.quoteType} Insurance</h3>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Status: </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                purchase.status === "success"
                  ? "bg-green-100 text-green-800"
                  : purchase.status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {purchase.status.charAt(0).toUpperCase() + purchase.status.slice(1)}
            </span>
          </div>
          <p className="text-sm text-blue-500">
            Created: {formatDate(purchase.createdAt)}
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "paymentDetails",
    header: "Payment Details",
    cell: ({ row }) => {
      const purchase = row.original;
      return (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Payment Method:</span>
            <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
              {purchase.methodName}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Premium:</span>
            <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
              {purchase.premiumAmount}
            </span>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "agent",
    header: "Agent Details",
    cell: ({ row }) => {
      const purchase = row.original;
      return (
        <div className="flex flex-col gap-2">
          {purchase.user_agent ? (
            <div className="text-sm text-muted-foreground">
              <p>Agent: {purchase.user_agent.user.fullname}</p>
              <p>Company: {purchase.insuranceCompany.name}</p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">N/A</div>
          )}
        </div>
      );
    },
  },
];

// Reusable View Details Button Component
interface ViewDetailsButtonProps {
  onClick: (e: React.MouseEvent) => void;
}

export const ViewDetailsButton = ({ onClick }: ViewDetailsButtonProps) => (
  <Button
    variant="ghost"
    size="sm"
    onClick={(e) => {
      e.stopPropagation();
      onClick(e);
    }}
    className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
  >
    View Details
  </Button>
);

// Helper to create a View Details action column for any data type
export const createViewDetailsActionColumn = <T,>(
  onViewDetails: (row: T) => void
): ColumnDef<T> => ({
  id: "actions",
  header: "Actions",
  cell: ({ row }) => <ViewDetailsButton onClick={() => onViewDetails(row.original)} />,
});

export const PAYMENT_SCHEDULE_ITEM_COLUMNS: ColumnDef<PaymentScheduleItem>[] = [
  {
    accessorKey: "installmentNumber",
    header: "Installment #",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("installmentNumber")}</div>
    ),
  },
  {
    accessorKey: "paymentAmount",
    header: "Payment Amount",
    cell: ({ row }) => formatCurrency(row.getValue("paymentAmount")),
  },
  {
    accessorKey: "amountPaid",
    header: "Amount Paid",
    cell: ({ row }) => formatCurrency(row.getValue("amountPaid")),
  },
  {
    accessorKey: "dueDate",
    header: "Due Date",
    cell: ({ row }) => formatDate(row.getValue("dueDate"), false),
  },
  {
    accessorKey: "remainingBalance",
    header: "Remaining Balance",
    cell: ({ row }) => formatCurrency(row.getValue("remainingBalance")),
  },
];
