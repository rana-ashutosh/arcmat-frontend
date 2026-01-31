'use client';

import { memo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';

const SidebarItem = memo(({ item, isCollapsed }) => {
    const pathname = usePathname();
    const isActive = pathname.startsWith(item.href);
    const Icon = item.icon;

    return (
        <Link
            href={item.href}
            title={isCollapsed ? item.label : undefined}
            className={clsx(
                "flex items-center justify-between py-3 px-2 rounded-lg transition-all duration-300 group overflow-hidden whitespace-nowrap",
                isActive
                    ? "bg-gray-100 text-[#d9a88a]"
                    : "text-gray-500 hover:bg-gray-50 hover:text-[#d9a88a]",
                // Removed justify-center, relying on width/margin adjustments
            )}
        >
            <div className="flex items-center gap-3">
                <Icon className={clsx("w-5 h-5 shrink-0", isActive ? "text-[#d9a88a]" : "text-gray-400 group-hover:text-[#d9a88a]")} />
                <span
                    className={clsx(
                        "font-medium text-sm transition-all duration-300 overflow-hidden",
                        isCollapsed ? "max-w-0 opacity-0 translate-x-[-10px]" : "max-w-[200px] opacity-100 translate-x-0"
                    )}
                >
                    {item.label}
                </span>
            </div>
            <ChevronRight className={clsx(
                "w-4 h-4 text-gray-300 transition-all duration-300 shrink-0",
                isActive && "text-[#d9a88a]",
                isCollapsed ? "max-w-0 opacity-0 -translate-x-4" : "max-w-4 opacity-100 translate-x-0 group-hover:translate-x-1"
            )} />
        </Link>
    );
});

SidebarItem.displayName = 'SidebarItem';

export default SidebarItem;