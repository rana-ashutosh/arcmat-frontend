// components/ui/Logo.jsx
"use client";

import Link from "next/link";
import Image from "next/image";
import logoImg from "../../public/Icons/arcmatlogo.svg";

export default function Logo({ className = "" }) {
  return (
    <Link href="/" className={className}>
      <Image
        src={logoImg}
        alt="Logo"
        className="h-8 w-auto object-contain"
        priority
      />
    </Link>
  );
}