import { Trash2, Plus, Minus } from "lucide-react";

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Product Image */}
                <div className="shrink-0">
                    <div className="w-full sm:w-32 h-48 sm:h-32 rounded-xl overflow-hidden bg-gray-100">
                        <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                    </div>
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-2">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1">
                                {item.name}
                            </h3>
                            <div className="flex flex-wrap gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                                <span>Color: {item.color}</span>
                                <span className="text-gray-300">|</span>
                                <span>Size: {item.size}</span>
                            </div>
                        </div>
                        <button
                            onClick={() => onRemove(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg shrink-0"
                            aria-label="Remove item"
                        >
                            <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                    </div>

                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                            <span className="text-xs sm:text-sm text-gray-600 font-medium">Quantity:</span>
                            <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Decrease quantity"
                                >
                                    <Minus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                                <span className="px-3 sm:px-4 py-2 min-w-12 text-center font-semibold text-sm sm:text-base">
                                    {item.quantity}
                                </span>
                                <button
                                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                                    className="p-2 hover:bg-gray-100 transition-colors"
                                    aria-label="Increase quantity"
                                >
                                    <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Price */}
                        <div className="text-left sm:text-right">
                            <p className="text-xl sm:text-2xl font-bold text-gray-900">
                                ${(item.price * item.quantity).toFixed(2)}
                            </p>
                            {item.quantity > 1 && (
                                <p className="text-xs sm:text-sm text-gray-500">
                                    ${item.price.toFixed(2)} each
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
