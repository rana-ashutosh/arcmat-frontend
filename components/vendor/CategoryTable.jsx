'use client';

import React from 'react';
import Link from 'next/link';
import { Eye, Edit3, AlertTriangle, CheckCircle } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function CategoryTable({ categories }) {
    if (!categories || categories.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                <p className="text-gray-500 mb-4">No categories found matching your search.</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left border-collapse">
                        <thead className="bg-gray-50 border-b border-gray-100 hidden sm:table-header-group">
                            <tr>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category Name</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Total Products</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Status</th>
                                <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {categories.map((cat) => (
                                <tr key={cat.categoryId} className="hover:bg-gray-50/50 transition-colors sm:table-row flex flex-col sm:flex-row border-b sm:border-none">

                                    {/* Category Name */}
                                    <td className="py-4 px-6 sm:px-6 sm:py-4 flex justify-between sm:table-cell">
                                        <div className="flex flex-col">
                                            <span className="font-medium text-gray-900">{cat.name}</span>
                                            <span className="text-xs text-gray-400">{cat.path}</span>
                                        </div>
                                    </td>

                                    {/* Total Products */}
                                    <td className="py-2 px-6 sm:px-6 sm:py-4 text-center sm:text-center">
                                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 px-2.5 py-0.5 rounded-full text-xs font-medium">
                                            {cat.totalProducts}
                                        </span>
                                    </td>

                                    {/* Status */}
                                    <td className="py-2 px-6 sm:px-6 sm:py-4 text-center sm:text-center mt-2 sm:mt-0">
                                        {cat.incompleteProducts > 0 ? (
                                            <span className="inline-flex items-center space-x-1 text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                                <AlertTriangle className="w-3 h-3" />
                                                <span>{cat.incompleteProducts} Incomplete</span>
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center space-x-1 text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full text-xs font-medium">
                                                <CheckCircle className="w-3 h-3" />
                                                <span>All Complete</span>
                                            </span>
                                        )}
                                    </td>

                                    {/* Actions */}
                                    <td className="py-2 px-6 sm:px-6 sm:py-4 text-right sm:text-right mt-2 sm:mt-0 flex space-x-2 justify-end">
                                        <Button
                                            href={`/dashboard/products-list?category=${cat.categoryId}`}
                                            className="px-3 py-1.5 border border-gray-200 shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50"
                                            variant="solid"
                                            text="View"
                                        >
                                            <Eye className="w-3 h-3 mr-1.5" />

                                        </Button>

                                        {cat.incompleteProducts > 0 && (
                                            <Button
                                                href={`/dashboard/attributes?category=${cat.categoryId}`}
                                                className="px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700"
                                                variant="solid"
                                                text="Fix"
                                            >
                                                <Edit3 className="w-3 h-3 mr-1.5" />

                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}