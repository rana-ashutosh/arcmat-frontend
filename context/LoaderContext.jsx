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
        const handleAnchorClick = (e) => {
            const anchor = e.target.closest('a');
            if (!anchor || !anchor.href) return;

            const isDownload = anchor.hasAttribute('download');
            const isExternal = anchor.target === '_blank' || (anchor.href && !anchor.href.startsWith(window.location.origin));
            const isFile = /\.(pdf|zip|csv|doc|docx|xls|xlsx|png|jpg|jpeg|svg)$/i.test(anchor.href);
            const isModifiedClick = e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;

            if (isDownload || isExternal || isFile || isModifiedClick) {
                return;
            }

            try {
                const targetUrl = new URL(anchor.href, window.location.origin);
                const currentUrl = new URL(window.location.href);

                if (targetUrl.pathname !== currentUrl.pathname || targetUrl.search !== currentUrl.search) {
                    setLoading(true);
                }
            } catch (err) {
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
