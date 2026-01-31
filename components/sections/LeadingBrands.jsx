import Image from "next/image";
import Container from "../ui/Container";

const LeadingBrands = () => {
    const brands = [
        "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg",
        "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg",
        "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg",
        "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg", "comingSoon.jpg"
    ];

    return (
        <section className="bg-white pt-16 pb-20">
            <div className="w-full mx-auto">

                <div className="text-center mb-12">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-[#4D4E58] mb-6 leading-tight">
                        Leading brands collected in <br className="hidden md:block" /> a single place.
                    </h2>
                    <p className="text-gray-500 text-lg md:text-xl font-light">
                        Quickly searches hundreds of brands and thousands of materials in seconds.
                    </p>
                </div>

                <div className="bg-[#E09A74] w-full py-16 rounded-sm">
                    <Container>
                        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 max-w-[1600px] mx-auto">
                            {brands.map((brand, index) => (
                                <div
                                    key={index}
                                    className="bg-white aspect-square flex items-center justify-center p-4 rounded-sm hover:shadow-2xl transition-all duration-300 cursor-pointer relative overflow-hidden group transform hover:-translate-y-1"
                                >
                                    {brand === "comingSoon.jpg" ? (
                                        // Coming Soon Tile
                                        <div className="flex flex-col items-center justify-center w-full h-full text-center relative">
                                            {/* Animated gradient background */}
                                            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 opacity-50"></div>

                                            {/* Image with overlay */}
                                            <div className="relative w-full h-full mb-2">
                                                <Image
                                                    src={`/Brands/${brand}`}
                                                    alt="Coming Soon"
                                                    fill
                                                    className="object-contain opacity-30 grayscale group-hover:grayscale-0 group-hover:opacity-50 transition-all duration-300"
                                                />
                                                {/* Shimmer effect */}
                                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
                                            </div>

                                            {/* Coming Soon Badge with animation */}
                                            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 z-10">
                                                <span className="text-xs font-semibold text-[#E09A74] bg-white px-4 py-1.5 rounded-full shadow-md border border-[#E09A74]/20 animate-pulse">
                                                    Coming Soon
                                                </span>
                                                <span className="text-[10px] text-gray-500 bg-white/80 px-3 py-1 rounded-full">
                                                    Stay Tuned
                                                </span>
                                            </div>

                                            {/* Corner ribbon */}
                                            <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
                                                <div className="absolute top-3 right-[-32px] w-32 text-center bg-[#E09A74] text-white text-[8px] font-bold py-1 rotate-45 shadow-md">
                                                    NEW
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // Regular Brand Tiles
                                        <div className="relative w-full h-full">
                                            {/* Shimmer effect on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 -translate-x-full group-hover:translate-x-full transition-all duration-700 z-10"></div>

                                            {/* Brand Image */}
                                            <Image
                                                src={`/Brands/${brand}`}
                                                alt={`Brand ${index + 1}`}
                                                fill
                                                className="object-contain group-hover:scale-110 transition-transform duration-300"
                                            />

                                            {/* Overlay that appears on hover */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#E09A74]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            {/* Optional: Brand number indicator on hover */}
                                            <div className="absolute bottom-2 right-2 bg-white/90 text-[#E09A74] text-xs font-semibold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-sm">
                                                #{index + 1}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Container>
                </div>

            </div>
        </section>
    );
};

export default LeadingBrands;