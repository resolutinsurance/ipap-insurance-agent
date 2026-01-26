"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check, Copy, Mail, Send } from "lucide-react";
import React from "react";
import { toast } from "sonner";

interface CustomerVerificationLinkStepProps {
  linkSent: boolean;
  clientLink: string | null;
  onGenerateLink: () => void;
  onCancel: () => void;
  isGenerating: boolean;
}

export function CustomerVerificationLinkStep({
  linkSent,
  clientLink,
  onGenerateLink,
  onCancel,
  isGenerating,
}: CustomerVerificationLinkStepProps) {
  const [copied, setCopied] = React.useState(false);

  // Helper to get full URL
  const getFullUrl = React.useCallback((link: string) => {
    if (link.startsWith("http")) {
      return link;
    }
    if (typeof window !== "undefined") {
      return `${window.location.origin}${link.startsWith("/") ? "" : "/"}${link}`;
    }
    return link;
  }, []);

  const handleCopyLink = async () => {
    if (!clientLink) {
      toast.error("No link available to copy");
      return;
    }

    try {
      const fullUrl = getFullUrl(clientLink);
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
      console.error("Failed to copy link:", error);
    }
  };
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Generate Customer Verification Link
        </h2>
        <p className="text-gray-600">
          Create a secure link for your customer to complete their verification and
          payment
        </p>
      </div>

      {linkSent ? (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800">
              Verification Link Sent Successfully!
            </CardTitle>
            <CardDescription className="text-green-700">
              A secure verification link has been sent directly to the customer&apos;s
              email address or phone number associated with this policy.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-green-700">
              <Mail className="h-4 w-4" />
              <span>
                The customer can now complete their verification and payment steps
                remotely
              </span>
            </div>

            {clientLink && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                    <span className="text-gray-600 break-all">
                      {getFullUrl(clientLink)}
                    </span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleCopyLink}
                    className="shrink-0"
                  >
                    {copied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  You can copy and share this link directly with the customer if needed
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card className="p-0 border-none shadow-none max-w-2xl">
          <CardContent className="space-y-4 p-0 ">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Send className="h-5 w-5" />
                Ready to Send Verification Link
              </h3>
              <p className="text-sm">
                Click the button below to generate and send a unique verification link to
                the customer. The link will be sent directly to their email address or
                phone number associated with this policy.
              </p>
            </div>
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-primary">What happens next?</p>
                  <ul className="text-sm text-primary space-y-1">
                    <li>• A secure verification link will be generated</li>
                    <li>
                      • The link will be sent directly to the customer&apos;s contact
                      information
                    </li>
                    <li>
                      • Customer can complete Ghana Card verification and payment remotely
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                variant="outline"
                type="button"
                onClick={onCancel}
                disabled={isGenerating}
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={onGenerateLink}
                disabled={isGenerating}
                className="min-w-[140px]"
              >
                {isGenerating ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Sending Link...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    Send Verification Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
