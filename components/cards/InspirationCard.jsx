import Link from "next/link";
import Image from "next/image";
import { Share2 } from "lucide-react"; // 1. Import the icon

const InspirationCard = ({ company, image, description, link, onViewMore }) => {
    const targetLink = link || "/not-found";

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl hover:translate-y-[-4px] transition-transform duration-500 transition-shadow duration-300 border border-gray-100 flex flex-col h-full">

            {/* Header: Company Name & Share Button */}
            <div className="p-4 flex justify-between items-start">
                <span className="font-bold text-[#d69e76] text-lg">{company}</span>
                <button className="text-gray-400 hover:text-gray-600 transition-colors">
                    {/* 2. Use the Lucide Icon here instead of Image */}
                    <Share2 size={20} className="w-5 h-5" />
                </button>
            </div>

            {/* Main Image */}
            <div className="relative w-full h-64 bg-gray-100 group overflow-hidden mx-4 rounded-lg self-center" style={{ width: 'calc(100% - 2rem)' }}>
                <Image
                    src={image}
                    alt={description}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>

            {/* Content: Description & CTA */}
            <div className="p-4 flex flex-col flex-grow">
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

                <div className="mt-auto">
                    <Link
                        href={targetLink}
                        onClick={onViewMore}
                        className="inline-block px-5 py-1.5 border border-[#d2b48c] text-[#a08050] text-xs font-medium rounded-full hover:bg-[#d2b48c] hover:text-white transition-colors duration-300 uppercase tracking-wide"
                    >
                        View More
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default InspirationCard;