import LoginForm from "@/components/auth/login-form";

const Page = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = (await searchParams) as { ref: string; from: string; company: string };
  return (
    <div className="flex items-center justify-center bg-background h-full">
      <div className="w-full max-w-[500px] space-y-8 p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to IPAP Agent Portal
          </h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>
        <LoginForm params={params} />
      </div>
    </div>
  );
};

export default Page;
