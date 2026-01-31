
import Header from "@/components/layouts/Header";
import Navbar from "@/components/navbar/navbar";
import Footer from "@/components/layouts/Footer";
import HeroSection from "@/components/InspirationGalleryPage/HeroSection";
import InspirationGalleryPage from "@/components/InspirationGalleryPage/InspirationGalleryPage";
export default function Inspiration() {
    return (
        <>
            <Header />
            <Navbar />
            <HeroSection />
            <InspirationGalleryPage />
            <Footer />
        </>
    )
}
