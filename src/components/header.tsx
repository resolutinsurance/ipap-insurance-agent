'use client'
import { useAuth } from '@/hooks/use-auth'
import { ROUTES } from '@/lib/constants'
import { getRouteIcon } from '@/lib/utils'
import { Icon } from '@iconify/react'
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Button,
  Card,
  CardContent,
  useSidebar,
} from '@resolutinsurance/ipap-shared/components'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import InstallPrompt from './install-prompt'

export const Header = () => {
  const { user } = useAuth()
  const { toggleSidebar } = useSidebar()
  return (
    <>
      <header className="bg-background flex w-full items-center justify-between px-4 py-2">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Image
              src="/assets/icons/menu.svg"
              alt="menu"
              width={20}
              height={20}
            />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Image
              src="/assets/icons/round-menu.svg"
              alt="menu"
              width={20}
              height={20}
            />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <InstallPrompt />

          <Button variant="ghost" size="icon" className="relative">
            <Icon
              icon="solar:bell-bing-line-duotone"
              className="h-[1.2rem] w-[1.2rem]"
            />
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-pink-500 text-[10px] font-medium text-white">
              5
            </span>
          </Button>
          {user && <UserProfile />}
        </div>
      </header>
    </>
  )
}

export const InnerHeader = () => {
  const pathname = usePathname()
  const { user } = useAuth()

  const currentSegment =
    pathname.split('/').filter(Boolean).pop() || 'dashboard'
  const RouteIcon = getRouteIcon(currentSegment)

  return (
    <div className="py-4">
      <Card className="shadow-none">
        <CardContent className="px-6">
          <div className="flex justify-between gap-4">
            <h2 className="text-xl font-semibold md:text-2xl">
              Hello {user?.fullname}
            </h2>
            <div className="text-muted-foreground flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <RouteIcon className="h-4 w-4" />
                <span>/</span>
                <span className="bg-accent text-primary rounded-md px-2 py-1 font-medium capitalize">
                  {currentSegment.replace(/-/g, ' ')}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export const UserProfile = () => {
  const { user } = useAuth()
  if (!user) return null
  return (
    <Link
      href={ROUTES.AGENT.PROFILE.USER}
      key={user?.id + user?.fullname + user?.email}
    >
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </Link>
  )
}
