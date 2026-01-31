"use client";

import { useState, useEffect } from "react";
import { MegaMenuSidebar } from "./mega-menu-sidebar";
import { MegaMenuContent } from "./mega-menu-content";

export const MegaMenu = ({ item, setActiveItem, handleMouseLeave }) => {
    // Initialize hoveredCategory with the first category name if available
    const [hoveredCategory, setHoveredCategory] = useState(item.categories?.[0]?.name || "");

    // Reset state when item changes (smooth transition)
    useEffect(() => {
        setHoveredCategory(item.categories?.[0]?.name || "");
    }, [item]);

    const activeCategory = item.categories?.find(c => c.name === hoveredCategory);

    return (
        <div
            className="w-full"
            onMouseEnter={() => setActiveItem(item.name)}
            onMouseLeave={handleMouseLeave}
        >
            <div className="bg-[#ead4ce] rounded-b-3xl shadow-xl border border-[hsl(30,15%,90%)] animate-fade-in w-[95vw] overflow-hidden flex">
                <MegaMenuSidebar
                    categories={item.categories}
                    hoveredCategory={hoveredCategory}
                    setHoveredCategory={setHoveredCategory}
                    itemName={item.name}
                />

                <MegaMenuContent
                    activeCategory={activeCategory}
                    hoveredCategory={hoveredCategory}
                    image={item.image}
                />
            </div>
        </div>
    );
};
