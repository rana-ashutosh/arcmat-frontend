import Link from "next/link";
import Image from "next/image";

const WeeklySelectionCard = ({ brand, image, title, description, link, logo, onViewMore }) => {
    const targetLink = link || "/not-found";

    return (
        <Link
            href={targetLink}
            onClick={onViewMore}
            className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:translate-y-[-4px] cursor-pointer border border-gray-100"
        >
            <div className="h-20 flex items-center justify-center p-4 bg-white relative z-10">
                {logo ? (
                    <div className="relative w-32 h-10">
                        <Image
                            src={logo}
                            alt={brand || title}
                            fill
                            className="object-contain"
                        />
                    </div>
                ) : (
                    <span className="text-sm font-semibold text-gray-400">{brand}</span>
                )}
            </div>

            <div className="relative w-full aspect-[4/3] bg-gray-50 overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
            </div>

            {/* <div className="p-4 text-center bg-white">
                <h3 className="text-gray-900 font-medium text-sm sm:text-base tracking-wide">
                    {title}
                </h3>
            </div> */}
        </Link>
    );
};

export default WeeklySelectionCard;