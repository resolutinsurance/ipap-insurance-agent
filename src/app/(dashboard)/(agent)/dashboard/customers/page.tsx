"use client";

import CustomerModal from "@/components/modals/customer-modal";
import { RenderDataTable } from "@/components/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAgent, useAgentCustomers } from "@/hooks/use-agent";
import { USER_TYPES } from "@/lib/constants";
import { User } from "@/lib/interfaces";
import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { toast } from "sonner";

export default function CustomersPage() {
  const { agent, deleteCustomer } = useAgent();
  const { agentCustomersQuery, pagination } = useAgentCustomers(agent?.id || null);
  const router = useRouter();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);
  const [customerToDelete, setCustomerToDelete] = useState<string | null>(null);

  const handleDeleteCustomer = (customerId: string) => {
    setCustomerToDelete(customerId);
  };

  const confirmDeleteCustomer = () => {
    if (customerToDelete) {
      deleteCustomer.mutate(customerToDelete, {
        onSuccess: () => {
          setCustomerToDelete(null);
          agentCustomersQuery.refetch();
          toast.success("Customer deleted successfully");
        },
        onError: () => {
          toast.error("Error deleting customer");
        },
      });
    }
  };

  const openModal = (mode: "add" | "edit", customer?: User) => {
    setModalMode(mode);
    setSelectedCustomer(customer || null);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleRowClick = (customer: User) => {
    if (!customer.id) return;
    router.push(`/dashboard/customers/${customer.id}`);
  };

  // Define columns with actions
  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: "fullname",
        header: "Name",
        cell: ({ row }) => <span className="font-medium">{row.original.fullname}</span>,
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
        accessorKey: "address",
        header: "Address",
        cell: ({ row }) => row.original.address || "N/A",
      },
      {
        id: "actions",
        header: () => <div className="text-right">Actions</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => openModal("edit", row.original)}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={() => handleDeleteCustomer(row.original.id!)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const customerData = agentCustomersQuery.data?.message || [];

  return (
    <div className="container mx-auto py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Add Customer Button */}
      <div className="flex justify-end">
        <Button onClick={() => openModal("add")}>
          <Plus className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>

      <Card>
        <CardContent>
          <RenderDataTable<User>
            title="Customers"
            data={customerData}
            columns={columns}
            isLoading={agentCustomersQuery.isLoading}
            onRowClicked={handleRowClick}
            showSearchField
            searchPlaceHolder="Search customers..."
            showExportAction={false}
            pagination={pagination}
            onPaginate={pagination.setPage}
            showPagination
          />
        </CardContent>
      </Card>

      {/* Customer Modal */}
      <CustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        mode={modalMode}
        userType={USER_TYPES.AGENT}
        selectedCustomer={selectedCustomer}
        onSuccess={() => {
          agentCustomersQuery.refetch();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!customerToDelete}
        onOpenChange={(open) => !open && setCustomerToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the customer and
              all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteCustomer}
              className="bg-red-500 hover:bg-red-600"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
