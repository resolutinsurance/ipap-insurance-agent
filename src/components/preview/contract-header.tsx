import { formatDate } from "@/lib/utils";

const ContractHeader = ({
  productName,
  productCode,
}: {
  productName: string;
  productCode: string;
}) => {
  return (
    <div className="border-b-2 border-gray-800 pb-6 mb-8 space-y-4">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold uppercase tracking-wide">
            {productName} Loan Product Form
          </h1>
        </div>
        <div className="text-right">
          <p className="text-base font-semibold">
            {formatDate(new Date().toISOString())}
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div className="flex gap-2">
          <span className="font-semibold">Product Name:</span>
          <span>{productName}</span>
        </div>
        <div className="flex gap-2">
          <span className="font-semibold">Product Code / ID:</span>
          <span>{productCode}</span>
        </div>
      </div>
    </div>
  );
};

export default ContractHeader;
