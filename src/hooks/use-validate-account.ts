import { validateAccount, ValidateAccountRequest } from "@/lib/services/misc";
import { useMutation } from "@tanstack/react-query";

/**
 * Hook for validating account/mobile number and performing name lookup
 * @returns Mutation object with validateAccount function
 */
export const useValidateAccount = () => {
  return useMutation({
    mutationFn: (data: ValidateAccountRequest) => validateAccount(data),
    onError: (error) => {
      console.error("Account validation error:", error);
    },
  });
};
