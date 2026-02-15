'use client'

import { Button } from '@resolutinsurance/ipap-shared/components'
import { Card, CardContent } from '@resolutinsurance/ipap-shared/components'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'

const ErrorPage = () => {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-4">
      <Card className="max-w-md text-center">
        <CardContent>
          <h1 className="mb-2 text-2xl font-semibold tracking-tight">
            Oops! Something went wrong
          </h1>
          <p className="text-muted-foreground mb-6 text-sm">
            An unexpected error occurred while loading this page. Please try
            again, or go back to the dashboard.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button
              className="w-[150px]"
              onClick={() => window.location.reload()}
            >
              Try again
            </Button>
            <Button variant="outline" className="w-[150px]" asChild>
              <Link href={ROUTES.PUBLIC.HOME}>Go back home</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}

export default ErrorPage
