"use client"
import React from 'react'
import Link from 'next/link'
import navbarItems from "./Items.json"
import Container from '@/components/ui/Container';

const Navbar = () => {
    


    return (
        <Container>
            <nav className="relative hidden xl:block">
                <div className="flex justify-between items-center py-4 xl:justify-center">

                    <ul className="hidden xl:flex w-full justify-between text-[16px] font-semibold text-[#4D4E58]">
                        {navbarItems.map((item) => (
                            <li key={item.id}
                                className={`cursor-pointer whitespace-nowrap hover:text-gray-500 ${item.highlight ? "text-orange-500 text-xl hover:text-orange-700" : ""}`}>
                                <Link href="/not-found">
                                    {item.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>
        </Container>
    )
}

export default Navbar
