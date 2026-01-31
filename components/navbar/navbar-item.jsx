"use client";

import { cn } from "./utils";

export const NavbarItem = ({ item, activeItem, onMouseEnter, onMouseLeave, isFirst }) => {
    const isActive = activeItem === item.name;

    return (
        <li
            className="relative"
            onMouseEnter={() => onMouseEnter(item.name)}
            onMouseLeave={onMouseLeave}
        >
            <button
                className={cn(
                    "w-full px-3 py-2 text-[13px] font-bold transition-all duration-200 outline-none rounded-full whitespace-nowrap",
                    item.isSpecial ? "text-[hsl(15,80%,65%)]" : "text-[hsl(20,10%,15%)]",
                    isActive
                        ? "bg-[#ead4ce] text-[hsl(20,10%,15%)]"
                        : !item.isSpecial && "hover:text-[hsl(20,10%,45%)] hover:bg-[#ead4ce]/50 "
                )}
            >
                {item.name}
            </button>
        </li>
    );
};
