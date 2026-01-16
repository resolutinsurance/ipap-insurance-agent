/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "@/components/ui/password-input";
import { useAuth } from "@/hooks/use-auth";
import { COOKIE_KEYS } from "@/lib/constants";
import { signInFormSchema, type SignInFormValues } from "@/lib/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

const Page = () => {
  const { login, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const ref = searchParams.get("ref");
  const company = searchParams.get("companyID");
  const [email, setEmail] = useState<string>("");

  const { decryptUserRefLink } = useAuth();
  const decryptEmailRef = async () => {
    if (ref && from && company) {
      const data = await decryptUserRefLink.mutateAsync({ ref, companyID: company });
      setEmail(data.email);
    } else {
      const data = Cookies.get(COOKIE_KEYS.emailRef);
      if (data) {
        const parsedData = JSON.parse(data);
        setEmail(parsedData.email);
      }
    }
  };

  useEffect(() => {
    decryptEmailRef();
  }, [ref, from, company]);

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email,
      password: "",
      rememberMe: true,
    },
  });

  // Add useEffect to update form when email is set
  useEffect(() => {
    if (email) {
      form.setValue("email", email);
    }
  }, [email, form]);

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await login.mutateAsync({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? true,
      });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to sign in");
    }
  };

  return (
    <div className="flex items-center justify-center bg-background h-full">
      <div className="w-full max-w-[500px] space-y-8 p-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Welcome to IPAP</h1>
          <p className="text-sm text-muted-foreground">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...form.register("email")}
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-500">
                {form.formState.errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              placeholder="Enter your password"
              {...form.register("password")}
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-500">
                {form.formState.errors.password.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox id="rememberMe" {...form.register("rememberMe")} />
              <Label htmlFor="rememberMe" className="text-sm">
                Remember me
              </Label>
            </div>
            <Button asChild variant="link" className="px-0 text-sm">
              <Link href="/forgot-password">Forgot Password?</Link>
            </Button>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Page;
