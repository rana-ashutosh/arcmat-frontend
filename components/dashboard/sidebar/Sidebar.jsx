'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HelpCircle,
  ChevronRight,
  ChevronLeft,
  Plus,
  Package,
  Tags,
  Layers,
  Heart,
  ShoppingBag,
  User
} from 'lucide-react';
import clsx from 'clsx';
import useAuthStore from '@/store/useAuthStore';
import { useSidebarStore } from '@/store/useSidebarStore';
import SidebarItem from './SidebarItem';
import SidebarUser from './SidebarUser';
import sidebarData from './sidebar-data.json';

const ICON_MAP = {
  Package,
  Tags,
  Layers,
  HelpCircle,
  ShoppingBag,
  Heart,
  User
};

const mapIcons = (items) => items.map(item => ({
  ...item,
  icon: ICON_MAP[item.icon]
}));

const VENDOR_MENU_ITEMS = mapIcons(sidebarData.VENDOR_MENU_ITEMS);
const USER_MENU_ITEMS = mapIcons(sidebarData.USER_MENU_ITEMS);

export default function Sidebar() {
  const { isCollapsed, toggleSidebar, isMobileOpen, setMobileOpen } = useSidebarStore();
  const { user, isAuthenticated } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
    setMobileOpen(false); // Ensure mobile state is reset on mount
  }, []);

  // Close sidebar on mobile when route changes
  useEffect(() => {
    if (isMobileOpen) {
      setMobileOpen(false);
    }
  }, [pathname]);

  const safeCollapsed = isMobileOpen ? false : isCollapsed;

  // Determine menu items based on role
  const isVendor = user?.role === 'vendor';
  const menuItems = isVendor ? VENDOR_MENU_ITEMS : USER_MENU_ITEMS;
  const visibleItems = menuItems.filter(item => !item.requiresAuth || isAuthenticated);

  return (
    <>
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={clsx(
          "fixed md:relative z-40 h-screen border-r border-gray-200 bg-white transition-all duration-300 flex flex-col shrink-0",
          safeCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 bg-white border border-gray-200 rounded-full p-1 hidden md:flex hover:bg-[#d9a88a] z-50 shadow-sm"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        <div className={clsx(
          "p-6 flex flex-col h-full overflow-x-hidden",
          safeCollapsed ? "overflow-hidden" : "overflow-y-auto"
        )}>

          <SidebarUser isCollapsed={safeCollapsed} mounted={mounted} />

          {!isVendor && (
            <Link
              href="/dashboard/projects/create"
              className={clsx(
                "mb-8 flex items-center justify-center bg-[#d9a88a] hover:bg-[#d9a88a]/90 text-white rounded-full h-10 transition-all shadow-sm overflow-hidden",
                safeCollapsed ? "px-0 w-10 mx-auto" : "px-4 w-full"
              )}
            >
              <Plus className={clsx("w-5 h-5 shrink-0 transition-all", !safeCollapsed && "mr-2")} />
              <span className={clsx(
                "font-medium text-sm transition-all duration-300 overflow-hidden whitespace-nowrap",
                safeCollapsed ? "max-w-0 opacity-0" : "max-w-[200px] opacity-100"
              )}>
                Create project
              </span>
            </Link>
          )}

          <nav className="flex-1 space-y-2">
            {visibleItems.map((item) => (
              <SidebarItem
                key={item.id}
                item={item}
                isCollapsed={safeCollapsed}
              />
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
}