import { useState, useEffect, useRef, useCallback } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  MapPin, Clock, Star, Users,
  ChevronLeft, ChevronRight,
  Camera, Mountain, Utensils, TreePine, Calendar
} from "lucide-react";
import { motion, AnimatePresence, useTransform, MotionValue, useMotionValueEvent } from "framer-motion";
import { popularTrips, Trip, categories } from "@shared/trips";

interface PopularTripsProps {
  scrollProgress: MotionValue<number>;
  onPlaceholderPositionsChange: (positions: { left: DOMRect[]; right: DOMRect[] }) => void;
  popularTripsRef: React.RefObject<HTMLDivElement>;
}

export default function PopularTrips({ scrollProgress, onPlaceholderPositionsChange, popularTripsRef }: PopularTripsProps) {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [dockedCards, setDockedCards] = useState<boolean[]>([false, false]);
  const [showAllTripsModal, setShowAllTripsModal] = useState(false);
  
  const leftPlaceholderRefs = useRef<(HTMLDivElement | null)[]>([null]);
  const rightPlaceholderRefs = useRef<(HTMLDivElement | null)[]>([null]);

  const updatePlaceholderPositions = useCallback(() => {
    const leftPositions = leftPlaceholderRefs.current.map(ref => {
      if (!ref) return new DOMRect();
      const rect = ref.getBoundingClientRect();
      return new DOMRect(
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.width,
        rect.height
      );
    });
    const rightPositions = rightPlaceholderRefs.current.map(ref => {
      if (!ref) return new DOMRect();
      const rect = ref.getBoundingClientRect();
      return new DOMRect(
        rect.left + window.scrollX,
        rect.top + window.scrollY,
        rect.width,
        rect.height
      );
    });
    onPlaceholderPositionsChange({ left: leftPositions, right: rightPositions });
  }, [onPlaceholderPositionsChange]);

  useEffect(() => {
    updatePlaceholderPositions();
    const timeout = setTimeout(updatePlaceholderPositions, 100);
    const timeout2 = setTimeout(updatePlaceholderPositions, 500);
    window.addEventListener('resize', updatePlaceholderPositions);
    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
      window.removeEventListener('resize', updatePlaceholderPositions);
    };
  }, [updatePlaceholderPositions]);

  useMotionValueEvent(scrollProgress, "change", (latest) => {
    const newDockedCards = dockedCards.map((_, idx) => {
      const animationEnd = 0.5 + idx * 0.05;
      return latest >= animationEnd;
    });
    
    if (JSON.stringify(newDockedCards) !== JSON.stringify(dockedCards)) {
      setDockedCards(newDockedCards);
    }
  });

  const CardComponent = ({ trip, gridIndex }: { trip: Trip; gridIndex: number }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05, y: -4 }}
        onClick={() => {
          setSelectedTrip(trip);
          setActiveImageIndex(0);
        }}
        className="bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all w-72 h-56 cursor-pointer flex flex-col"
        data-testid={`card-trip-${trip.id}`}
      >
        <div className="relative h-32 overflow-hidden">
          <img 
            src={trip.image}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge 
            variant="secondary" 
            className="absolute top-1 left-1 bg-white/90 text-gray-800 text-xs"
          >
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
  };

  const HeroCardComponent = ({ trip }: { trip: Trip }) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        whileHover={{ scale: 1.05, y: -4 }}
        onClick={() => {
          setSelectedTrip(trip);
          setActiveImageIndex(0);
        }}
        className="bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all w-72 h-20 cursor-pointer flex flex-col"
        data-testid={`card-trip-${trip.id}`}
      >
        <div className="relative h-8 overflow-hidden">
          <img 
            src={trip.image}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge 
            variant="secondary" 
            className="absolute top-0.5 left-0.5 bg-white/90 text-gray-800 text-xs"
          >
            {trip.category}
          </Badge>
        </div>
        <div className="p-1 flex-1 flex flex-col justify-between">
          <p className="font-semibold text-gray-900 text-xs line-clamp-1">{trip.title}</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              <Star className="w-2 h-2 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-900">{trip.rating}</span>
            </div>
            <span className="text-xs font-bold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              ₹{trip.price}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  const DockedCard = ({ trip }: { trip: Trip }) => {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        onClick={() => {
          setSelectedTrip(trip);
          setActiveImageIndex(0);
        }}
        className="bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all w-72 h-56 cursor-pointer flex flex-col"
        data-testid={`card-docked-${trip.id}`}
      >
        <div className="relative h-32 overflow-hidden">
          <img 
            src={trip.image}
            alt={trip.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <Badge 
            variant="secondary" 
            className="absolute top-1 left-1 bg-white/90 text-gray-800 text-xs"
          >
            {trip.category}
          </Badge>
        </div>
        <div className="p-3 flex-1 flex flex-col justify-between">
          <div>
            <p className="font-semibold text-gray-900 text-sm line-clamp-1">{trip.title}</p>
            <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
              <MapPin className="w-2.5 h-2.5" />
              {trip.location}
            </p>
          </div>
          <div className="flex items-center justify-between">
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
  };

  const Placeholder = ({ 
    side, 
    index 
  }: { 
    side: 'left' | 'right'; 
    index: number;
  }) => {
    const cardIndex = side === 'left' ? 0 : 1;

    return (
      <div 
        ref={(el) => {
          if (side === 'left') {
            leftPlaceholderRefs.current[index] = el;
          } else {
            rightPlaceholderRefs.current[index] = el;
          }
        }}
        className="w-72 h-56 rounded-lg relative"
        data-placeholder={`${side}-${index}`}
      >
        {/* Placeholder for hero cards to dock - no card rendered here */}
      </div>
    );
  };

  return (
    <section id="popular-trips" className="py-16 lg:py-24 relative overflow-visible bg-gradient-to-b from-background via-muted/20 to-background" ref={popularTripsRef}>
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6 mb-12">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <Badge variant="secondary" className="mb-4">
            <MapPin className="w-3 h-3 mr-1" />
            Explore Kodaikanal
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Popular Trips
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our most loved experiences. Click any trip to see full details, 
            photos, and book your adventure.
          </p>
        </motion.div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative flex justify-center px-6"
      >
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-2xl px-8 md:px-10 pt-4 md:pt-6 pb-2 md:pb-3">
          <motion.div 
            className="flex justify-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
          >
            <div className="flex gap-8 items-start">
              {/* Left column */}
              <div className="flex flex-col gap-4">
                {[0].map((index) => (
                  <Placeholder key={`left-${index}`} side="left" index={index} />
                ))}
                {[5].map((idx) => {
                  const trip = popularTrips[idx];
                  return trip ? (
                    <CardComponent key={idx} trip={trip} gridIndex={idx} />
                  ) : null;
                })}
                {[2].map((idx) => {
                  const trip = popularTrips[idx];
                  return trip ? (
                    <CardComponent key={idx} trip={trip} gridIndex={idx} />
                  ) : null;
                })}
              </div>
              
              {/* Middle column */}
              <div className="flex flex-col gap-4">
                {[1, 4, 7].map((idx) => {
                  const trip = popularTrips[idx];
                  return trip ? (
                    <CardComponent key={idx} trip={trip} gridIndex={idx} />
                  ) : null;
                })}
              </div>
              
              {/* Right column */}
              <div className="flex flex-col gap-4">
                {[0].map((index) => (
                  <Placeholder key={`right-${index}`} side="right" index={index} />
                ))}
                {[6].map((idx) => {
                  const trip = popularTrips[idx];
                  return trip ? (
                    <CardComponent key={idx} trip={trip} gridIndex={idx} />
                  ) : null;
                })}
                {[3].map((idx) => {
                  const trip = popularTrips[idx];
                  return trip ? (
                    <CardComponent key={idx} trip={trip} gridIndex={idx} />
                  ) : null;
                })}
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="flex justify-center mt-12"
      >
        <Button 
          onClick={() => setShowAllTripsModal(true)}
          size="lg"
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          View All Trips
        </Button>
      </motion.div>

      <Dialog open={showAllTripsModal} onOpenChange={setShowAllTripsModal}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold mb-4">All Trips</h2>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={selectedCategory === category ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(category)}
                    className="transition-all"
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularTrips
                .filter(trip => selectedCategory === "All" || trip.category === selectedCategory)
                .map((trip) => (
                  <motion.div
                    key={trip.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    onClick={() => {
                      setSelectedTrip(trip);
                      setActiveImageIndex(0);
                      setShowAllTripsModal(false);
                    }}
                    className="bg-white/95 backdrop-blur-md rounded-lg overflow-hidden shadow-lg hover:shadow-purple-500/30 transition-all w-full cursor-pointer flex flex-col h-64"
                  >
                    <div className="relative h-32 overflow-hidden">
                      <img 
                        src={trip.image}
                        alt={trip.title}
                        className="w-full h-full object-cover hover:scale-105 transition-transform"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <Badge 
                        variant="secondary" 
                        className="absolute top-1 left-1 bg-white/90 text-gray-800 text-xs"
                      >
                        {trip.category}
                      </Badge>
                    </div>
                    <div className="p-3 flex-1 flex flex-col justify-between">
                      <div>
                        <p className="font-semibold text-gray-900 text-sm line-clamp-1">{trip.title}</p>
                        <p className="text-xs text-gray-600 flex items-center gap-1 mt-1">
                          <MapPin className="w-2.5 h-2.5" />
                          {trip.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
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
                ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTrip} onOpenChange={() => setSelectedTrip(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          {selectedTrip && (
            <>
              <div className="relative h-64 md:h-80">
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
                    <button
                      onClick={() => setActiveImageIndex(prev => 
                        prev === 0 ? selectedTrip.images.length - 1 : prev - 1
                      )}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      data-testid="button-prev-image"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setActiveImageIndex(prev => 
                        prev === selectedTrip.images.length - 1 ? 0 : prev + 1
                      )}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                      data-testid="button-next-image"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <Badge className="bg-white/90 text-gray-800 mb-2">
                    {selectedTrip.category}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{selectedTrip.title}</h2>
                  <p className="text-white/80 flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {selectedTrip.location}
                  </p>
                </div>

                <div className="absolute bottom-4 right-4 flex gap-2">
                  {selectedTrip.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        idx === activeImageIndex ? "bg-white" : "bg-white/50"
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex flex-wrap items-center gap-4 pb-4 border-b border-border">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{selectedTrip.rating}</span>
                    <span className="text-muted-foreground">({selectedTrip.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-5 h-5" />
                    {selectedTrip.duration}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Users className="w-5 h-5" />
                    {selectedTrip.groupSize}
                  </div>
                  <Badge variant="outline">{selectedTrip.difficulty}</Badge>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-2">About This Trip</h3>
                  <p className="text-muted-foreground">{selectedTrip.description}</p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Highlights</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedTrip.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="secondary">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-3">Itinerary</h3>
                  <div className="space-y-3">
                    {selectedTrip.itinerary.map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex gap-4"
                      >
                        <div className="flex flex-col items-center">
                          <div className="w-3 h-3 rounded-full bg-gradient-to-br from-primary to-primary/60" />
                          {idx < selectedTrip.itinerary.length - 1 && (
                            <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium text-primary">{item.time}</p>
                          <p className="text-foreground">{item.activity}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-4 border-t border-border">
                  <div>
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                      ₹{selectedTrip.price}
                    </span>
                    <span className="text-muted-foreground"> /person</span>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto">
                    <Button 
                      variant="outline" 
                      className="flex-1 md:flex-none"
                      data-testid="button-contact"
                    >
                      Contact Aari
                    </Button>
                    <Button 
                      className="flex-1 md:flex-none bg-gradient-to-r from-primary to-primary/80"
                      data-testid="button-book-now"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Now
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
