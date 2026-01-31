import React from 'react';
import Image from 'next/image';
import Button from '../ui/Button';
import { Upload } from 'lucide-react';

const HeroSection = () => {
    return (
        <section className="relative w-full h-[80vh] md:h-[80vh] overflow-hidden">
            <div className="absolute inset-0 z-0">
                <Image
                    src="/Images/Inspiration_Gallery.jpeg"
                    alt="Inspiration Gallery Banner" fill
                    sizes="100vw"
                    className="object-cover object-center w-full h-full"
                    priority
                />
            </div>

            <div className="absolute inset-0 bg-black/60 z-10"></div>

            <div className="absolute inset-0 z-20 flex flex-col gap-4 items-center justify-center text-center text-white px-4">
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-[79px] font-semibold leading-tight">
                    Inspiration Gallery
                </h1>
                <p className="max-w-[800px] text-base sm:text-lg md:text-xl lg:text-[23px] font-normal px-2">
                    Discover our collection of inspiration images for kitchens, hospitality, workspaces, and residences.
                </p>
                <div className="flex gap-4 flex-wrap justify-center mt-4">
                    <Button
                        text={
                            <span className="flex items-center gap-2">
                                <Upload className="w-5 h-5" />
                                Upload Your Inspiration
                            </span>
                        }
                        href="/auth/login"
                        className="px-6 py-3 bg-[#e18e60] text-[16px] text-white
    hover:bg-white hover:text-[#e18e60]
    hover:scale-105 transition-all"
                    />

                </div>
            </div>
        </section>
    );
};

export default HeroSection;
