import Header from "@/components/layouts/Header";
import Navbar from "@/components/navbar/navbar";
import HeroSection from "@/components/sections/HeroSection";
import CategoryCarousel from '@/components/sections/CategoryCarousel';
import BentoGrid from "@/components/layouts/BentoGrid/BentoGrid";
import WeeklySelections from "@/components/layouts/WeeklySelections/WeeklySelections";
import InspirationGallery from "@/components/layouts/InspirationGallery/InspirationGallery";
import LeadingBrands from "@/components/sections/LeadingBrands";
import Footer from "@/components/layouts/Footer";
import Container from "@/components/ui/Container";

export default function Page() {
  return (
    <>
      <Header />
      <Navbar />
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
      <Footer />
    </>
  )
}
