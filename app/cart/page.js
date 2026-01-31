"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Container from "@/components/ui/Container";
import BackLink from "@/components/ui/BackLink";
import EmptyCart from "@/components/cart/EmptyCart";
import CartItem from "@/components/cart/CartItem";
import OrderSummary from "@/components/cart/OrderSummary";

export default function CartPage() {
    const [cartItems, setCartItems] = useState([
        {
            id: 1,
            name: "Modern Minimalist Chair",
            price: 299.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=400&h=400&fit=crop",
            color: "Charcoal Gray",
            size: "Standard"
        },
        {
            id: 2,
            name: "Scandinavian Oak Table",
            price: 799.99,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1533090368676-1fd25485db88?w=400&h=400&fit=crop",
            color: "Natural Oak",
            size: "Large"
        },
        {
            id: 3,
            name: "Velvet Accent Sofa",
            price: 1299.99,
            quantity: 2,
            image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
            color: "Navy Blue",
            size: "3-Seater"
        }
    ]);

    const updateQuantity = (id, newQuantity) => {
        if (newQuantity < 1) return;
        setCartItems(cartItems.map(item =>
            item.id === id ? { ...item, quantity: newQuantity } : item
        ));
    };

    const removeItem = (id) => {
        setCartItems(cartItems.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 1000 ? 0 : 49.99;
    const tax = subtotal * 0.1;
    const total = subtotal + shipping + tax;

    if (cartItems.length === 0) {
        return <EmptyCart />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 py-6 sm:py-12">
            <Container>
                {/* Header */}
                <div className="mb-6 sm:mb-8">
                    <BackLink
                        href="/productlist"
                        label="Continue Shopping"
                        className="mb-3 sm:mb-4"
                    />
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900">Shopping Cart</h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">{cartItems.length} items in your cart</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                        {cartItems.map((item) => (
                            <CartItem
                                key={item.id}
                                item={item}
                                onUpdateQuantity={updateQuantity}
                                onRemove={removeItem}
                            />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <OrderSummary
                            subtotal={subtotal}
                            shipping={shipping}
                            tax={tax}
                            total={total}
                        />
                    </div>
                </div>
            </Container>
        </div>
    );
}
