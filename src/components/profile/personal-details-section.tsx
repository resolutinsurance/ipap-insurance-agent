"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ConfirmModal } from "@/components/ui/confirm-modal";
import { Input } from "@/components/ui/input";
import { User } from "@/lib/interfaces";
import { formatDateForInput } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type PersonalDetailsFormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
};

interface PersonalDetailsSectionProps {
  user: User | null;
  isLoading?: boolean;
  onUpdateProfile: (userId: string, data: Partial<User>) => Promise<void>;
}

export const PersonalDetailsSection = ({
  user,
  isLoading,
  onUpdateProfile,
}: PersonalDetailsSectionProps) => {
  const [showDetailsConfirm, setShowDetailsConfirm] = useState(false);

  const detailsForm = useForm<PersonalDetailsFormData>({
    defaultValues: {
      firstName: user?.fullname ? user.fullname.split(" ").slice(0, -1).join(" ") : "",
      lastName: user?.fullname ? user.fullname.split(" ").slice(-1)[0] : "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      dob: formatDateForInput(user?.dob),
    },
  });

  // Update form values when user data changes
  useEffect(() => {
    if (user) {
      detailsForm.reset({
        firstName: user.fullname ? user.fullname.split(" ").slice(0, -1).join(" ") : "",
        lastName: user.fullname ? user.fullname.split(" ").slice(-1)[0] : "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        dob: formatDateForInput(user.dob),
      });
    }
  }, [user, detailsForm]);

  const handleDetailsSubmit = async (data: PersonalDetailsFormData) => {
    if (!user?.id) return;

    try {
      await onUpdateProfile(user.id, {
        fullname: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dob: data.dob ? new Date(data.dob).toISOString() : undefined,
      } as Partial<User>);

      // Reset the form with the new values to ensure UI reflects changes
      detailsForm.reset({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dob: data.dob,
      });

      toast.success("Profile updated successfully");
      setShowDetailsConfirm(false);
    } catch (err) {
      console.error("Profile update error:", err);
      toast.error("Failed to update profile");
    }
  };

  const onFormSubmit = () => {
    setShowDetailsConfirm(true);
  };

  const isDetailsFormDirty = detailsForm.formState.isDirty;

  return (
    <>
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Personal Details</h2>
            <p className="text-sm text-muted-foreground">
              To change your personal details, edit and save from here
            </p>
            <form onSubmit={detailsForm.handleSubmit(onFormSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <Input
                    placeholder="Mathew"
                    className="rounded-xl"
                    {...detailsForm.register("firstName")}
                  />
                  {detailsForm.formState.errors.firstName && (
                    <p className="text-sm text-red-500">
                      {detailsForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    placeholder="Anderson"
                    className="rounded-xl"
                    {...detailsForm.register("lastName")}
                  />
                  {detailsForm.formState.errors.lastName && (
                    <p className="text-sm text-red-500">
                      {detailsForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <Input
                    placeholder="mathew@example.com"
                    className="rounded-xl"
                    {...detailsForm.register("email")}
                  />
                  {detailsForm.formState.errors.email && (
                    <p className="text-sm text-red-500">
                      {detailsForm.formState.errors.email.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <Input
                    placeholder="+1 (555) 123-4567"
                    className="rounded-xl"
                    {...detailsForm.register("phone")}
                  />
                  {detailsForm.formState.errors.phone && (
                    <p className="text-sm text-red-500">
                      {detailsForm.formState.errors.phone.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <Input
                    placeholder="123 Main St, Anytown, USA"
                    className="rounded-xl"
                    {...detailsForm.register("address")}
                  />
                  {detailsForm.formState.errors.address && (
                    <p className="text-sm text-red-500">
                      {detailsForm.formState.errors.address.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Date of Birth</label>
                  <Input
                    type="date"
                    className="rounded-xl"
                    {...detailsForm.register("dob")}
                  />
                  {detailsForm.formState.errors.dob && (
                    <p className="text-sm text-red-500">
                      {detailsForm.formState.errors.dob.message}
                    </p>
                  )}
                </div>
              </div>

              {isDetailsFormDirty && (
                <Button type="submit" className="w-full sm:w-max">
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
              )}
            </form>
          </div>
        </CardContent>
      </Card>

      <ConfirmModal
        isOpen={showDetailsConfirm}
        onClose={() => setShowDetailsConfirm(false)}
        onConfirm={() => handleDetailsSubmit(detailsForm.getValues())}
        title="Update Profile"
        description="Are you sure you want to update your profile information?"
        confirmText="Update Profile"
      />
    </>
  );
};
