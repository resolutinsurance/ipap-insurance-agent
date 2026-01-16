"use client";

import { HomeCard } from "@/components/dashboard/home-card";
import Support from "@/components/support";
import { RenderDataTable } from "@/components/table";
import { Card, CardContent } from "@/components/ui/card";
import { useQuotePayments } from "@/hooks/use-quote-payments";
import { createViewDetailsActionColumn, QUOTE_PAYMENT_COLUMNS } from "@/lib/columns";
import { ROUTES } from "@/lib/constants";
import { PaymentRecord } from "@/lib/interfaces";
import { transformQuoteTypeToProductType } from "@/lib/utils";
import { useRouter } from "next/navigation";

const AgentHomeView = () => {
  const { allQuotePaymentsQuery, pagination } = useQuotePayments(10);
  const router = useRouter();

  const handleViewDetails = (payment: PaymentRecord) => {
    const productType = transformQuoteTypeToProductType(payment.quoteType);
    router.push(`/dashboard/policies/purchases/${productType}/${payment.id}`);
  };

  const columns = [
    ...QUOTE_PAYMENT_COLUMNS,
    createViewDetailsActionColumn<PaymentRecord>(handleViewDetails),
  ];

  const AGENT_QUICK_ACTIONS = [
    {
      title: "Find a Customer Policy",
      description:
        "Search and view details of policies purchased by customers under your agency",
      ctaText: "Find Policy",
      bgColor: "bg-blue-50",
      imageSrc: "/assets/illustrations/customer-care.svg",
      imageAlt: "Search illustration",
      ctaLink: ROUTES.AGENT.FIND_POLICY,
    },
    {
      title: "Manage Your Customers",
      description: "View and manage the list of customers associated with your account",
      ctaText: "View Customers",
      bgColor: "bg-purple-50",
      imageSrc: "/assets/illustrations/man-move.svg",
      imageAlt: "Customers illustration",
      ctaLink: ROUTES.AGENT.CUSTOMERS,
    },
  ];

  return (
    <section className="space-y-6 sm:space-y-10 flex flex-col h-full">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {AGENT_QUICK_ACTIONS.map((card, index) => (
          <HomeCard key={index} {...card} />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 justify-between items-start">
        <Card className="flex-1 w-full">
          <CardContent>
            <RenderDataTable
              data={allQuotePaymentsQuery.data?.message || []}
              columns={columns}
              title="Recent Transactions"
              isLoading={allQuotePaymentsQuery.isLoading}
              pagination={pagination}
              onPaginate={pagination.setPage}
              onSearch={pagination.setName}
              onResetSearch={() => pagination.setName("")}
              onRowClicked={handleViewDetails}
            />
          </CardContent>
        </Card>
        <div className="w-full lg:w-auto lg:min-w-[300px]">
          <Support />
        </div>
      </div>
    </section>
  );
};

export default AgentHomeView;
