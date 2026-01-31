import React from 'react';
import { Layers, Package, AlertCircle } from 'lucide-react';

export default function CategoryStats({ stats }) {
    const { totalCategories, totalProducts, incompleteProducts } = stats;

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Categories */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Layers className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Categories</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalCategories}</h3>
                </div>
            </div>

            {/* Total Products */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
                </div>
            </div>

            {/* Needs Attention */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex items-center space-x-4 hover:shadow-md transition-shadow">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                    <AlertCircle className="w-6 h-6" />
                </div>
                <div>
                    <p className="text-sm text-gray-500 font-medium">Incomplete Products</p>
                    <h3 className="text-2xl font-bold text-gray-900">{incompleteProducts}</h3>
                    <p className="text-xs text-amber-600 mt-1">Needs attention</p>
                </div>
            </div>
        </div>
    );
}