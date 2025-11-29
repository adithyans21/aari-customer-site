import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularTrips from "@/components/PopularTrips";
import TripPlanningDemo from "@/components/TripPlanningDemo";
import CabBookingSection from "@/components/CabBookingSection";
import ProfileBuilder from "@/components/ProfileBuilder";
import FeatureHighlights from "@/components/FeatureHighlights";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <PopularTrips />
        {/* todo: remove mock functionality - Plan your trip with aari demo
        <TripPlanningDemo />
        */}
        {/* todo: remove mock functionality - Book your ride instantly demo
        <CabBookingSection />
        */}
        {/* todo: remove mock functionality - Build Your Travel Profile demo
        <ProfileBuilder />
        */}
        {/* todo: remove mock functionality - Why Choose Aari section
        <FeatureHighlights />
        */}
        <Testimonials />
        <HowItWorks />
        {/* todo: remove mock functionality - Final CTA section
        <FinalCTA />
        */}
      </main>
      <Footer />
    </div>
  );
}
