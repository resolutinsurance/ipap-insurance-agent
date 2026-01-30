import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useIsMobile } from "@/hooks/use-mobile";
import { ROUTES } from "@/lib/constants";
import { cn, getNavigation } from "@/lib/utils";
import { LogOutIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./ui/logo";

export function AppSidebar() {
  const pathname = usePathname();
  const { logoutUser, userType } = useAuth();
  const { setOpenMobile } = useSidebar();
  const isMobile = useIsMobile();

  const handleItemClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  if (!userType) {
    return null; // Or a loading state
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center px-4">
          <Link href={ROUTES.AGENT.HOME} onClick={handleItemClick}>
            <Logo />
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        {getNavigation(userType).map((section) => (
          <SidebarGroup key={section.label}>
            <SidebarGroupLabel>{section.label}</SidebarGroupLabel>
            <SidebarMenu>
              {section.items.map((item) => (
                <SidebarMenuItem
                  key={item.href + item.label}
                  className={cn(
                    !item.children && "rounded-full overflow-clip",
                    !item.children && pathname === item.href && "bg-sidebar-accent"
                  )}
                >
                  {item.children ? (
                    <Accordion type="single" collapsible>
                      <AccordionItem value={item.label.toLowerCase()}>
                        <AccordionTrigger className="px-2 py-2 ">
                          <div className="flex items-center gap-2">
                            <item.icon className="h-4 w-4" />
                            <span>{item.label}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="border-none">
                          <SidebarMenuSub>
                            {item.children.map((child) => (
                              <SidebarMenuSubItem
                                key={child.href}
                                className="rounded-full overflow-clip"
                              >
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={pathname === child.href}
                                >
                                  <Link
                                    href={child.href}
                                    onClick={handleItemClick}
                                    target={child.external ? "_blank" : "_self"}
                                  >
                                    <div className="flex items-center gap-2">
                                      <child.icon className="h-4 w-4" />
                                      <span>{child.label}</span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={handleItemClick}
                      target={item.external ? "_blank" : "_self"}
                    >
                      <SidebarMenuButton
                        tooltip={item.label}
                        isActive={pathname === item.href}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </SidebarMenuButton>
                    </Link>
                  )}
                </SidebarMenuItem>
              ))}

              {section.label === "Profile" && (
                <SidebarMenuItem>
                  <SidebarMenuButton
                    tooltip="Log Out"
                    onClick={() => {
                      logoutUser();
                      handleItemClick();
                    }}
                  >
                    <LogOutIcon className="h-4 w-4" />
                    <span>Log Out</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroup>
        ))}
      </SidebarContent>
    </Sidebar>
  );
}
