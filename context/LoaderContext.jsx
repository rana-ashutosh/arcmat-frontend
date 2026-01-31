"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const LoaderContext = createContext({
    loading: false,
    setLoading: () => { },
});

export const LoaderProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Stop loading on route change completion
        const timer = setTimeout(() => setLoading(false), 500);
        return () => clearTimeout(timer);
    }, [pathname, searchParams]);

    useEffect(() => {
        // Click interceptor for standard links
        const handleAnchorClick = (e) => {
            const anchor = e.target.closest('a');
            if (
                anchor &&
                anchor.href &&
                anchor.target !== '_blank' &&
                !e.ctrlKey &&
                !e.metaKey &&
                !e.shiftKey &&
                !e.altKey
            ) {
                try {
                    const targetUrl = new URL(anchor.href, window.location.origin);
                    const currentUrl = new URL(window.location.href);

                    if (targetUrl.origin !== currentUrl.origin) return;

                    if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
                        setLoading(true);
                    }
                } catch (err) {
                    // Ignore processing errors
                }
            }
        };

        document.addEventListener('click', handleAnchorClick);
        return () => document.removeEventListener('click', handleAnchorClick);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};

export const useLoader = () => useContext(LoaderContext);
