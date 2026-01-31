"use client";

import Button from "@/components/ui/Button";
import { toast } from "@/components/ui/Toast";

export default function OrderSummary({ subtotal, shipping, tax, total }) {
    const handleApplyPromo = (e) => {
        e.preventDefault();
        const promoInput = document.getElementById('promo');
        const promoCode = promoInput?.value?.trim();

        if (!promoCode) {
            toast.warning("Please enter a promo code");
            return;
        }

        // Simulate promo code validation
        if (promoCode.toLowerCase() === "save10") {
            toast.success("Promo code applied successfully!", "10% discount added");
            promoInput.value = "";
        } else {
            toast.error("Invalid promo code", "Please check and try again");
        }
    };

    const handleCheckout = () => {
        toast.info("Redirecting to checkout...", "Please wait");
        // Add checkout logic here
    };

    return (
        <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100 lg:sticky lg:top-24">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>

            <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Shipping</span>
                    <span className="font-semibold">
                        {shipping === 0 ? (
                            <span className="text-green-600">FREE</span>
                        ) : (
                            `$${shipping.toFixed(2)}`
                        )}
                    </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Tax (10%)</span>
                    <span className="font-semibold">${tax.toFixed(2)}</span>
                </div>

                {shipping > 0 && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3 text-xs sm:text-sm text-blue-800">
                        <p className="font-medium">💡 Tip: Spend ${(1000 - subtotal).toFixed(2)} more for FREE shipping!</p>
                    </div>
                )}

                <div className="border-t border-gray-200 pt-3 sm:pt-4">
                    <div className="flex justify-between items-center">
                        <span className="text-base sm:text-lg font-bold text-gray-900">Total</span>
                        <span className="text-2xl sm:text-3xl font-bold text-gray-900">
                            ${total.toFixed(2)}
                        </span>
                    </div>
                </div>
            </div>

            {/* Promo Code */}
            <form onSubmit={handleApplyPromo} className="mb-4 sm:mb-6">
                <label htmlFor="promo" className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
                    Promo Code
                </label>
                <div className="flex gap-2 flex-col">
                    <input
                        type="text"
                        id="promo"
                        placeholder="Enter code"
                        className="flex-1 px-3 sm:px-4 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    />
                    <Button
                        type="submit"
                        className="px-4 sm:px-6 py-2 bg-gray-100 hover:bg-gray-200 text-sm sm:text-base font-medium"
                    >
                        Apply
                    </Button>
                </div>
            </form>

            {/* Checkout Button */}
            <Button
                onClick={handleCheckout}
                className="w-full bg-black text-white py-3 sm:py-4 mb-2 sm:mb-3 text-sm sm:text-base font-semibold hover:bg-gray-800"
            >
                Proceed to Checkout
            </Button>

            <Button
                href="/productlist"
                text={"Continue Shopping"}
                className="w-full border-2 border-black text-black py-3 sm:py-4 text-sm sm:text-base font-semibold hover:bg-black hover:text-white"
            />

            {/* Trust Badges */}
            <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>30-Day Returns</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-gray-600">
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Free Shipping Over $1000</span>
                </div>
            </div>
        </div>
    );
}
