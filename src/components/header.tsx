"use client";
import { useAuth } from "@/hooks/use-auth";
import { ROUTES } from "@/lib/constants";
import { getRouteIcon } from "@/lib/utils";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import InstallPrompt from "./install-prompt";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { useSidebar } from "./ui/sidebar";

export const Header = () => {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();
  return (
    <>
      <header className="flex items-center py-2 justify-between w-full bg-background px-4">
        <div className="flex items-center">
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Image src="/assets/icons/menu.svg" alt="menu" width={20} height={20} />
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Image src="/assets/icons/round-menu.svg" alt="menu" width={20} height={20} />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <InstallPrompt />

          <Button variant="ghost" size="icon" className="relative">
            <Icon icon="solar:bell-bing-line-duotone" className="h-[1.2rem] w-[1.2rem]" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-500 text-[10px] font-medium text-white flex items-center justify-center">
              5
            </span>
          </Button>
          {user && <UserProfile />}
        </div>
      </header>
    </>
  );
};

export const InnerHeader = () => {
  const pathname = usePathname();
  const { user } = useAuth();

  const currentSegment = pathname.split("/").filter(Boolean).pop() || "dashboard";
  const RouteIcon = getRouteIcon(currentSegment);

  return (
    <div className="py-4">
      <Card className="shadow-none">
        <CardContent className="px-6">
          <div className="flex justify-between gap-4">
            <h2 className="md:text-2xl text-xl font-semibold">Hello {user?.fullname}</h2>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <RouteIcon className="h-4 w-4" />
                <span>/</span>
                <span className="capitalize bg-accent text-primary font-medium px-2 py-1 rounded-md">
                  {currentSegment.replace(/-/g, " ")}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export const UserProfile = () => {
  const { user } = useAuth();
  if (!user) return null;
  return (
    <Link href={ROUTES.AGENT.PROFILE.USER} key={user?.id + user?.fullname + user?.email}>
      <div className="flex items-center">
        <Avatar>
          <AvatarImage src="/avatar.png" />
          <AvatarFallback>{user?.fullname?.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
};
