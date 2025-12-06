import { useState, useEffect, useRef, useCallback, memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { 
  MapPin, Clock, Star, Users,
  ChevronLeft, ChevronRight,
  X, MessageCircle 
} from "lucide-react";
import { motion, AnimatePresence, useMotionValueEvent, MotionValue } from "framer-motion";
import { popularTrips, Trip, categories } from "@shared/trips";

// --- TRIP CARD COMPONENT ---
const TripCard = memo(({ 
  trip, 
  isMobileOrTablet, 
  isGrid = false, 
  onClick,
  className = "" 
}: { 
  trip: Trip; 
  isMobileOrTablet: boolean; 
  isGrid?: boolean; 
  onClick: (trip: Trip) => void;
  className?: string;
}) => {
  const motionProps = isMobileOrTablet 
    ? {} 
    : {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.5 },
        whileHover: { scale: 1.05, y: -4 }
      };
      
  const widthClasses = isGrid ? "w-full" : "w-64 lg:w-64 xl:w-72";

  return (
    <motion.div
      {...motionProps}
      onClick={(e) => {
        e.stopPropagation();
        onClick(trip);
      }}
      className={`bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all ${widthClasses} h-52 xl:h-56 cursor-pointer flex flex-col ${className}`}
    >
      <div className="relative h-28 xl:h-32 overflow-hidden">
        <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <Badge variant="secondary" className="absolute top-1 left-1 bg-white/90 text-gray-800 text-xs">
          {trip.category}
        </Badge>
      </div>
      <div className="p-2 flex-1 flex flex-col justify-between">
        <p className="font-semibold text-gray-900 text-xs line-clamp-1">{trip.title}</p>
        <p className="text-xs text-gray-600 flex items-center gap-1 mt-0.5">
          <MapPin className="w-2.5 h-2.5" />
          {trip.location}
        </p>
        <div className="flex items-center justify-between mt-1">
          <div className="flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold text-gray-900">{trip.rating}</span>
          </div>
          <span className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
            ₹{trip.price}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

interface PopularTripsProps {
  scrollProgress: MotionValue<number>;
  onPlaceholderPositionsChange: (positions: { left: DOMRect[]; right: DOMRect[] }) => void;
  popularTripsRef: React.RefObject<HTMLDivElement>;
  isMobileOrTablet: boolean;
}

export default function PopularTrips({ scrollProgress, onPlaceholderPositionsChange, popularTripsRef, isMobileOrTablet }: PopularTripsProps) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dockedCards, setDockedCards] = useState<boolean[]>([false, false]); 
  const [showAllTripsModal, setShowAllTripsModal] = useState(false);
  
  const leftPlaceholderRefs = useRef<(HTMLDivElement | null)[]>([null]);
  const rightPlaceholderRefs = useRef<(HTMLDivElement | null)[]>([null]);

  const handleCardClick = useCallback((trip: Trip) => {
    setSelectedTrip(trip);
    setActiveImageIndex(0);
  }, []);

  const updatePlaceholderPositions = useCallback(() => {
    const leftPositions = leftPlaceholderRefs.current.map(ref => {
      if (!ref) return new DOMRect();
      const rect = ref.getBoundingClientRect();
      return new DOMRect(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height);
    });
    const rightPositions = rightPlaceholderRefs.current.map(ref => {
      if (!ref) return new DOMRect();
      const rect = ref.getBoundingClientRect();
      return new DOMRect(rect.left + window.scrollX, rect.top + window.scrollY, rect.width, rect.height);
    });
    onPlaceholderPositionsChange({ left: leftPositions, right: rightPositions });
  }, [onPlaceholderPositionsChange]);

  useEffect(() => {
    updatePlaceholderPositions();
    const timeout = setTimeout(updatePlaceholderPositions, 100);
    window.addEventListener('resize', updatePlaceholderPositions);
    return () => {
      clearTimeout(timeout);
      window.removeEventListener('resize', updatePlaceholderPositions);
    };
  }, [updatePlaceholderPositions]);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    if (isMobileOrTablet) return; 
    
    const newDockedCards = dockedCards.map((_, idx) => {
      const animationEnd = 0.5 + idx * 0.05; 
      return latest >= animationEnd;
    });
    
    if (JSON.stringify(newDockedCards) !== JSON.stringify(dockedCards)) {
      setDockedCards(newDockedCards);
    }
  });

  // --- UPDATED PLACEHOLDER COMPONENT ---
  const Placeholder = ({ 
    side, 
    index, 
    trip, 
    onClick,
    isDocked 
  }: { 
    side: 'left' | 'right'; 
    index: number; 
    trip?: Trip; 
    onClick?: (trip: Trip) => void;
    isDocked: boolean;
  }) => {
    return (
      <div 
        ref={(el) => {
          if (side === 'left') {
            leftPlaceholderRefs.current[index] = el;
          } else {
            rightPlaceholderRefs.current[index] = el;
          }
        }}
        // 'relative' is crucial for positioning the inner hit-box
        className="w-64 lg:w-64 xl:w-72 h-52 xl:h-56 rounded-lg relative"
      >
        {/* FIX: 
            1. We do NOT render <TripCard> here. This prevents the "double card" visual.
            2. We render a transparent <div> that fills the space (inset-0).
            3. We give it z-50 to ensure it sits on top of the Hero animation.
            4. This makes the area clickable without adding any pixels to the screen.
        */}
        {isDocked && trip && onClick && (
          <div 
            className="absolute inset-0 z-50 cursor-pointer bg-transparent"
            onClick={(e) => {
              e.stopPropagation();
              onClick(trip);
            }}
            aria-label={`View details for ${trip.title}`}
          />
        )}
      </div>
    );
  };

  return (
    <section id="popular-trips" className="py-12 sm:py-16 lg:py-24 relative overflow-hidden lg:overflow-visible bg-gradient-to-b from-background via-muted/20 to-background" ref={popularTripsRef}>
      
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.div 
          {...(isMobileOrTablet ? {} : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 }
          })}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            Explore Kodaikanal
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Popular Trips
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved experiences. Click any trip to see full details, 
            photos, and book your adventure.
          </p>
        </motion.div>
      </div>

      {isMobileOrTablet ? (
        <div className="relative px-4 sm:px-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-4 md:gap-5 max-w-7xl mx-auto">
            {popularTrips.slice(0, 6).map((trip) => (
              <TripCard key={trip.id} trip={trip} isMobileOrTablet={isMobileOrTablet} isGrid={true} onClick={handleCardClick} />
            ))}
          </div>
        </div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative flex justify-center px-6"
        >
          <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl px-6 lg:px-8 xl:px-10 pt-4 lg:pt-6 pb-2 lg:pb-3 max-w-full">
            <motion.div 
              className="flex justify-center"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 },
                },
              }}
            >
              <div className="flex gap-4 lg:gap-6 xl:gap-8 items-start">
                {/* Left Column */}
                <div className="flex flex-col gap-6">
                  <Placeholder 
                    side="left" 
                    index={0} 
                    trip={popularTrips[0]} 
                    onClick={handleCardClick}
                    isDocked={dockedCards[0]} 
                  />
                  {[5, 2].map((idx) => popularTrips[idx] && <TripCard key={idx} trip={popularTrips[idx]} isMobileOrTablet={false} onClick={handleCardClick} />)}
                </div>
                
                {/* Middle Column */}
                <div className="flex flex-col gap-6">
                  {[1, 4, 7].map((idx) => popularTrips[idx] && <TripCard key={idx} trip={popularTrips[idx]} isMobileOrTablet={false} onClick={handleCardClick} />)}
                </div>
                
                {/* Right Column */}
                <div className="flex flex-col gap-6">
                  <Placeholder 
                    side="right" 
                    index={0} 
                    trip={popularTrips[8]} 
                    onClick={handleCardClick}
                    isDocked={dockedCards[1]} 
                  />
                  {[6, 3].map((idx) => popularTrips[idx] && <TripCard key={idx} trip={popularTrips[idx]} isMobileOrTablet={false} onClick={handleCardClick} />)}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* ... View All Modal Code ... */}
      <motion.div 
        {...(isMobileOrTablet ? {} : {
          initial: { opacity: 0, y: 20 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.6 }
        })}
        className="flex justify-center mt-8 sm:mt-12"
      >
        <Button onClick={() => setShowAllTripsModal(true)} size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">View All Trips</Button>
      </motion.div>

      <Dialog open={showAllTripsModal} onOpenChange={setShowAllTripsModal}>
        <DialogContent className="max-w-5xl h-[85vh] p-0 flex flex-col bg-white dark:bg-slate-950 overflow-hidden">
          <div className="overflow-y-auto p-6 space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">All Trips</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button key={category} variant={selectedCategory === category ? "default" : "outline"} size="sm" onClick={() => setSelectedCategory(category)}>{category}</Button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTrips
                .filter(trip => selectedCategory === "All" || trip.category === selectedCategory)
                .map((trip) => (
                  <motion.div
                    key={trip.id}
                    onClick={() => { setSelectedTrip(trip); setActiveImageIndex(0); setShowAllTripsModal(false); }}
                    className="bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all w-full cursor-pointer flex flex-col h-64"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img src={trip.image} alt={trip.title} className="w-full h-full object-cover" />
                      <Badge variant="secondary" className="absolute top-1 left-1">{trip.category}</Badge>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <p className="font-semibold text-sm">{trip.title}</p>
                      <span className="text-xs font-bold text-purple-600">₹{trip.price}</span>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* --- INDIVIDUAL TRIP DETAILS MODAL --- */}
      <Dialog 
        open={!!selectedTrip} 
        onOpenChange={(open) => !open && setSelectedTrip(null)}
      >
        <DialogContent className="max-w-4xl h-[85vh] p-0 flex flex-col bg-white dark:bg-slate-950 overflow-hidden border-0 z-50">
          
          <DialogTitle className="sr-only">Trip Details</DialogTitle>

          <AnimatePresence>
            {selectedTrip && (
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.9 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-4 right-6 z-[60] pointer-events-auto"
              >
                <Button 
                  size="lg"
                  className="rounded-full shadow-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-6 h-12"
                  onClick={() => { /* Contact logic */ }}
                >
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Let's Talk
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="absolute right-4 top-4 z-[60]">
            <button
              onClick={() => setSelectedTrip(null)}
              className="bg-black/30 hover:bg-black/50 backdrop-blur-md text-white p-2 rounded-full transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {selectedTrip && (
            <div className="flex-1 overflow-y-auto w-full relative">
              <div className="relative h-64 md:h-80 w-full">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImageIndex}
                    src={selectedTrip.images[activeImageIndex]}
                    alt={selectedTrip.title}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-full h-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                
                {selectedTrip.images.length > 1 && (
                  <>
                    <button onClick={() => setActiveImageIndex(prev => prev === 0 ? selectedTrip.images.length - 1 : prev - 1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 z-10"><ChevronLeft className="w-5 h-5" /></button>
                    <button onClick={() => setActiveImageIndex(prev => prev === selectedTrip.images.length - 1 ? 0 : prev + 1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 z-10"><ChevronRight className="w-5 h-5" /></button>
                  </>
                )}

                <div className="absolute bottom-4 left-4 right-4 z-10">
                  <Badge className="bg-white/90 text-gray-800 mb-2">{selectedTrip.category}</Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedTrip.title}</h2>
                  <p className="text-white/80 flex items-center gap-1"><MapPin className="w-4 h-4" />{selectedTrip.location}</p>
                </div>
              </div>

              <div className="p-6 space-y-6 pb-6 bg-white dark:bg-slate-950">
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1"><Star className="w-5 h-5 fill-yellow-400 text-yellow-400" /><span className="font-semibold">{selectedTrip.rating}</span><span className="text-muted-foreground">({selectedTrip.reviews} reviews)</span></div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Clock className="w-5 h-5" />{selectedTrip.duration}</div>
                  <div className="flex items-center gap-1 text-muted-foreground"><Users className="w-5 h-5" />{selectedTrip.groupSize}</div>
                  <Badge variant="outline">{selectedTrip.difficulty}</Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">About This Trip</h3>
                  <p className="text-muted-foreground">{selectedTrip.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.highlights.map((highlight, idx) => ( <Badge key={idx} variant="secondary">{highlight}</Badge> ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Itinerary</h3>
                  <div className="space-y-3">
                    {selectedTrip.itinerary.map((item, idx) => (
                      <div key={idx} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/60" />
                          {idx < selectedTrip.itinerary.length - 1 && ( <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent mt-1" /> )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium text-primary">{item.time}</p>
                          <p className="text-foreground">{item.activity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border mt-6">
                  <div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      ₹{selectedTrip.price}
                    </span>
                    <span className="text-muted-foreground"> /person</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}