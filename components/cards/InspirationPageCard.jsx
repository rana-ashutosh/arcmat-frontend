"use client";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";

const InspirationCard = ({ company, image, description, link, onViewMore }) => {
    const targetLink = link || "/not-found";
    const [loaded, setLoaded] = useState(false);
    const imgRef = useRef(null);

    useEffect(() => {
        if (imgRef.current && imgRef.current.complete) {
            setLoaded(true);
        }
    }, []);

    return (
        <Link
            href={targetLink}
            onClick={onViewMore}
            className="relative w-full h-full overflow-hidden rounded-xl cursor-pointer group bg-gray-200 shadow-md hover:shadow-xl transition-shadow duration-300 block"
        >
            {/* Skeleton Loader */}
            {!loaded && (
                <div className="absolute inset-0 animate-pulse bg-gray-300 z-0" />
            )}

            {/* Image with Blur-Up and Zoom Effect */}
            <img
                ref={imgRef}
                src={image}
                alt={description}
                loading="lazy"
                onLoad={() => setLoaded(true)}
                className={`relative z-10 w-full h-full object-cover transition-all duration-700 ease-in-out
                    ${loaded ? "opacity-100 blur-0 scale-100" : "opacity-0 blur-md scale-105"}
                    group-hover:scale-110`}
            />

            {/* HOVER OVERLAY: Gradient & Text */}
            <div className="absolute inset-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#d69e76] mb-1">
                        {company}
                    </p>
                    <p className="text-sm text-gray-200">
                        {description ? description.slice(0, 80) + "..." : ""}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default InspirationCard;