import { useState, useEffect, useRef } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { 
  MapPin, Clock, Star, Users,
  ChevronLeft, ChevronRight, Heart,
  Camera, Mountain, Utensils, TreePine, Calendar
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { popularTrips, Trip, categories } from "@shared/trips";

const getCategoryIcon = (category: string) => {
  switch (category) {
    case "Adventure": return Mountain;
    case "Food & Culture": return Utensils;
    case "Nature": return TreePine;
    default: return Camera;
  }
};

export default function PopularTrips() {
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const progress = Math.max(0, Math.min(1, 1 - rect.top / window.innerHeight));
      setScrollProgress(progress);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Middle column cards: trips 3, 4, 5 (indices 1, 4, 7 in 3x3 grid)
  const middleColumnTrips = [
    popularTrips[3],  // grid position 1 (row 0, col 1)
    popularTrips[4],  // grid position 4 (row 1, col 1)
    popularTrips[5],  // grid position 7 (row 2, col 1)
  ];

  // Hero cards that will animate in: trips 0-2 (left) and 3-5... wait, that's wrong
  // Hero has trips 0-2 (left) and 3-5 (right)
  // But middle column is trips 3-5
  // So the grid should have trips 0-8, middle column is 3,4,5
  // Left column (0,3,6) should be filled by Hero trips 0-2
  // Right column (2,5,8) should be filled by Hero trips 3-5
  // But wait, trip 3,4,5 are in middle column
  
  // Let me reconsider: Hero has the first 6 trips
  // Popular trips grid has 9 trips (0-8)
  // Middle column should show trips 6, 7, 8
  // Left column (0, 3, 6) filled by Hero trips 0, 1, 2
  // Right column (2, 5, 8) filled by Hero trips 3, 4, 5
  // But then middle would need (1, 4, 7) which are trips 1, 4, 7
  
  // Actually, let me follow user's exact requirement:
  // Middle column visible: positions 1, 4, 7
  // Left column empty (will animate in): positions 0, 3, 6
  // Right column empty (will animate in): positions 2, 5, 8
  // So middle column shows trips at indices 1, 4, 7

  const toggleLike = (tripId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    setIsLiked(prev => 
      prev.includes(tripId) 
        ? prev.filter(id => id !== tripId)
        : [...prev, tripId]
    );
  };

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
        <div className="p-2">
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

  // Render grid with only middle column visible initially
  // Grid positions: 0 1 2 | 3 4 5 | 6 7 8
  // Middle column: positions 1, 4, 7
  // These correspond to popularTrips indices 1, 4, 7
  const gridItems = Array(9).fill(null).map((_, idx) => {
    const colIndex = idx % 3;
    const isMiddleCol = colIndex === 1;
    const trip = isMiddleCol ? popularTrips[idx] : null;

    return { trip, isMiddleCol, gridIndex: idx };
  });

  return (
    <section id="popular-trips" className="py-16 lg:py-24 relative overflow-hidden bg-gradient-to-b from-background via-muted/20 to-background" ref={containerRef}>
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

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mt-8"
        >
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="transition-all"
              data-testid={`button-filter-${category.toLowerCase()}`}
            >
              {category}
            </Button>
          ))}
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
              {/* Left column - 7 cards */}
              <div className="flex flex-col gap-2 h-full">
                {/* 4 empty placeholders (will be filled by hero cards on scroll) */}
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                {/* 3 actual cards - pushed to bottom */}
                <div className="flex flex-col gap-2 mt-auto">
                  {[8, 9, 10].map((idx) => {
                    const trip = popularTrips[idx];
                    return trip ? (
                      <HeroCardComponent key={idx} trip={trip} />
                    ) : null;
                  })}
                </div>
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
              
              {/* Right column - 7 cards */}
              <div className="flex flex-col gap-2 h-full">
                {/* 4 empty placeholders (will be filled by hero cards on scroll) */}
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                <motion.div
                  animate={{
                    opacity: scrollProgress > 0.3 ? 0.1 : 0,
                  }}
                  transition={{ duration: 0.5 }}
                  className="w-72 h-20 bg-muted/30 rounded-lg border border-dashed border-primary/20"
                />
                {/* 3 actual cards - pushed to bottom */}
                <div className="flex flex-col gap-2 mt-auto">
                  {[11, 12, 13].map((idx) => {
                    const trip = popularTrips[idx];
                    return trip ? (
                      <HeroCardComponent key={idx} trip={trip} />
                    ) : null;
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

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
