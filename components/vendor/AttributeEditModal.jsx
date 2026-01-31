'use client';

import { useState, useEffect } from 'react';
import { X, ChevronRight, Check } from 'lucide-react';
import { useProductStore } from '@/store/useProductStore';
import { getAttributeSchema } from '@/lib/attributeSchema';
import Button from '@/components/ui/Button';

export default function AttributeEditModal({ isOpen, onClose, product, onSave, hasNext }) {
    const [formData, setFormData] = useState({});
    const [schema, setSchema] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (product) {
            // Determine category name for schema lookup
            // New logic: try categoryPath -> name -> fallback
            const categoryIdentifier = product.categoryPath || product.name;
            const productSchema = getAttributeSchema(categoryIdentifier);
            setSchema(productSchema);

            // Initialize form with existing attributes
            const initialData = {};
            productSchema.forEach(field => {
                initialData[field.name] = product.attributes?.[field.name] || '';
            });
            setFormData(initialData);
        }
    }, [product]);

    if (!isOpen || !product) return null;

    const handleChange = (name, value) => {
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async (shouldClose = true) => {
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 500));

        // Merge new attributes into existing attributes
        const updatedAttributes = {
            ...product.attributes,
            ...formData
        };

        onSave(product.id, { attributes: updatedAttributes });
        setLoading(false);

        if (shouldClose) {
            onClose();
        }
    };

    const handleSaveAndNext = () => {
        handleSave(false);
        // The parent component should handle moving to the next product
    };

    return (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex-1">
                            <h2 className="text-xl font-bold text-gray-900">
                                Edit Attributes
                            </h2>
                            <p className="mt-1 text-sm text-gray-500">
                                {product.name}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 transition-colors ml-4"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Dynamic Form Fields */}
                    <div className="space-y-6">
                        {schema.map((field) => (
                            <div key={field.name} className="space-y-1">
                                <label htmlFor={field.name} className="block text-sm font-medium text-gray-700">
                                    {field.label} {field.required && <span className="text-red-500">*</span>}
                                </label>

                                <div className="relative rounded-lg shadow-sm">
                                    {field.type === 'select' ? (
                                        <select
                                            id={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-shadow bg-white text-gray-900"
                                        >
                                            <option value="">Select {field.label}</option>
                                            {field.options?.map(opt => (
                                                <option key={opt} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id={field.name}
                                            value={formData[field.name] || ''}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-black sm:text-sm transition-shadow bg-white text-gray-900 placeholder:text-gray-400"
                                            placeholder={field.suggestions ? `e.g. ${field.suggestions[0]}` : ''}
                                        />
                                    )}
                                </div>

                                {/* Suggestions Chips */}
                                {field.suggestions && (
                                    <div className="flex flex-wrap gap-2 pt-1">
                                        {field.suggestions.map(s => (
                                            <button
                                                key={s}
                                                type="button"
                                                onClick={() => handleChange(field.name, s)}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-105 transition-all"
                                            >
                                                {s}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Footer Actions */}
                    <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row-reverse gap-3">
                        {hasNext ? (
                            <Button
                                onClick={handleSaveAndNext}
                                disabled={loading}
                                className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full hover:bg-zinc-800"
                            >
                                {loading ? 'Saving...' : 'Save & Next'}
                                {!loading && <ChevronRight className="ml-2 h-4 w-4 inline" />}
                            </Button>
                        ) : (
                            <Button
                                onClick={() => handleSave(true)}
                                disabled={loading}
                                className="w-full sm:w-auto bg-black text-white px-6 py-3 rounded-full hover:bg-zinc-800"
                            >
                                {loading ? 'Saving...' : 'Save & Finish'}
                                {!loading && <Check className="ml-2 h-4 w-4 inline" />}
                            </Button>
                        )}

                        <Button
                            onClick={onClose}
                            variant="outline"
                            className="w-full sm:w-auto px-6 py-3 rounded-full border border-gray-300 text-gray-700 hover:bg-gray-50"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}