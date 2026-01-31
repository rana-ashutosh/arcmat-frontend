"use client"
import React, { useState } from 'react'

const filterCategories = [
    "Brand",
    "Price Range",
    "Color",
    "Country of Origin",
    "Availability",
    "Pattern",
    "Metallic Finish",
    "Features",
    "Application",
    "Content",
    "Flammability",
    "Abrasion",
    "Climate Impact",
    "Human Health Impact",
    "Social Equity Impact"
]

const ToggleSwitch = ({ label, checked, onChange }) => (
    <div className="flex items-center justify-between py-3 border-b border-gray-100">
        <span className="text-[15px] font-medium text-gray-700">{label}</span>
        <label className="relative inline-flex items-center cursor-pointer">
            <input
                type="checkbox"
                className="sr-only peer"
                checked={checked}
                onChange={(e) => onChange(e.target.checked)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#e09a74]"></div>
        </label>
    </div>
)

const ProductSidebar = ({ activeFilters, setActiveFilters }) => {
    const handleToggleChange = (toggleName, val) => {
        setActiveFilters(prev => ({
            ...prev,
            toggles: { ...prev.toggles, [toggleName]: val }
        }))
    }

    const handleBrandChange = (brand, checked) => {
        setActiveFilters(prev => ({
            ...prev,
            brands: checked
                ? [...prev.brands, brand]
                : prev.brands.filter(b => b !== brand)
        }))
    }

    const clearAll = () => {
        setActiveFilters({
            brands: [],
            colors: [],
            availability: [],
            toggles: {
                commercial: false,
                residential: false,
                allColorways: false
            }
        })
    }

    const [openSections, setOpenSections] = useState({ "Brand": true })

    const toggleSection = (section) => {
        setOpenSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }))
    }

    const brandOptions = ["Sherwin-Williams", "Bedrosians Tile & Stone", "Porcelanosa", "Tarkett", "Arper"]

    return (
        <aside className="w-full h-full border-r-2 border-gray-200 overflow-y-auto no-scrollbar py-2 pr-6 pb-20">
            <div className="flex items-center justify-end mb-2">
                {(activeFilters.brands.length > 0 || Object.values(activeFilters.toggles).some(v => v)) && (
                    <button
                        onClick={clearAll}
                        className="text-[12px] font-semibold text-[#e09a74] hover:underline"
                    >
                        Clear All
                    </button>
                )}
            </div>

            <div className="flex flex-col mb-4">
                <ToggleSwitch
                    label="Commercial"
                    checked={activeFilters.toggles.commercial}
                    onChange={(val) => handleToggleChange('commercial', val)}
                />
                <ToggleSwitch
                    label="Residential"
                    checked={activeFilters.toggles.residential}
                    onChange={(val) => handleToggleChange('residential', val)}
                />
                <ToggleSwitch
                    label="All Colorways"
                    checked={activeFilters.toggles.allColorways}
                    onChange={(val) => handleToggleChange('allColorways', val)}
                />
            </div>

            <div className="mt-2">
                {filterCategories.map((cat, idx) => (
                    <AccordionItem
                        key={idx}
                        title={cat}
                        isOpen={openSections[cat]}
                        onToggle={() => toggleSection(cat)}
                    >
                        {cat === "Brand" && (
                            <div className="flex flex-col gap-2.5 mt-1">
                                {brandOptions.map(brand => (
                                    <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                                        <div className="relative flex items-center">
                                            <input
                                                type="checkbox"
                                                className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-[#e09a74] checked:border-[#e09a74] transition-all"
                                                checked={activeFilters.brands.includes(brand)}
                                                onChange={(e) => handleBrandChange(brand, e.target.checked)}
                                            />
                                            <svg className="absolute h-3.5 w-3.5 text-white opacity-0 peer-checked:opacity-100 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                        </div>
                                        <span className="text-[15px] text-gray-600 group-hover:text-gray-900 transition-colors">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                        {cat !== "Brand" && (
                            <div className="flex flex-col gap-2 italic text-gray-400 text-[13px]">
                                coming soon!!
                            </div>
                        )}
                    </AccordionItem>
                ))}
            </div>

            <style jsx>{`
                .no-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </aside>
    )
}

const AccordionItem = ({ title, isOpen, onToggle, children }) => (
    <div className="border-b border-gray-100">
        <button
            className="flex items-center justify-between w-full py-4 text-left focus:outline-none"
            onClick={onToggle}
        >
            <span className="text-[16px] font-bold text-gray-800">{title}</span>
            {isOpen ? (
                <img className="w-3 h-3 grayscale opacity-60" src="/Icons/angle-up-svgrepo-com.svg" alt="" />
            ) : (
                <img className="grayscale opacity-60" src="/Icons/Vector (3).svg" alt="" />
            )}
        </button>
        {isOpen && (
            <div className="pb-5">
                {children}
            </div>
        )}
    </div>
)

export default ProductSidebar
