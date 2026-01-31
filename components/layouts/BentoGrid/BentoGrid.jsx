'use client';

import Image from 'next/image';
import items from './data.json';
import Container from '@/components/ui/Container';
import { toast } from '@/components/ui/Toast';

const BentoGrid = () => {
    return (
        <Container>
            <div className="w-full max-w-[1440px] mx-auto py-10">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 auto-rows-[300px] md:auto-rows-[400px]">
                    {items.map((item, index) => (
                        <div
                            key={index}
                            className={`relative group overflow-hidden rounded-2xl ${item.className || ''}`}
                            onClick={() => toast.info(`Coming Soon`)}
                        >
                            <div className="absolute inset-0 w-full h-full">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px)"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                            </div>

                            <div className="absolute inset-0 p-6 flex flex-col justify-center items-start text-white">
                                <h3 className="text-2xl md:text-3xl font-bold mb-2 drop-shadow-md">
                                    {item.title}
                                </h3>
                                {item.subtitle && (
                                    <p className="text-sm md:text-base text-gray-200 drop-shadow-sm max-w-[80%]">
                                        {item.subtitle}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Container>
    );
};

export default BentoGrid;
