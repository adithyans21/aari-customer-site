import { useRef, useState, useCallback, useEffect } from "react";
import { useScroll, useSpring, useMotionValueEvent, useMotionValue } from "framer-motion";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularTrips from "@/components/PopularTrips";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Landing() {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const popularTripsRef = useRef<HTMLDivElement>(null);
  const isMobileOrTablet = useIsMobileOrTablet();
  
  const [placeholderPositions, setPlaceholderPositions] = useState<{
    left: DOMRect[];
    right: DOMRect[];
  }>({
    left: [],
    right: [],
  });

  const { scrollYProgress } = useScroll({
    target: heroSectionRef,
    offset: ["start start", "end start"],
  });

  // Create a mock MotionValue that always returns 0 for mobile/tablet
  const mockScrollProgress = useMotionValue(0);
  
  // Disable scroll animations on mobile/tablet
  const smoothScrollProgress = isMobileOrTablet 
    ? mockScrollProgress
    : useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001,
      });

  const handlePlaceholderPositionsChange = useCallback((positions: { left: DOMRect[]; right: DOMRect[] }) => {
    setPlaceholderPositions(positions);
  }, []);

  return (
    <div className="min-h-screen bg-background relative">
      <Header />
      <main className="relative">
        <HeroSection 
          scrollProgress={smoothScrollProgress}
          placeholderPositions={placeholderPositions}
          heroSectionRef={heroSectionRef}
          isMobileOrTablet={isMobileOrTablet}
        />
        <PopularTrips 
          scrollProgress={smoothScrollProgress}
          onPlaceholderPositionsChange={handlePlaceholderPositionsChange}
          popularTripsRef={popularTripsRef}
          isMobileOrTablet={isMobileOrTablet}
        />
        <Testimonials />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
