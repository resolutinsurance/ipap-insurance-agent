"use client";

import FindCustomerPolicyDetailsForCompany from "@/components/dashboard/find-policy";
import { Card, CardContent } from "@/components/ui/card";

const FindPolicyPage = () => {
  return (
    <Card>
      <CardContent>
        <FindCustomerPolicyDetailsForCompany />
      </CardContent>
    </Card>
  );
};

export default FindPolicyPage;
