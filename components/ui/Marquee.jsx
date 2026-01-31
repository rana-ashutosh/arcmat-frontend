'use client';

import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export default function Marquee({
    items = [],
    speed = 20,
    direction = 'left',
    className
}) {
    return (
        <div className={clsx("relative flex overflow-hidden user-select-none gap-8 py-4", className)}>
            <motion.div
                className="flex min-w-full shrink-0 items-center justify-around gap-8"
                animate={{
                    x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
                }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {items.map((item, idx) => (
                    <span key={`1-${idx}`} className="whitespace-nowrap">
                        {item}
                    </span>
                ))}
            </motion.div>

            <motion.div
                className="flex min-w-full shrink-0 items-center justify-around gap-8"
                animate={{
                    x: direction === 'left' ? ['0%', '-100%'] : ['-100%', '0%'],
                }}
                transition={{
                    duration: speed,
                    ease: "linear",
                    repeat: Infinity,
                }}
            >
                {items.map((item, idx) => (
                    <span key={`2-${idx}`} className="whitespace-nowrap">
                        {item}
                    </span>
                ))}
            </motion.div>
        </div>
    );
}
