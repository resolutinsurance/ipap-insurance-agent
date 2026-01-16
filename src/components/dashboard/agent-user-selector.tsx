import { Combobox } from "@/components/ui/combo-box";
import { useAgent, useAgentCustomers } from "@/hooks/use-agent";
import { User } from "@/lib/interfaces";
import { useState } from "react";

interface AgentUserSelectorProps {
  onUserSelect?: (customer: User) => void;
  initialUserId?: string;
}

const AgentUserSelector = ({ onUserSelect, initialUserId }: AgentUserSelectorProps) => {
  const { agent } = useAgent();
  const { agentCustomersQuery } = useAgentCustomers(agent?.id || null);
  const customers = agentCustomersQuery.data?.message || [];
  const [selectedUserId, setSelectedUserId] = useState(initialUserId || "");

  // Transform customers data to the format expected by Combobox
  const userOptions =
    customers?.map((customer) => ({
      value: customer.id || "",
      label: `${customer.fullname} | ${customer.email} | ${customer.phone}`,
      searchText: `${customer.fullname} ${customer.email} ${customer.phone}`,
    })) || [];

  const handleUserChange = (userId: string) => {
    setSelectedUserId(userId);
    if (onUserSelect) {
      const selectedCustomer = customers?.find((customer) => customer.id === userId);
      if (selectedCustomer) {
        onUserSelect(selectedCustomer);
      }
    }
  };

  return (
    <div className="w-full">
      <Combobox
        options={userOptions}
        value={selectedUserId}
        onChange={handleUserChange}
        placeholder="Select a customer..."
        searchPlaceholder="Search by name, email, or phone..."
      />
    </div>
  );
};

export default AgentUserSelector;
