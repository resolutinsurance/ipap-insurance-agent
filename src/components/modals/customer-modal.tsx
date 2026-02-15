import { useAgent } from '@/hooks/use-agent'
import { useAuth } from '@/hooks/use-auth'
import { USER_TYPES } from '@/lib/constants'
import { ApiError, CustomerModalProps, User } from '@/lib/interfaces'
import { customerFormSchema, CustomerFormValues } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  Textarea,
} from '@resolutinsurance/ipap-shared/components'
import { useEffect, useState } from 'react'
import {
  FieldValue,
  FieldValues,
  useForm,
  UseFormReturn,
} from 'react-hook-form'
import { toast } from 'sonner'

type AddFormValues = CustomerFormValues
type EditFormValues = Omit<CustomerFormValues, 'password'>

interface FormFieldProps<T extends FieldValues> {
  name: keyof T
  label: string
  type?: string
  isTextarea?: boolean
  form: UseFormReturn<T>
}

const FormField = <T extends FieldValues>({
  name,
  label,
  type = 'text',
  isTextarea = false,
  form,
}: FormFieldProps<T>) => {
  const Component = isTextarea ? Textarea : Input
  const error = form.formState.errors[name]

  return (
    <div className="space-y-2">
      <Label htmlFor={String(name)}>{label}</Label>
      <Component
        id={String(name)}
        type={type}
        placeholder={`Enter ${label.toLowerCase()}`}
        {...form.register(name as FieldValue<T>)}
      />
      {error && (
        <p className="text-sm text-red-500">{error.message as string}</p>
      )}
    </div>
  )
}

const CustomerModal = ({
  isOpen,
  onClose,
  mode,
  userType,
  selectedCustomer,
  onSuccess,
}: CustomerModalProps) => {
  const { agent, createCustomer, updateCustomer } = useAgent()
  const { user, updateUserProfile } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [existingUserData, setExistingUserData] = useState<User | null>(null)

  const addForm = useForm<AddFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
    },
  })

  const editForm = useForm<EditFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      fullname: '',
      email: '',
      phone: '',
      address: '',
      dob: '',
    },
  })

  useEffect(() => {
    if (selectedCustomer && (mode === 'edit' || mode === 'profile')) {
      editForm.reset({
        fullname: selectedCustomer.fullname,
        email: selectedCustomer.email,
        phone: selectedCustomer.phone,
        address: selectedCustomer.address || '',
        dob: selectedCustomer.dob || '',
      })
    }
  }, [selectedCustomer, mode, editForm])

  const handleExistingUserError = (
    error: ApiError,
    data: AddFormValues | EditFormValues,
  ) => {
    if (
      error?.response?.status === 400 &&
      error?.response?.data?.message?.includes('user already exists')
    ) {
      const s = error.response.data.message.split(':')
      const customerId = error.response.data?.id
        ? error.response.data.id
        : s[s.length - 1]

      setExistingUserData({
        fullname: data.fullname,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dob: data.dob,
        id: customerId,
      })
      setShowConfirmDialog(true)
      return true
    }
    return false
  }

  const handleAddSubmit = async (data: AddFormValues) => {
    if (!agent?.id) {
      toast.error('Agent ID not found')
      return
    }

    const customerData = {
      ...data,
      dob: data.dob || '',
      address: data.address || '',
      registeredByAgentID: agent.id,
    }

    try {
      await createCustomer.mutateAsync(customerData)
      toast.success('Customer added successfully')
      onClose()
      onSuccess?.()
    } catch (error) {
      const apiError = error as ApiError
      if (!handleExistingUserError(apiError, data)) {
        toast.error('An error occurred. Please try again.')
      }
    }
  }

  const handleConfirmExistingUser = async () => {
    if (!existingUserData || !agent?.id) return

    try {
      const customerData = {
        ...existingUserData,
        registeredByAgentID: agent.id,
        dob: existingUserData.dob || '',
      }

      await updateCustomer.mutateAsync({
        userId: existingUserData.id!,
        userData: customerData,
      })
      toast.success('Customer registered successfully')
      setShowConfirmDialog(false)
      setExistingUserData(null)
      onClose()
      onSuccess?.()
    } catch (error) {
      console.error('error', error)
      toast.error('Failed to register existing customer')
    }
  }

  const handleEditSubmit = async (data: EditFormValues) => {
    if (!selectedCustomer?.id) {
      toast.error('Customer ID not found')
      return
    }
    await updateCustomer.mutateAsync(
      { userId: selectedCustomer.id, userData: data },
      {
        onSuccess: () => {
          toast.success(
            mode === 'profile'
              ? 'Profile updated successfully'
              : 'Customer updated successfully',
          )
        },
      },
    )
  }

  const handleProfileUpdate = async (data: EditFormValues) => {
    if (!user?.id) {
      toast.error('User not found')
      return
    }

    await updateUserProfile.mutateAsync(
      { userId: user.id, data },
      {
        onSuccess: () => {
          toast.success('Profile updated successfully')
        },
        onError: () => {
          toast.error('Failed to update profile')
        },
      },
    )
  }

  const onSubmit = async (data: AddFormValues | EditFormValues) => {
    setIsSubmitting(true)
    try {
      if (mode === 'add' && userType !== USER_TYPES.CUSTOMER) {
        await handleAddSubmit(data as AddFormValues)
      } else if (mode === 'edit') {
        await handleEditSubmit(data as EditFormValues)
      } else if (mode === 'profile') {
        await handleProfileUpdate(data as EditFormValues)
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      const apiError = error as ApiError
      if (!handleExistingUserError(apiError, data)) {
        toast.error('An error occurred. Please try again.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  // Define form fields configuration
  const formFields = [
    { name: 'fullname', label: 'Full Name' },
    { name: 'email', label: 'Email', type: 'email' },
    { name: 'phone', label: 'Phone Number' },
    { name: 'address', label: 'Address' },
    { name: 'dob', label: 'Date of Birth', type: 'date' },
  ]

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {mode === 'add'
                ? 'Add New Customer'
                : mode === 'edit'
                  ? 'Edit Customer'
                  : 'Update Profile'}
            </DialogTitle>
            <DialogDescription>
              {mode === 'add'
                ? 'Fill in the details to add a new customer.'
                : mode === 'edit'
                  ? 'Update the customer details from modal.'
                  : 'Update your profile information.'}
            </DialogDescription>
          </DialogHeader>

          <form
            onSubmit={
              mode === 'add'
                ? addForm.handleSubmit(onSubmit)
                : editForm.handleSubmit(onSubmit)
            }
            className="space-y-4"
          >
            {mode === 'add' ? (
              <>
                {formFields.map((field) => (
                  <FormField
                    key={field.name}
                    name={field.name as keyof AddFormValues}
                    label={field.label}
                    type={field.type}
                    form={addForm}
                  />
                ))}
              </>
            ) : (
              <>
                {formFields.map((field) => (
                  <FormField
                    key={field.name}
                    name={field.name as keyof EditFormValues}
                    label={field.label}
                    type={field.type}
                    form={editForm}
                  />
                ))}
              </>
            )}

            <DialogFooter>
              <Button variant="outline" type="button" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? 'Saving...'
                  : mode === 'add'
                    ? 'Save Customer'
                    : mode === 'edit'
                      ? 'Save Changes'
                      : 'Update Profile'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>User Already Exists</AlertDialogTitle>
            <AlertDialogDescription>
              This user already exists in the system. Would you like to register
              them as your customer?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setShowConfirmDialog(false)
                setExistingUserData(null)
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmExistingUser}>
              Yes, Register Customer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}

export default CustomerModal
