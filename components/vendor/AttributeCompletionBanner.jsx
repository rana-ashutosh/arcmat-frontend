'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import useAuthStore from '@/store/useAuthStore';

export default function AttributeCompletionBanner() {
    const { user } = useAuthStore();
    const { getProductsWithMissingAttributes } = useProductStore();
    const [missingCount, setMissingCount] = useState(0);

    useEffect(() => {
        if (user?.id) {
            const incompleteProducts = getProductsWithMissingAttributes(user.id);
            setMissingCount(incompleteProducts.length);
        }
    }, [user, getProductsWithMissingAttributes]);

    if (missingCount === 0) return null;

    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex items-center">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mr-3" />
                    <div>
                        <h3 className="text-sm font-medium text-yellow-800">
                            {missingCount} products have missing attributes
                        </h3>
                        <div className="mt-1 text-sm text-yellow-700">
                            Complete product details to improve search visibility and sales.
                        </div>
                    </div>
                </div>
                <div className="flex items-center space-x-3">
                    <Link
                        href="/dashboard/attributes"
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                    >
                        Complete Now
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <button
                        onClick={() => setMissingCount(0)} // Temporary dismiss for session
                        className="text-sm text-yellow-600 hover:text-yellow-800 underline"
                    >
                        Later
                    </button>
                </div>
            </div>
        </div>
    );
}