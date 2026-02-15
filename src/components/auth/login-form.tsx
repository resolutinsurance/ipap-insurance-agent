'use client'
import { useAuth } from '@/hooks/use-auth'
import { COOKIE_KEYS } from '@/lib/constants'
import { SignInFormValues, signInFormSchema } from '@/lib/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Button,
  Checkbox,
  Input,
  Label,
  PasswordInput,
} from '@resolutinsurance/ipap-shared/components'
import Cookies from 'js-cookie'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const LoginForm = ({
  params,
}: {
  params: { ref: string; from: string; company: string }
}) => {
  const [email, setEmail] = useState<string>('')
  const { decryptUserRefLink, login } = useAuth()
  const decryptEmailRef = async () => {
    if (params.ref && params.from && params.company) {
      const data = await decryptUserRefLink.mutateAsync({
        ref: params.ref,
        companyID: params.company,
      })
      setEmail(data.email)
    } else {
      const data = Cookies.get(COOKIE_KEYS.emailRef)
      if (data) {
        const parsedData = JSON.parse(data)
        setEmail(parsedData.email)
      }
    }
  }

  useEffect(() => {
    decryptEmailRef()
  }, [params.ref, params.from, params.company])

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email,
      password: '',
      rememberMe: true,
    },
  })

  // Add useEffect to update form when email is set
  useEffect(() => {
    if (email) {
      form.setValue('email', email)
    }
  }, [email, form])

  const onSubmit = async (data: SignInFormValues) => {
    try {
      await login.mutateAsync({
        email: data.email,
        password: data.password,
        rememberMe: data.rememberMe ?? true,
      })
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to sign in')
    }
  }
  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
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

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          {...form.register('password')}
        />
        {form.formState.errors.password && (
          <p className="text-sm text-red-500">
            {form.formState.errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="rememberMe" {...form.register('rememberMe')} />
          <Label htmlFor="rememberMe" className="text-sm">
            Remember me
          </Label>
        </div>
        <Button asChild variant="link" className="px-0 text-sm">
          <Link href="/forgot-password">Forgot Password?</Link>
        </Button>
      </div>

      <Button type="submit" className="w-full" disabled={login.isPending}>
        {login.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}

export default LoginForm
