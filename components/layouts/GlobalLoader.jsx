"use client";

import { useLoader } from "@/context/LoaderContext";
import Loader from "@/components/ui/loader";

export default function GlobalLoader() {
    const { loading } = useLoader();

    if (!loading) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/30 z-9999 h-screen w-screen backdrop-blur-[2px]">
            <Loader />
        </div>
    );
}
