import { useRef, useEffect, useState, useMemo, useLayoutEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, MessageCircle, Star, Quote } from "lucide-react";
import { motion, useTransform, MotionValue, useMotionValueEvent, useScroll } from "framer-motion";
import heroImage from "@assets/generated_images/kodaikanal_landscape_sunset_view.png";
import AariLogo from "./AariLogo";
import { popularTrips, reviews } from "@shared/trips";

interface HeroCard {
  id: number;
  title: string;
  location: string;
  price: number;
  rating: number;
  image: string;
  category: string;
  type: string;
  side: "left" | "right";
  position: {
    top: string;
    left?: string;
    right?: string;
    rotation: number;
  };
  delay: number;
  heroIdx: number;
}

const getHeroCards = (): HeroCard[] => {
  return [
    {
      ...popularTrips[0],
      type: "trip",
      side: "left" as const,
      position: { top: "30%", left: "2%", rotation: -5 },
      delay: 0,
      heroIdx: 0,
    },
    {
      ...popularTrips[1],
      type: "trip",
      side: "right" as const,
      position: { top: "30%", right: "2%", rotation: 5 },
      delay: 0.15,
      heroIdx: 1,
    },
  ];
};

interface AnimatedHeroCardProps {
  card: HeroCard;
  scrollProgress: MotionValue<number>;
  placeholderPositions: { left: DOMRect[]; right: DOMRect[] };
}

function AnimatedHeroCard({ card, scrollProgress, placeholderPositions }: AnimatedHeroCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [initialPagePos, setInitialPagePos] = useState<{ x: number; y: number; width: number; height: number } | null>(null);
  const [hasEnteredView, setHasEnteredView] = useState(false);
  const [animationPhase, setAnimationPhase] = useState<'hero' | 'animating' | 'docked'>('hero');
  
  const { scrollY } = useScroll();
  
  const sideIndex = 0;
  const sidePositions = placeholderPositions[card.side] || [];
  const targetPlaceholder = sidePositions[sideIndex] || null;

  useLayoutEffect(() => {
    const capturePosition = () => {
      if (cardRef.current && hasEnteredView) {
        const rect = cardRef.current.getBoundingClientRect();
        setInitialPagePos({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      }
    };
    
    const timer = setTimeout(capturePosition, 900 + card.delay * 200);
    
    return () => clearTimeout(timer);
  }, [hasEnteredView, card.delay]);

  useEffect(() => {
    const recaptureOnResize = () => {
      if (cardRef.current && hasEnteredView && window.scrollY < 100) {
        const rect = cardRef.current.getBoundingClientRect();
        setInitialPagePos({
          x: rect.left + window.scrollX,
          y: rect.top + window.scrollY,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    window.addEventListener('resize', recaptureOnResize);
    return () => window.removeEventListener('resize', recaptureOnResize);
  }, [hasEnteredView]);

  const animationStart = 0.1 + card.heroIdx * 0.05;
  const animationEnd = 0.5 + card.heroIdx * 0.05;

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    const hasRequiredData = !!initialPagePos && !!targetPlaceholder;
    
    if (!hasRequiredData) {
      if (animationPhase !== 'hero') setAnimationPhase('hero');
      return;
    }
    
    if (latest < animationStart) {
      if (animationPhase !== 'hero') setAnimationPhase('hero');
    } else if (latest >= animationStart && latest < animationEnd) {
      if (animationPhase !== 'animating') setAnimationPhase('animating');
    } else {
      if (animationPhase !== 'docked') setAnimationPhase('docked');
    }
  });

  const hasValidPositions = initialPagePos && targetPlaceholder && targetPlaceholder.width > 0;

  const deltaX = hasValidPositions ? targetPlaceholder.left - initialPagePos.x : 0;
  const deltaY = hasValidPositions ? targetPlaceholder.top - initialPagePos.y : 0;

  // IMPORTANT: All hooks must be declared before any early returns to maintain hook order consistency
  const translateX = useTransform(
    scrollProgress,
    [0, animationStart, animationEnd, 1],
    [0, 0, deltaX, deltaX]
  );

  const translateY = useTransform(
    scrollProgress,
    [0, animationStart, animationEnd, 1],
    [0, 0, deltaY, deltaY]
  );

  const scale = useTransform(
    scrollProgress,
    [0, animationStart, animationEnd, 1],
    [1, 1, 1, 1]
  );

  const rotateZ = useTransform(
    scrollProgress,
    [0, animationStart, animationEnd],
    [card.position.rotation, card.position.rotation, card.position.rotation * -1.08]
  );


  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, scale: 0.6, y: 40, rotate: 0, x: card.side === "left" ? -100 : 100 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0, 
        rotate: card.position.rotation, 
        x: 0
      }}
      transition={!hasEnteredView ? { delay: card.delay, duration: 0.7, ease: "easeOut", type: "spring", stiffness: 100 } : {}}
      onAnimationComplete={() => !hasEnteredView && setHasEnteredView(true)}
      className="absolute hidden lg:block z-20 pointer-events-none"
      style={{
        top: card.position.top,
        left: "left" in card.position ? card.position.left : undefined,
        right: "right" in card.position ? card.position.right : undefined,
        x: hasEnteredView ? translateX : 0,
        y: hasEnteredView ? translateY : 0,
        scale: hasEnteredView ? scale : 1,
        rotateZ: hasEnteredView ? rotateZ : 0,
        opacity: 1,
      }}
      data-testid={`card-hero-${card.heroIdx}`}
    >
      <CardContent card={card} />
    </motion.div>
  );
}

function CardContent({ card }: { card: HeroCard }) {
  return (
    <motion.div 
      className="pointer-events-auto"
    >
      <div className="bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all w-72 h-56 cursor-pointer flex flex-col">
        <div className="relative h-32 overflow-hidden">
          <img 
            src={card.image}
            alt={card.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge 
            variant="secondary" 
            className="absolute top-1 left-1 bg-white/90 text-gray-800 text-xs"
          >
            {card.category}
          </Badge>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm line-clamp-1">{card.title}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-2.5 h-2.5" />
              {card.location}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-900">{card.rating}</span>
            </div>
            <span className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ₹{card.price}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface HeroSectionProps {
  scrollProgress: MotionValue<number>;
  placeholderPositions: { left: DOMRect[]; right: DOMRect[] };
  heroSectionRef: React.RefObject<HTMLDivElement>;
}

export default function HeroSection({ scrollProgress, placeholderPositions, heroSectionRef }: HeroSectionProps) {
  const heroCards = useMemo(() => getHeroCards(), []);

  const reviewCardsOpacity = useTransform(
    scrollProgress,
    [0, 0.08, 0.15],
    [1, 1, 0]
  );

  return (
    <section ref={heroSectionRef} className="relative min-h-screen flex items-center justify-center overflow-visible">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 via-transparent to-purple-900/20" />
      
      {heroCards.map((card) => (
        <AnimatedHeroCard
          key={`${card.id}-${card.side}`}
          card={card}
          scrollProgress={scrollProgress}
          placeholderPositions={placeholderPositions}
        />
      ))}

      {/* Review Cards */}
      <motion.div className="absolute hidden lg:flex gap-8 left-1/2 -translate-x-1/2 pointer-events-none z-30" style={{ top: "15%", width: "1150px", justifyContent: "space-between", opacity: reviewCardsOpacity }}>
        {/* Left Review */}
        {reviews[0] && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.6, y: 40, x: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease: "easeOut", type: "spring", stiffness: 100 }}
            style={{ rotate: 3 }}
            className="w-72 h-28 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg border-2 border-purple-500 flex flex-col justify-between pointer-events-auto relative"
          >
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              ⭐ Top Review
            </div>
            <div>
              <Quote className="w-4 h-4 text-purple-500 mb-2" />
              <p className="text-xs text-gray-700 italic line-clamp-2">{reviews[0].quote}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{reviews[0].author}</span>
              <div className="flex gap-0.5">
                {[...Array(reviews[0].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Review */}
        {reviews[1] && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.6, y: 40, x: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 0.8, ease: "easeOut", type: "spring", stiffness: 100 }}
            style={{ rotate: -3 }}
            className="w-72 h-28 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg border border-purple-200 flex flex-col justify-between pointer-events-auto"
          >
            <div>
              <Quote className="w-4 h-4 text-purple-500 mb-2" />
              <p className="text-xs text-gray-700 italic line-clamp-2">{reviews[1].quote}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{reviews[1].author}</span>
              <div className="flex gap-0.5">
                {[...Array(reviews[1].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Overlapping Review Cards */}
      <motion.div className="absolute hidden lg:flex gap-8 left-1/2 -translate-x-1/2 justify-between pointer-events-none z-30" style={{ top: "48%", width: "1400px", opacity: reviewCardsOpacity }}>
        {/* Left Overlapping Review */}
        {reviews[2] && (
          <motion.div 
            initial={{ opacity: 0, rotate: 5, scale: 0.6, y: 40, x: -50 }}
            animate={{ opacity: 1, rotate: 5, scale: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: "easeOut", type: "spring", stiffness: 100 }}
            style={{}}
            className="w-72 h-28 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg border border-purple-200 flex flex-col justify-between pointer-events-auto"
          >
            <div>
              <Quote className="w-4 h-4 text-purple-500 mb-2" />
              <p className="text-xs text-gray-700 italic line-clamp-2">{reviews[2].quote}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{reviews[2].author}</span>
              <div className="flex gap-0.5">
                {[...Array(reviews[2].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Overlapping Review */}
        {reviews[3] && (
          <motion.div 
            initial={{ opacity: 0, rotate: -5, scale: 0.6, y: 40, x: 50 }}
            animate={{ opacity: 1, rotate: -5, scale: 1, y: 0, x: 0 }}
            transition={{ duration: 0.7, delay: 1.0, ease: "easeOut", type: "spring", stiffness: 100 }}
            style={{}}
            className="w-72 h-28 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg border-2 border-purple-500 flex flex-col justify-between pointer-events-auto relative"
          >
            <div className="absolute -top-3 -right-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full whitespace-nowrap">
              ⭐ Favorite
            </div>
            <div>
              <Quote className="w-4 h-4 text-purple-500 mb-2" />
              <p className="text-xs text-gray-700 italic line-clamp-2">{reviews[3].quote}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{reviews[3].author}</span>
              <div className="flex gap-0.5">
                {[...Array(reviews[3].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Slightly Invisible Review Cards Below */}
      <motion.div className="absolute hidden lg:flex gap-8 left-1/2 -translate-x-1/2 justify-between pointer-events-none z-30" style={{ top: "65%", width: "1400px", opacity: reviewCardsOpacity }}>
        {/* Left Invisible Review */}
        {reviews[4] && (
          <motion.div 
            initial={{ opacity: 0, rotate: -5, scale: 0.6, x: -120, y: 100 }}
            animate={{ opacity: 1, rotate: -5, scale: 1, x: -70, y: 60 }}
            transition={{ duration: 0.7, delay: 1.1, ease: "easeOut", type: "spring", stiffness: 100 }}
            style={{}}
            className="w-72 h-28 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg border border-purple-200 flex flex-col justify-between pointer-events-auto"
          >
            <div>
              <Quote className="w-4 h-4 text-purple-500 mb-2" />
              <p className="text-xs text-gray-700 italic line-clamp-2">{reviews[4].quote}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{reviews[4].author}</span>
              <div className="flex gap-0.5">
                {[...Array(reviews[4].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Right Invisible Review */}
        {reviews[5] && (
          <motion.div 
            initial={{ opacity: 0, rotate: 5, scale: 0.6, x: 120, y: 100 }}
            animate={{ opacity: 1, rotate: 5, scale: 1, x: 70, y: 60 }}
            transition={{ duration: 0.7, delay: 1.2, ease: "easeOut", type: "spring", stiffness: 100 }}
            style={{}}
            className="w-72 h-28 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 shadow-lg border border-purple-200 flex flex-col justify-between pointer-events-auto"
          >
            <div>
              <Quote className="w-4 h-4 text-purple-500 mb-2" />
              <p className="text-xs text-gray-700 italic line-clamp-2">{reviews[5].quote}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-800">{reviews[5].author}</span>
              <div className="flex gap-0.5">
                {[...Array(reviews[5].rating)].map((_, i) => (
                  <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="text-white/90"
          >
            <AariLogo size={64} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <Badge 
            variant="secondary" 
            className="mb-6 bg-white/20 text-white border-white/30 backdrop-blur-sm"
          >
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Travel Planning
          </Badge>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight"
        >
          Your Friendly
          <br />
          <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-purple-400 bg-clip-text text-transparent">
            Travel Planner
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg lg:text-xl text-white/80 max-w-2xl mx-auto mb-8"
        >
          Meet Aari — your AI travel assistant that helps plan tours, book cabs, 
          and create personalized experiences just for you.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex justify-center"
        >
          <Button 
            size="lg" 
            className="text-lg px-8 py-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-lg shadow-purple-500/25"
            data-testid="button-hero-start"
          >
            <motion.span
              className="flex items-center gap-2"
              whileHover={{ x: 5 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <MessageCircle className="w-5 h-5" />
              Start Chatting
            </motion.span>
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="mt-12 flex items-center justify-center text-white/70"
        >
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">
              Operating in <span className="font-semibold text-white">Kodaikanal</span>
            </span>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <motion.div 
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center pt-2"
        >
          <motion.div
            animate={{ y: [0, 8, 0], opacity: [1, 0.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-1.5 h-1.5 bg-white rounded-full"
          />
        </motion.div>
      </motion.div>

      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <motion.div
          animate={{ 
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 left-10 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"
        />
        <motion.div
          animate={{ 
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
        />
      </div>
    </section>
  );
}
