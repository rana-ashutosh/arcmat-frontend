// app/dashboard/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import clsx from 'clsx';
import useAuthStore from '@/store/useAuthStore';
import Container from '@/components/ui/Container';

const SEARCH_CATEGORIES = [
    { id: 'tiles', label: 'Tiles' },
    { id: 'paints', label: 'Paints' },
    { id: 'textiles', label: 'Textiles' },
    { id: 'wallpaper', label: 'Wallpaper' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'laminate', label: 'Laminate' },
    { id: 'paneling', label: 'Paneling' },
    { id: 'acoustics', label: 'Acoustics' },
    { id: 'leathers', label: 'Leathers' },
];

const MOCK_BOARDS = [
    {
        id: 1,
        title: 'Interior Design',
        items: 4,
        author: 'Vidit Thapa', // Default fallback
        thumbnail: '/Images/Hospitality.jpg', // Ensure file exists at public/dashboard/dash2.png
    },
    {
        id: 2,
        title: 'Office Design',
        items: 1,
        author: 'Vidit Thapa', // Default fallback
        thumbnail: '/Images/Workspaces.png', // Ensure file exists at public/dashboard/dash1.png
    },
];

export default function DashboardPage() {
    const router = useRouter();
    const [activeFilter, setActiveFilter] = useState('all');
    const [selectedProject, setSelectedProject] = useState('Project Alpha');
    const [showProjectMenu, setShowProjectMenu] = useState(false);

    // ZUSTAND INTEGRATION
    const { user } = useAuthStore();
    const [mounted, setMounted] = useState(false);

    // Handle Redirection based on user role
    // useEffect(() => {
    //     setMounted(true);
    //     if (user?.role === 'vendor') {
    //         router.push('/dashboard/products-list');
    //     } else if (user?.role === 'customer' || user?.role === 'user') {
    //         router.push('/dashboard/products-list');
    //     }
    // }, [user, router]);

    // Helper to get First Name safely
    const getFirstName = () => {
        if (!user?.fullName) return 'User';
        return user.fullName.split(' ')[0];
    };

    // Dynamically update board author based on logged-in user
    const recentBoards = MOCK_BOARDS.map(board => ({
        ...board,
        author: mounted && user?.fullName ? user.fullName : board.author
    }));

    // While redirecting or mounting, show a loading state or nothing
    if (!mounted || user?.role) {
        return (
            <div className="flex-1 flex items-center justify-center bg-gray-50 min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#d9a88a]"></div>
            </div>
        );
    }

    return (
        <Container className="py-8">

            {/* Welcome Header */}
            <div className="text-center mb-12">

                {/* Filter Buttons */}
                <div className="flex w-full sm:w-auto items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
                    <button
                        onClick={() => setActiveFilter('all')}
                        className={clsx(
                            'flex-1 sm:flex-none px-4 py-2.5 sm:px-10 sm:py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                            activeFilter === 'all'
                                ? 'bg-[#d9a88a] text-white shadow-md hover:shadow-lg'
                                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300'
                        )}
                    >
                        See All
                    </button>

                    <button
                        onClick={() => setActiveFilter('new')}
                        className={clsx(
                            'flex-1 sm:flex-none px-4 py-2.5 sm:px-10 sm:py-3 rounded-full text-sm font-medium transition-all duration-200 whitespace-nowrap',
                            activeFilter === 'new'
                                ? 'bg-[#d9a88a] text-white shadow-md hover:bg-[#c89675] hover:shadow-lg'
                                : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
                        )}
                    >
                        See New
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* LEFT COLUMN: Current Project & Search */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 h-full flex flex-col">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                        Current Project
                    </h2>

                    {/* Project Selector */}
                    <div className="mb-6 relative">
                        <button
                            onClick={() => setShowProjectMenu(!showProjectMenu)}
                            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
                        >
                            <span className="font-medium">{selectedProject}</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {showProjectMenu && (
                            <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-[200px]">
                                <button
                                    onClick={() => { setSelectedProject('Project Alpha'); setShowProjectMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:text-[#d9a88a] text-sm"
                                >
                                    Project Alpha
                                </button>
                                <button
                                    onClick={() => { setSelectedProject('Project Beta'); setShowProjectMenu(false); }}
                                    className="w-full text-left px-4 py-2 text-gray-700 hover:text-[#d9a88a] text-sm"
                                >
                                    Project Beta
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Search Categories */}
                    <div className="space-y-4 mt-auto">
                        <p className="text-sm text-gray-500">Search For :</p>
                        <div className="grid grid-cols-2 gap-3">
                            {SEARCH_CATEGORIES.map((category) => (
                                <button
                                    key={category.id}
                                    className="group gap-1 px-2 py-2 text-[#d9a88a] rounded-full text-sm font-medium hover:bg-[#d9a88a] transition-colors inline-flex items-center justify-center border border-[#d9a88a]/30"
                                >
                                    <svg className="w-4 h-4 text-[#d9a88a] group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span className="text-sm text-gray-700 font-medium group-hover:text-white">
                                        {category.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* RIGHT COLUMN: Recent Boards */}
                <div className="bg-white rounded-2xl p-6 border border-gray-200 h-full">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">
                            Recent Boards
                        </h2>
                        <Link
                            href="/dashboard/boards"
                            className="text-sm text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1"
                        >
                            All Boards
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>

                    {/* Boards Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        {recentBoards.map((board) => (
                            <Link
                                key={board.id}
                                href={`/dashboard/boards/${board.id}`}
                                className="group"
                            >
                                {/* Board Thumbnail Image */}
                                <div className="relative aspect-4/3 bg-gray-100 rounded-xl overflow-hidden mb-3">
                                    {board.thumbnail ? (
                                        <Image
                                            src={board.thumbnail}
                                            alt={board.title}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        // Fallback Icon if image fails
                                        <div className="w-full h-full flex items-center justify-center">
                                            <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                                </div>

                                {/* Board Details */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-800 group-hover:text-[#d9a88a] transition-colors mb-1">
                                        {board.title}
                                    </h3>
                                    <p className="text-xs text-gray-500">
                                        {board.items} items · {board.author}
                                    </p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        </Container>
    );
}