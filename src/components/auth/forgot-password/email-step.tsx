'use client'

import { useAuth } from '@/hooks/use-auth'
import { ForgotPasswordFormData, forgotPasswordSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input, Label } from '@resolutinsurance/ipap-shared/components'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EmailStepProps {
  onSuccess: (email: string) => void
}

export const EmailStep = ({ onSuccess }: EmailStepProps) => {
  const { requestPasswordResetCode } = useAuth()

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  })

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      await requestPasswordResetCode.mutateAsync(data.email)
      toast.success('Reset code sent to your email')
      onSuccess(data.email)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Failed to send reset code',
      )
    }
  }

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Forgot your password?
        </h1>
        <p className="text-muted-foreground text-sm">
          Please enter the email address associated with your account and we
          will email you a link to reset your password.
        </p>
      </div>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter your email"
            {...form.register('email')}
          />
          {form.formState.errors.email && (
            <p className="text-sm text-red-500">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full"
          disabled={requestPasswordResetCode.isPending}
        >
          {requestPasswordResetCode.isPending
            ? 'Sending...'
            : 'Send reset password code'}
        </Button>
      </form>
    </>
  )
}
