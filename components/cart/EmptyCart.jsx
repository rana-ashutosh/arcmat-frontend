import { ShoppingBag } from "lucide-react";
import Button from "@/components/ui/Button";

export default function EmptyCart() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center bg-gradient-to-b from-white to-gray-50">
            <div className="text-center px-4">
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-6">
                    <ShoppingBag className="w-12 h-12 text-gray-400" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    Looks like you haven't added any items to your cart yet. Start shopping to find amazing products!
                </p>
                <Button
                    href="/productlist"
                    className="bg-black text-white px-8 py-4 hover:bg-gray-800 font-semibold"
                >
                    Continue Shopping
                </Button>
            </div>
        </div>
    );
}
