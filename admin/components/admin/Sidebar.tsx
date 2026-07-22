"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Images,
  FolderTree,
  Camera,
  Users,
  Settings,
  LogOut,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { logoutAdmin } from "@/lib/api";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onNavigate?: () => void;
}

export function SidebarContent({
  collapsed,
  onToggleCollapse,
  onNavigate,
}: SidebarProps) {
  const pathname = usePathname();
  const [galleryOpen, setGalleryOpen] = useState(
    pathname.startsWith("/gallery")
  );

  const isGalleryActive = pathname.startsWith("/gallery");

  const handleLogout = () => {
    if (onNavigate) onNavigate();
    logoutAdmin();
  };

  const linkClass = (active: boolean) =>
    cn(
      "flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 group relative",
      active
        ? "bg-gold-400/10 text-gold-400 border border-gold-400/30 shadow-sm"
        : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
    );

  return (
    <div className="flex flex-col h-full bg-[#0c0c0c] border-r border-border/70 select-none">
      {/* Studio Brand Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/60">
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className="flex items-center gap-3 overflow-hidden"
        >
          <div className="h-9 w-9 rounded-lg border border-gold-400/40 bg-gold-400/10 flex items-center justify-center text-gold-400 shrink-0 shadow-md">
            <Camera className="h-4 w-4" />
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="flex flex-col whitespace-nowrap"
            >
              <span className="font-serif text-sm font-semibold tracking-wider text-foreground uppercase">
                IMPOO
              </span>
              <span className="text-[0.65rem] tracking-[0.25em] text-gold-400 font-mono uppercase">
                Studio Admin
              </span>
            </motion.div>
          )}
        </Link>

        {/* Desktop Collapse Toggle */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleCollapse}
          className="hidden md:flex h-7 w-7 rounded-md text-muted-foreground hover:text-foreground"
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" />
          ) : (
            <ChevronLeft className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1.5">
        {/* Dashboard */}
        <Link
          href="/dashboard"
          onClick={onNavigate}
          className={linkClass(pathname === "/dashboard")}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0 text-gold-400/80 group-hover:text-gold-400 transition-colors" />
          {!collapsed && <span>Dashboard</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-foreground shadow-lg">
              Dashboard
            </div>
          )}
        </Link>

        {/* Gallery Dropdown Section */}
        <div>
          <button
            type="button"
            onClick={() => setGalleryOpen(!galleryOpen)}
            className={cn(
              "w-full text-left flex items-center justify-between px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium transition-all duration-200 group relative",
              isGalleryActive
                ? "text-gold-400 bg-gold-400/5 font-semibold"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
            )}
          >
            <div className="flex items-center gap-3">
              <Images className="h-4 w-4 shrink-0 text-gold-400/80 group-hover:text-gold-400 transition-colors" />
              {!collapsed && <span>Gallery</span>}
            </div>
            {!collapsed && (
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200 text-muted-foreground",
                  galleryOpen && "rotate-180"
                )}
              />
            )}
            {collapsed && (
              <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-foreground shadow-lg">
                Gallery
              </div>
            )}
          </button>

          {/* Sub-items (Categories & Photos) */}
          <AnimatePresence>
            {(galleryOpen || collapsed) && (
              <motion.div
                initial={collapsed ? false : { height: 0, opacity: 0 }}
                animate={collapsed ? {} : { height: "auto", opacity: 1 }}
                exit={collapsed ? {} : { height: 0, opacity: 0 }}
                className={cn(
                  "overflow-hidden space-y-1 mt-1",
                  !collapsed && "pl-7"
                )}
              >
                <Link
                  href="/gallery/categories"
                  onClick={onNavigate}
                  className={linkClass(pathname === "/gallery/categories")}
                >
                  <FolderTree className="h-3.5 w-3.5 shrink-0" />
                  {!collapsed && <span>Categories</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-foreground shadow-lg">
                      Gallery Categories
                    </div>
                  )}
                </Link>

                <Link
                  href="/gallery/photos"
                  onClick={onNavigate}
                  className={linkClass(pathname === "/gallery/photos")}
                >
                  <Camera className="h-3.5 w-3.5 shrink-0" />
                  {!collapsed && <span>Photos</span>}
                  {collapsed && (
                    <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-foreground shadow-lg">
                      Gallery Photos
                    </div>
                  )}
                </Link>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Leads */}
        <Link
          href="/leads"
          onClick={onNavigate}
          className={linkClass(pathname === "/leads")}
        >
          <Users className="h-4 w-4 shrink-0 text-gold-400/80 group-hover:text-gold-400 transition-colors" />
          {!collapsed && <span>Inquiries & Leads</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-foreground shadow-lg">
              Leads
            </div>
          )}
        </Link>

        {/* Settings */}
        <Link
          href="/settings"
          onClick={onNavigate}
          className={linkClass(pathname === "/settings")}
        >
          <Settings className="h-4 w-4 shrink-0 text-gold-400/80 group-hover:text-gold-400 transition-colors" />
          {!collapsed && <span>Settings</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-foreground shadow-lg">
              Settings
            </div>
          )}
        </Link>
      </div>

      {/* Logout Footer Button */}
      <div className="p-3 border-t border-border/60">
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs md:text-sm font-medium text-rose-400 hover:bg-rose-500/10 transition-colors duration-200 group relative"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
          {collapsed && (
            <div className="absolute left-full ml-2 hidden group-hover:flex px-2.5 py-1 bg-card border border-border text-xs rounded-md whitespace-nowrap z-50 text-rose-400 shadow-lg">
              Logout
            </div>
          )}
        </button>
      </div>
    </div>
  );
}
