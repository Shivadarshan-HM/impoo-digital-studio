"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Menu, ChevronRight, User, Settings, LogOut, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { logoutAdmin } from "@/lib/api";

interface TopbarProps {
  onOpenMobileMenu: () => void;
}

export function Topbar({ onOpenMobileMenu }: TopbarProps) {
  const pathname = usePathname();
  const router = useRouter();

  // Generate Breadcrumbs
  const getBreadcrumbs = () => {
    const parts = pathname.split("/").filter(Boolean);
    if (parts.length === 0) return [{ label: "Dashboard", href: "/dashboard" }];

    return parts.map((part, idx) => {
      const href = "/" + parts.slice(0, idx + 1).join("/");
      const label =
        part.charAt(0).toUpperCase() + part.slice(1).replace("-", " ");
      return { label, href };
    });
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="h-16 border-b border-border/70 bg-[#0c0c0c]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between sticky top-0 z-30 select-none">
      {/* Left: Mobile Drawer Trigger & Breadcrumbs */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={onOpenMobileMenu}
          className="md:hidden text-muted-foreground hover:text-foreground"
          aria-label="Open mobile navigation"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Dynamic Breadcrumbs */}
        <nav
          className="flex items-center gap-1.5 text-xs md:text-sm font-medium"
          aria-label="Breadcrumb"
        >
          <Link
            href="/dashboard"
            className="text-muted-foreground hover:text-gold-400 transition-colors"
          >
            Portal
          </Link>

          {breadcrumbs.map((crumb, idx) => (
            <div key={crumb.href} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" />
              <Link
                href={crumb.href}
                className={
                  idx === breadcrumbs.length - 1
                    ? "text-gold-400 font-semibold cursor-default pointer-events-none"
                    : "text-muted-foreground hover:text-gold-400 transition-colors"
                }
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>
      </div>

      {/* Right: Notifications & Admin Profile */}
      <div className="flex items-center gap-3">
        {/* Quick Notification Icon */}
        <Button
          variant="ghost"
          size="icon"
          className="relative text-muted-foreground hover:text-foreground h-9 w-9 rounded-full"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-gold-400 animate-pulse" />
        </Button>

        <div className="h-4 w-px bg-border/80 hidden sm:block" />

        {/* User Dropdown Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <Avatar className="h-9 w-9">
              <AvatarFallback className="bg-gold-400/20 text-gold-400 font-mono text-xs border border-gold-400/40">
                RA
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs md:text-sm font-medium leading-none text-foreground">
                Ravikumar Aradhya
              </span>
              <span className="text-[0.65rem] text-gold-400/80 font-mono mt-0.5">
                Owner / Lead Photographer
              </span>
            </div>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="right" className="w-56 bg-card border-border/80">
            <div className="px-3 py-2 border-b border-border/60">
              <p className="text-xs font-semibold text-foreground">Ravikumar Aradhya</p>
              <p className="text-[0.7rem] text-muted-foreground font-mono">
                admin@impodigitalstudio.com
              </p>
            </div>

            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <User className="mr-2 h-4 w-4 text-gold-400" />
              <span>Admin Profile</span>
            </DropdownMenuItem>

            <DropdownMenuItem onClick={() => router.push("/settings")}>
              <Settings className="mr-2 h-4 w-4 text-gold-400" />
              <span>Studio Settings</span>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              onClick={logoutAdmin}
              className="text-rose-400 hover:text-rose-300"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
