"use client";

import {
  AgentProfileSection,
  PasswordChangeModal,
  PersonalDetailsSection,
  ProfilePictureSection,
} from "@/components/profile";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { USER_TYPES } from "@/lib/constants";
import { User } from "@/lib/interfaces";
import { KeyRound } from "lucide-react";
import { useState } from "react";

const Page = () => {
  const [activeTab, setActiveTab] = useState("account");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const { user, updateUserProfile, changeUserPassword, userType } = useAuth();

  // Check if user is an agent
  const isAgent = userType === USER_TYPES.AGENT;

  const handlePasswordChange = async (email: string, newPassword: string) => {
    await changeUserPassword.mutateAsync({
      email,
      password: newPassword,
    });
  };

  const handleProfileUpdate = async (userId: string, data: Partial<User>) => {
    await updateUserProfile.mutateAsync({
      userId,
      data,
    });
  };

  return (
    <>
      <Card>
        <CardContent className="relative">
          <div className="absolute top-4 right-4">
            <Button
              onClick={() => setIsPasswordModalOpen(true)}
              variant="outline"
              size="sm"
            >
              <KeyRound className="mr-2 h-4 w-4" />
              Change Password
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="w-full sm:w-max flex-wrap">
              <TabsTrigger value="account" className="flex-1 sm:flex-none">
                Account
              </TabsTrigger>
              {isAgent && (
                <TabsTrigger value="agent" className="flex-1 sm:flex-none">
                  Agent Profile
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="account" className="space-y-6">
              <div className="grid grid-cols-1 gap-6">
                <ProfilePictureSection />
              </div>

              <PersonalDetailsSection
                user={user}
                isLoading={false}
                onUpdateProfile={handleProfileUpdate}
              />
            </TabsContent>

            {isAgent && (
              <TabsContent value="agent" className="space-y-6">
                <AgentProfileSection />
              </TabsContent>
            )}
          </Tabs>
        </CardContent>
      </Card>

      <PasswordChangeModal
        userEmail={user?.email}
        onChangePassword={handlePasswordChange}
        open={isPasswordModalOpen}
        onOpenChange={setIsPasswordModalOpen}
      />
    </>
  );
};

export default Page;
