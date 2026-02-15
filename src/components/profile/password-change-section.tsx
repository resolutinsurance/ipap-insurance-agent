'use client'

import { PasswordFormData, passwordSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  ConfirmModal,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  PasswordInput,
} from '@resolutinsurance/ipap-shared/components'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface PasswordChangeModalProps {
  userEmail?: string
  onChangePassword: (email: string, newPassword: string) => Promise<void>
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const PasswordChangeModal = ({
  userEmail,
  onChangePassword,
  open,
  onOpenChange,
}: PasswordChangeModalProps) => {
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false)
  const [passwordFormData, setPasswordFormData] =
    useState<PasswordFormData | null>(null)

  const passwordForm = useForm<PasswordFormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  const onPasswordSubmit = (data: PasswordFormData) => {
    setPasswordFormData(data)
    setShowPasswordConfirm(true)
  }

  const onSubmitPassword = async () => {
    if (!userEmail || !passwordFormData) return

    try {
      await onChangePassword(userEmail, passwordFormData.newPassword)

      toast.success('Password changed successfully')
      setShowPasswordConfirm(false)
      passwordForm.reset()
      onOpenChange(false)
    } catch (err) {
      console.error('Password change error:', err)
      toast.error(
        err instanceof Error ? err.message : 'Failed to change password',
      )
    } finally {
      setPasswordFormData(null)
    }
  }

  const handleClose = () => {
    passwordForm.reset()
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Change Password</DialogTitle>
            <DialogDescription>
              To change your password, please fill in the form below.
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <label className="text-sm font-medium">Current Password</label>
              <PasswordInput
                className="rounded-xl"
                {...passwordForm.register('currentPassword')}
              />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">
                  {passwordForm.formState.errors.currentPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">New Password</label>
              <PasswordInput
                className="rounded-xl"
                {...passwordForm.register('newPassword')}
              />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-red-500">
                  {passwordForm.formState.errors.newPassword.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Confirm Password</label>
              <PasswordInput
                className="rounded-xl"
                {...passwordForm.register('confirmPassword')}
              />
              {passwordForm.formState.errors.confirmPassword && (
                <p className="text-sm text-red-500">
                  {passwordForm.formState.errors.confirmPassword.message}
                </p>
              )}
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit">Update Password</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmModal
        isOpen={showPasswordConfirm}
        onClose={() => setShowPasswordConfirm(false)}
        onConfirm={onSubmitPassword}
        title="Change Password"
        description="Are you sure you want to change your password? This action cannot be undone."
        confirmText="Change Password"
      />
    </>
  )
}
