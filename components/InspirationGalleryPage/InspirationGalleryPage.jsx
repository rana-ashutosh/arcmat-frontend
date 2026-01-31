"use client";

import { useState, useEffect } from "react";
import data from "./data.json";
import InspirationCard from "../cards/InspirationPageCard";
import ProductModal from "./ProductModal";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

const categories = [
    "All", "Kitchen", "Bedroom", "Furniture",
    "Decor", "Lighting", "Finishes", "Bathware",
];

const InspirationGalleryPage = () => {
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [visibleCount, setVisibleCount] = useState(8);
    const [liked, setLiked] = useState({});

    /* Persist likes */
    useEffect(() => {
        const saved = localStorage.getItem("liked-products");
        if (saved) setLiked(JSON.parse(saved));
    }, []);

    useEffect(() => {
        localStorage.setItem("liked-products", JSON.stringify(liked));
    }, [liked]);

    // Lock body scroll when modal is open
    useEffect(() => {
        if (selectedProduct) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [selectedProduct]);

    const filteredData =
        activeCategory === "All"
            ? data
            : data.filter((item) => item.category === activeCategory);

    const visibleData = filteredData.slice(0, visibleCount);

    return (
        <section className="bg-white py-16 relative">
            {/* Categories */}
            <Container id="gallery-start">
                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => {
                                setActiveCategory(category);
                                setVisibleCount(8);
                            }}
                            className={`px-6 py-2 rounded-full border transition-all duration-300 text-sm md:text-base font-medium
              ${activeCategory === category
                                    ? "bg-[#d69e76] border-[#d69e76] text-white shadow-md"
                                    : "bg-white border-[#d69e76] text-[#6b6b6b] hover:bg-[#fff6f0]"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>
            </Container>

            {/* Gallery */}
            <div className="p-4 md:p-8 bg-[#ece6df]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, colIndex) => (
                        <div
                            key={colIndex}
                            className={`flex flex-col gap-4
                ${colIndex === 1 || colIndex === 3 ? "mt-10" : ""}
                ${colIndex >= 2 ? "hidden lg:flex" : "flex"}
              `}
                        >
                            {visibleData
                                .filter((_, index) => index % 4 === colIndex)
                                .map((item) => (
                                    <div key={item.id} className="relative h-[350px]">
                                        <InspirationCard
                                            company={item.company}
                                            image={item.image}
                                            description={item.description}
                                            link={item.link}
                                            onViewMore={() => setSelectedProduct(item)} // <--- This triggers the modal
                                        />
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>

                {/* Show More / Show Less */}
                <div className="flex justify-center gap-4 mt-12 mb-20">
                    {visibleCount < filteredData.length && (
                        <Button
                            text="Show More"
                            onClick={() => setVisibleCount((p) => p + 8)}
                            className="bg-white hover:bg-[#d69e76] hover:text-white border-[#d69e76] border text-[#d69e76] font-medium py-3 px-10 h-auto shadow-sm text-lg rounded-full"
                        />
                    )}
                    {visibleCount > 8 && (
                        <Button
                            text="Show Less"
                            onClick={() => {
                                setVisibleCount(8);
                                document.getElementById("gallery-start")?.scrollIntoView({ behavior: "smooth" });
                            }}
                            className="bg-white hover:bg-[#d69e76] hover:text-white border-[#d69e76] border text-[#d69e76] font-medium py-3 px-10 h-auto shadow-sm text-lg rounded-full"
                        />
                    )}
                </div>
            </div>

            {/* MODAL INTEGRATION */}
            <ProductModal
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
            />

        </section>
    );
};

export default InspirationGalleryPage;