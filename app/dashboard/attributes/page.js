'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useProductStore } from '@/store/useProductStore';
import useAuthStore from '@/store/useAuthStore';
import AttributeEditModal from '@/components/vendor/AttributeEditModal';
import { Filter, Search, CheckCircle, AlertTriangle } from 'lucide-react';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function AttributesPage() {
    const { user, currentVendorId } = useAuthStore();
    const { products, getProductsWithMissingAttributes, updateProduct } = useProductStore();

    const [items, setItems] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // Separate mock data for demonstration purposes as requested
    const DEMO_INCOMPLETE_PRODUCTS = [
        {
            id: 101,
            name: 'Modern 3-Seater Sofa - Grey',
            categoryPath: 'Furniture > Sofas and armchairs > Sofas',
            vendorId: 2,
            attributes: { color: "Grey" }, // Missing upholstery, seating_capacity
            missingAttributes: ["upholstery", "seating_capacity"]
        },
        {
            id: 102,
            name: 'Interior Wall Primer',
            categoryPath: 'Finishes > Paints > Emulsion',
            vendorId: 2,
            attributes: { volume: "4L" }, // Missing finish, surfaces
            missingAttributes: ["finish", "surfaces"]
        },
        {
            id: 103,
            name: 'Industrial Oak Dining Table',
            categoryPath: 'Furniture > Tables and chairs > Dining tables',
            vendorId: 2,
            attributes: { material: "Solid Wood", shape: "Rectangular" }, // Missing seating_capacity
            missingAttributes: ["seating_capacity"]
        },
        {
            id: 104,
            name: 'Herringbone Oak Flooring',
            categoryPath: 'Flooring > Wood > Engineered Wood',
            vendorId: 2,
            attributes: { thickness: "14mm", finish: "Lacquered" }, // Missing material
            missingAttributes: ["material"]
        },
        {
            id: 105,
            name: 'Carrara Marble Wall Tile',
            categoryPath: 'Construction > Tiles > Wall Tiles',
            vendorId: 2,
            attributes: { size: "300x300mm", material: "Marble" }, // Missing finish, application
            missingAttributes: ["finish", "application"]
        }
    ];

    useEffect(() => {
        // Use demo data directly
        setItems(DEMO_INCOMPLETE_PRODUCTS);
    }, []);

    const handleEdit = (id) => {
        setEditingId(id);
    };

    const handleSave = (id, updates) => {
        updateProduct(id, updates);

        // Optimistic update locally to remove from list or update progress
        setItems(prev => prev.map(item =>
            item.id === id ? { ...item, ...updates } : item
        ).filter(item => {
            // If we want to remove completed items immediately:
            // Check if strictly requires reload or if we can calc specificaitons length
            // For now, let's keep it simple: refetch happens on next render via effect dependency
            return true;
        }));

        // Find next ID
        const currentIndex = items.findIndex(i => i.id === id);
        if (currentIndex !== -1 && currentIndex < items.length - 1) {
            setEditingId(items[currentIndex + 1].id);
        } else {
            setEditingId(null);
        }
    };

    // Filter items
    const filteredItems = items.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalVendorProducts = products.filter(p => p.vendorId === currentVendorId).length;
    // Ensure denominator is at least items.length to avoid > 100% missing (leading to negative completion)
    // In demo mode with mock items, the total might be small in the store, so maxing ensures sanity.
    const effectiveTotal = Math.max(totalVendorProducts, items.length, 1);

    const completionPercentage = items.length === 0
        ? 100
        : Math.max(0, Math.round(100 - (items.length / effectiveTotal) * 100));

    return (
        <Container className="py-6">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-gray-900">Add Missing Attributes</h1>
                <p className="text-gray-500 mt-2">Complete product details to improve search visibility and sales conversions.</p>
            </div>

            {/* PROGRESS */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-8">
                <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-700">Attribute Completion</span>
                    <span className="text-sm font-bold text-green-600">{completionPercentage}% Completed</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-green-600 h-2.5 rounded-full transition-all duration-500"
                        style={{ width: `${completionPercentage}%` }}>
                    </div>
                </div>
            </div>

            {/* FILTERS */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="pl-10 w-full border-gray-300 rounded-lg focus:ring-black focus:border-black py-2 text-gray-900 placeholder:text-gray-500 bg-white"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex flex-col sm:flex-row sm:gap-2 gap-1">
                    <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="h-4 w-4" />
                        Category
                    </Button>
                    <Button variant="outline" className="flex items-center gap-2 w-full sm:w-auto">
                        <Filter className="h-4 w-4" />
                        Missing Fields
                    </Button>
                    {/* Bulk Edit Placeholder */}
                    <Button
                        variant="outline"
                        disabled
                        className="flex items-center gap-2 opacity-50 cursor-not-allowed w-full sm:w-auto"
                    >
                        Bulk Edit (Coming Soon)
                    </Button>
                </div>

            </div>

            {/* LIST */}
            <div className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                {/* Make table horizontally scrollable on small screens */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Missing Attributes</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredItems.length > 0 ? filteredItems.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap max-w-[150px]">
                                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1">
                                            <div className="text-sm font-medium text-gray-900 truncate">{product.name}</div>
                                            <div className="text-sm text-gray-500">ID: {product.id}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                            {product.categoryPath ? product.categoryPath.split(" > ").pop() : 'General'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex flex-wrap gap-1">
                                            {product.missingAttributes?.map(attr => (
                                                <span key={attr} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                    {attr}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(product.id)}
                                            className="text-black hover:text-gray-700 font-semibold"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="4" className="px-6 py-10 text-center text-gray-500">
                                        <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-3" />
                                        <p className="text-lg font-medium text-gray-900">All caught up!</p>
                                        <p>No products with missing attributes found.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>


            {/* MODAL */}
            {editingId && (
                <AttributeEditModal
                    isOpen={!!editingId}
                    onClose={() => setEditingId(null)}
                    product={items.find(i => i.id === editingId)}
                    onSave={handleSave}
                    hasNext={items.findIndex(i => i.id === editingId) < items.length - 1}
                />
            )}

        </Container>
    );
}
