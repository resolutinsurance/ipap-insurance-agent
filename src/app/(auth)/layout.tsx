import AuthHeader from "@/components/auth-header";
import PageLoader from "@/components/ui/page-loader";
import Image from "next/image";
import React, { Suspense } from "react";

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <Suspense fallback={<PageLoader />}>
      <main className="grid grid-cols-1 md:grid-cols-3 w-screen h-screen">
        <div className="col-span-2 flex flex-col">
          <AuthHeader />
          <section className="flex-1">
            <div className="h-full mx-auto max-w-2xl w-full">{children}</div>
          </section>
        </div>
        <div className="hidden md:flex items-center justify-center bg-[#EFF4FA]">
          <Image
            src="/assets/illustrations/auth-bg.svg"
            alt="auth-bg"
            width={500}
            height={500}
          />
        </div>
      </main>
    </Suspense>
  );
};

export default AuthLayout;
