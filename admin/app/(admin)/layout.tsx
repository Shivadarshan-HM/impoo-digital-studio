"use client";

import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SidebarContent } from "@/components/admin/Sidebar";
import { Topbar } from "@/components/admin/Topbar";
import { Sheet } from "@/components/ui/sheet";
import { ToastProvider } from "@/components/ui/toast";
import { getMe, getStoredToken, removeStoredToken } from "@/lib/api";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authenticating, setAuthenticating] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getStoredToken();
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        await getMe();
        setAuthenticating(false);
      } catch {
        removeStoredToken();
        router.push("/login");
      }
    };

    checkAuth();
  }, [router, pathname]);

  if (authenticating) {
    return (
      <div className="min-h-screen bg-[#080808] text-foreground flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold-400 border-t-transparent" />
          <p className="text-xs uppercase tracking-widest text-gold-400 font-mono">
            Verifying Session...
          </p>
        </div>
      </div>
    );
  }

  return (
    <ToastProvider>
      <div className="min-h-screen bg-[#080808] text-foreground flex overflow-x-hidden">
        {/* Desktop Animated Sidebar */}
        <motion.aside
          initial={false}
          animate={{ width: collapsed ? 72 : 240 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="hidden md:block shrink-0 sticky top-0 h-screen z-40"
        >
          <SidebarContent
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
          />
        </motion.aside>

        {/* Mobile Drawer (Sheet) Sidebar */}
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} side="left">
          <SidebarContent
            collapsed={false}
            onToggleCollapse={() => setMobileMenuOpen(false)}
            onNavigate={() => setMobileMenuOpen(false)}
          />
        </Sheet>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Topbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />

          {/* Smooth Page Transitions */}
          <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={pathname}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </ToastProvider>
  );
}
