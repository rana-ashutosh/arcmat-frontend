'use client';

import { Menu } from 'lucide-react';
import { useSidebarStore } from '@/store/useSidebarStore';

export default function MobileSidebarTrigger() {
    const { toggleMobileSidebar } = useSidebarStore();

    return (
        <button
            onClick={toggleMobileSidebar}
            className="md:hidden p-4 text-gray-600 hover:text-gray-900"
            aria-label="Toggle Sidebar"
        >
            <Menu className="w-6 h-6" />
        </button>
    );
}
