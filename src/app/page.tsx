"use client";

import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated, userType } = useAuth();

  useEffect(() => {
    if (isAuthenticated && userType) {
      // Redirect to dashboard if authenticated
      router.push(ROUTES.AGENT.HOME);
    } else {
      // Redirect to signin if not authenticated
      router.push(ROUTES.LOGIN);
    }
  }, [isAuthenticated, userType, router]);

  // Show loading state while redirecting
  return (
    <main className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
    </main>
  );
};

export default Home;
