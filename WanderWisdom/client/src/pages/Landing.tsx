import { useRef, useState, useCallback, useEffect } from "react";
import { useScroll, useSpring, useMotionValueEvent } from "framer-motion";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PopularTrips from "@/components/PopularTrips";
import Testimonials from "@/components/Testimonials";
import HowItWorks from "@/components/HowItWorks";
import Footer from "@/components/Footer";

export default function Landing() {
  const heroSectionRef = useRef<HTMLDivElement>(null);
  const popularTripsRef = useRef<HTMLDivElement>(null);
  
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

  const smoothScrollProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const handlePlaceholderPositionsChange = useCallback((positions: { left: DOMRect[]; right: DOMRect[] }) => {
    setPlaceholderPositions(positions);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection 
          scrollProgress={smoothScrollProgress}
          placeholderPositions={placeholderPositions}
          heroSectionRef={heroSectionRef}
        />
        <PopularTrips 
          scrollProgress={smoothScrollProgress}
          onPlaceholderPositionsChange={handlePlaceholderPositionsChange}
          popularTripsRef={popularTripsRef}
        />
        <Testimonials />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
}
