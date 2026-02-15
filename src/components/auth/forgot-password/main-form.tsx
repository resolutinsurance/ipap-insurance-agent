'use client'

import { Button } from '@resolutinsurance/ipap-shared/components'
import Link from 'next/link'
import { useState } from 'react'
import { EmailStep } from './email-step'
import { PasswordStep } from './password-step'
import { VerificationStep } from './verification-step'

export const ForgotPasswordForm = () => {
  const [step, setStep] = useState<'email' | 'verification' | 'password'>(
    'email',
  )
  const [email, setEmail] = useState('')

  const handleEmailSuccess = (emailValue: string) => {
    setEmail(emailValue)
    setStep('verification')
  }

  const handleVerificationSuccess = () => {
    setStep('password')
  }

  return (
    <div className="bg-background flex h-full items-center justify-center">
      <div className="w-full max-w-[500px] space-y-8 p-8">
        {step === 'email' && <EmailStep onSuccess={handleEmailSuccess} />}

        {step === 'verification' && (
          <VerificationStep
            email={email}
            onSuccess={handleVerificationSuccess}
          />
        )}

        {step === 'password' && <PasswordStep email={email} />}

        <Button asChild variant="outline" className="w-full">
          <Link href="/sign-in">Back to sign in</Link>
        </Button>
      </div>
    </div>
  )
}
