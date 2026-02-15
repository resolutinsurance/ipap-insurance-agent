'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { Header, InnerHeader } from '@/components/header'
import { cn } from '@/lib/utils'
import {
  SidebarProvider,
  WidthConstraint,
} from '@resolutinsurance/ipap-shared/components'
import { ReactNode } from 'react'

export default function MainLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider defaultOpen={true}>
      <div className="bg-background flex h-screen w-screen overflow-clip">
        <AppSidebar />
        <div
          className={cn(
            'flex flex-1 flex-col overflow-x-auto transition-all duration-300 ease-in-out',
          )}
        >
          <Header />
          <WidthConstraint className="h-[calc(100vh-55px)] w-full overflow-y-auto">
            <InnerHeader />
            <main className="h-[calc(100vh-200px)] flex-1">{children}</main>
          </WidthConstraint>
        </div>
      </div>
    </SidebarProvider>
  )
}
