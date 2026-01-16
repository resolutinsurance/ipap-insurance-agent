import { useAuth } from "@/hooks/use-auth";
import { ActiveBundleProduct, ActiveProduct } from "@/lib/interfaces";
import { transformQuoteTypeToProductType } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

interface ProductCardProps {
  product: ActiveProduct;
}

export const ActiveProductCard = ({ product }: ProductCardProps) => {
  const { userType } = useAuth();
  const router = useRouter();

  const { productInfo, totalPayments, totalPaid } = product;

  // Underlying entity object (can vary by product type)
  const entity = productInfo.entityObj as Record<string, unknown> | null;

  // Normalise status coming from different product types (e.g. "NOT PURCHASED", "PART PAYMENT")
  const rawStatus =
    product.paymentStatus ||
    (entity && typeof entity["paymentStatus"] === "string"
      ? (entity["paymentStatus"] as string)
      : null) ||
    (totalPayments > 0 ? "PURCHASE COMPLETED" : "NOT PURCHASED");

  const normalisedStatus = (() => {
    const value = rawStatus?.toLowerCase() || "";
    if (value.includes("part")) return "partial" as const;
    if (value.includes("pending") || value.includes("not purchased"))
      return "pending" as const;
    if (
      value.includes("success") ||
      value.includes("complete") ||
      value.includes("purchase")
    )
      return "success" as const;
    return "failed" as const;
  })();

  const displayStatus = rawStatus || "Pending";
  const status = normalisedStatus;

  // Use shared util to derive productType segment for routing
  const productType = transformQuoteTypeToProductType(productInfo.quoteType);

  const handleViewDetails = () => {
    // Use entityid for navigation instead of payment id
    const entityId = product.entityid;
    if (userType === "insuranceCompany") {
      router.push(`/company/policies/${productType}/${entityId}`);
    } else {
      router.push(`/dashboard/policies/purchases/${productType}/${entityId}`);
    }
  };

  return (
    <div
      className="py-4 border-b last:border-b-0 cursor-pointer hover:bg-slate-50"
      onClick={handleViewDetails}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h3 className="font-medium">{productInfo.quoteType}</h3>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Status: </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "partial"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {displayStatus}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalPayments} payments • Total paid: {totalPaid}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Payments:</span>
            <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
              {totalPayments}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Paid:</span>
            <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
              {totalPaid}
            </span>
          </div>
        </div>
        <div className="flex flex-col justify-end items-end gap-2">
          <div className="text-sm text-muted-foreground text-right">
            <p>Company: {productInfo.insuranceCompany.name}</p>
            {productInfo.agent && typeof productInfo.agent === "object" && (
              <p>
                Agent:{" "}
                {typeof (productInfo.agent as Record<string, unknown>)["name"] ===
                "string"
                  ? ((productInfo.agent as Record<string, unknown>)["name"] as string)
                  : "N/A"}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

interface BundleProductCardProps {
  bundle: ActiveBundleProduct;
}

export const ActiveBundleProductCard = ({ bundle }: BundleProductCardProps) => {
  const { userType } = useAuth();
  const router = useRouter();

  const { productInfo, totalPayments, totalPaid } = bundle;
  const bundleData = productInfo.entityObj;

  // Normalise status coming from different product types (e.g. "NOT PURCHASED", "PART PAYMENT")
  const rawStatus =
    bundle.paymentStatus || (totalPayments > 0 ? "PURCHASE COMPLETED" : "NOT PURCHASED");

  const normalisedStatus = (() => {
    const value = rawStatus?.toLowerCase() || "";
    if (value.includes("part")) return "partial" as const;
    if (value.includes("pending") || value.includes("not purchased"))
      return "pending" as const;
    if (
      value.includes("success") ||
      value.includes("complete") ||
      value.includes("purchase")
    )
      return "success" as const;
    return "failed" as const;
  })();

  const displayStatus = rawStatus || "Pending";
  const status = normalisedStatus;

  const bundleName = bundleData?.bundleName?.name || "Bundle";

  const handleViewDetails = () => {
    // Use bundleId for navigation
    const bundleId = bundle.bundleId;
    if (userType === "insuranceCompany") {
      router.push(`/company/policies/bundle/${bundleId}`);
    } else {
      router.push(`/dashboard/policies/purchases/bundle/bundles/${bundleId}`);
    }
  };

  return (
    <div
      className="py-4 border-b last:border-b-0 cursor-pointer hover:bg-slate-50"
      onClick={handleViewDetails}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-1">
          <h3 className="font-medium">{bundleName}</h3>
          <div className="flex items-center">
            <span className="text-sm text-muted-foreground">Status: </span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                status === "success"
                  ? "bg-green-100 text-green-800"
                  : status === "pending"
                  ? "bg-yellow-100 text-yellow-800"
                  : status === "partial"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {displayStatus}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            {totalPayments} payments • Total paid: {totalPaid}
          </p>
          {bundleData?.bundleProducts && (
            <p className="text-xs text-muted-foreground">
              {bundleData.bundleProducts.length} product
              {bundleData.bundleProducts.length !== 1 ? "s" : ""} in bundle
            </p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Payments:</span>
            <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
              {totalPayments}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Total Paid:</span>
            <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
              {totalPaid}
            </span>
          </div>
          {bundleData?.bundleName?.totalBundleCost && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Bundle Cost:</span>
              <span className="text-sm bg-slate-100 px-4 py-2 rounded-full">
                {bundleData.bundleName.totalBundleCost}
              </span>
            </div>
          )}
        </div>
        <div className="flex flex-col justify-end items-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleViewDetails();
            }}
            className="text-blue-500 hover:text-blue-600 hover:bg-blue-50"
          >
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};
