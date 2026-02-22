'use client';
import { Package, ShoppingBag, TrendingUp, Store, ChevronRight } from 'lucide-react';
import useAuthStore from '@/store/useAuthStore';
import Link from 'next/link';
import { useGetRetailerBrands, useGetRetailerProducts } from '@/hooks/useRetailer';
import { useGetOrders } from '@/hooks/useOrder';

export default function RetailerDashboardPage() {
    const { user } = useAuthStore();

    const { data: brandsData, isLoading: brandsLoading } = useGetRetailerBrands();
    const { data: productsData, isLoading: productsLoading } = useGetRetailerProducts({ limit: 1 });
    const { data: ordersData, isLoading: ordersLoading } = useGetOrders({ limit: 1 });

    const brandsList = Array.isArray(brandsData?.data) ? brandsData.data : Array.isArray(brandsData?.data?.data) ? brandsData.data.data : [];
    const productsPagination = productsData?.data?.pagination || productsData?.data?.data?.pagination;
    const ordersPagination = ordersData?.data?.pagination || ordersData?.data?.data?.pagination;

    const stats = [
        {
            label: 'Reselling Brands',
            value: brandsList.length || 0,
            loading: brandsLoading,
            icon: Store,
            color: 'bg-purple-50 text-purple-600',
            href: '/dashboard/retailer/brands',
        },
        {
            label: 'Product Overrides',
            value: productsPagination?.totalItems || 0,
            loading: productsLoading,
            icon: Package,
            color: 'bg-blue-50 text-blue-600',
            href: '/dashboard/retailer/inventory',
        },
        {
            label: 'Total Orders',
            value: ordersPagination?.totalItems || 0,
            loading: ordersLoading,
            icon: ShoppingBag,
            color: 'bg-orange-50 text-orange-600',
            href: '/dashboard/retailer/orders',
        },
        {
            label: 'Total Earnings',
            value: '₹0',
            loading: false,
            icon: TrendingUp,
            color: 'bg-green-50 text-green-600',
            href: '/dashboard/retailer/orders',
        },
    ];

    return (
        <div className="p-6 space-y-8 max-w-7xl mx-auto">
            {/* Welcome */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                        Welcome back, {user?.name?.split(' ')[0] || 'Retailer'} 👋
                    </h1>
                    <p className="text-gray-500 text-sm mt-1">
                        Here&apos;s a look at your store performance and inventory.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/dashboard/retailer/inventory"
                        className="px-4 py-2 bg-[#e09a74] text-white rounded-xl text-sm font-semibold hover:bg-[#d08a64] transition-all shadow-sm"
                    >
                        Manage Inventory
                    </Link>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => (
                    <Link
                        key={stat.label}
                        href={stat.href}
                        className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all flex flex-col gap-4 group"
                    >
                        <div className="flex items-center justify-between">
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color} transition-transform group-hover:scale-110`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-gray-400 group-hover:translate-x-1 transition-all" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                            {stat.loading ? (
                                <div className="h-8 w-16 bg-gray-100 animate-pulse rounded mt-1" />
                            ) : (
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity / Brands */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">Brands You Deal With</h2>
                            <Link href="/dashboard/retailer/brands" className="text-sm font-medium text-[#e09a74] hover:underline">
                                View all
                            </Link>
                        </div>

                        {brandsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-gray-50 animate-pulse rounded-xl" />)}
                            </div>
                        ) : brandsList.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {brandsList.slice(0, 4).map((brand) => (
                                    <div key={brand._id} className="flex items-center gap-4 p-4 rounded-xl border border-gray-50 bg-gray-50/30">
                                        <div className="w-12 h-12 rounded-lg bg-white border border-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                                            {brand.logo ? (
                                                <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
                                            ) : (
                                                <Store className="w-6 h-6 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 truncate">{brand.name}</p>
                                            <p className="text-xs text-gray-500">{brand.productsCount || 0} Products</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <Store className="w-12 h-12 text-gray-100 mx-auto mb-3" />
                                <p className="text-gray-400 text-sm">No brands linked yet.</p>
                                <Link href="/dashboard/retailer/brands" className="text-[#e09a74] text-sm font-medium mt-2 inline-block">
                                    Browse Brands
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-[#1a202c] rounded-2xl p-6 shadow-lg text-white">
                        <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-3">
                            <Link
                                href="/dashboard/retailer/inventory"
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#e09a74] flex items-center justify-center">
                                        <Package className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">Browse Materials</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                            </Link>
                            <Link
                                href="/dashboard/retailer/orders"
                                className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center">
                                        <ShoppingBag className="w-4 h-4 text-white" />
                                    </div>
                                    <span className="text-sm font-medium">My Orders</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
