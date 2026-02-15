import { Button } from '@resolutinsurance/ipap-shared/components'
import { ROUTES } from '@/lib/constants'
import Link from 'next/link'
import React from 'react'

export default function NotFound(): React.JSX.Element {
  return (
    <div className="w-full">
      <section className="flex min-h-screen flex-1 flex-col items-center justify-center">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-x-2 leading-none">
            <h2 className="text-red text-[100px] font-extrabold md:text-[250px]">
              <span className="text-primary">4</span>
              <span>0</span>
              <span className="text-primary">4</span>
            </h2>
          </div>
          <div className="space-y-10">
            <h1 className="text-xl font-medium lg:text-2xl">
              Whoops! Page not found!
            </h1>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button aria-label="Go Home" asChild className="w-[200px]">
                <Link href={ROUTES.PUBLIC.HOME}>Go Home</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
