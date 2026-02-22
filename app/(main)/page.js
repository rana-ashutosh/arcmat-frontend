import HeroSection from "@/components/sections/HeroSection";
import CategoryCarousel from '@/components/sections/CategoryCarousel';
import BentoGrid from "@/components/layouts/BentoGrid/BentoGrid";
import dynamic from "next/dynamic";
import Container from "@/components/ui/Container";

const WeeklySelections = dynamic(() => import("@/components/layouts/WeeklySelections/WeeklySelections"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-2xl mx-4 my-10" />
});
const InspirationGallery = dynamic(() => import("@/components/layouts/InspirationGallery/InspirationGallery"), {
  loading: () => <div className="h-96 animate-pulse bg-gray-100 rounded-2xl mx-4 my-10" />
});
const LeadingBrands = dynamic(() => import("@/components/sections/LeadingBrands"), {
  loading: () => <div className="h-40 animate-pulse bg-gray-100 rounded-2xl mx-4 my-10" />
});

export default function Page() {
  return (
    <>
      <HeroSection />
      <div className="w-full py-14 bg-white">
        <Container>
          <div className="flex flex-col gap-5 text-center items-center justify-center">
            <div className='w-full'>
              <h2 className="text-2xl sm:text-3xl lg:text-[38px] font-semibold text-gray-700 xl:whitespace-nowrap">
                Design Smarter, Source Better.
              </h2>
            </div>
            <div className='lg:px-20'>
              <p className="text-base sm:text-lg lg:text-[23px] font-normal text-gray-600">
                Shop multiple categories from one trusted platform.
              </p>
            </div>
          </div>
        </Container>
        <CategoryCarousel />
        <BentoGrid />
        <WeeklySelections />
        <InspirationGallery />
        <LeadingBrands />
      </div>
    </>
  )
}
