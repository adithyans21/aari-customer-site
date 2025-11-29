import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Car, MapPin, Clock, DollarSign, Star, Navigation, Check } from "lucide-react";
import { motion } from "framer-motion";
import Hint from "./Hint";

// todo: remove mock functionality
const mockVehicles = [
  { id: 1, name: "Economy", type: "Sedan", price: 800, eta: "5 min", rating: 4.8, seats: 4 },
  { id: 2, name: "Comfort", type: "SUV", price: 1200, eta: "8 min", rating: 4.9, seats: 6 },
  { id: 3, name: "Premium", type: "Luxury", price: 1800, eta: "12 min", rating: 4.9, seats: 4 },
];

export default function CabBookingSection() {
  const [pickup, setPickup] = useState("Kodaikanal Bus Stand");
  const [dropoff, setDropoff] = useState("Kodaikanal Lake");
  const [selectedVehicle, setSelectedVehicle] = useState(mockVehicles[1]);
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = () => {
    setIsBooked(true);
    // todo: remove mock functionality
    setTimeout(() => setIsBooked(false), 3000);
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-muted/50 to-muted/30" />
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Car className="w-3 h-3 mr-1" />
            Seamless Transportation
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Book Your Ride Instantly
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From bus stand pickups to tour locations, book reliable transportation 
            with transparent pricing.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 md:col-span-1 border-primary/20 bg-gradient-to-br from-card to-card/80 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Navigation className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Route</span>
                <Hint text="Enter your pickup and dropoff locations. We'll calculate the best route and fare." />
              </div>

              <div className="space-y-4">
                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-green-500" />
                  <Input
                    value={pickup}
                    onChange={(e) => setPickup(e.target.value)}
                    className="pl-8 bg-background/50"
                    placeholder="Pickup location"
                    data-testid="input-pickup"
                  />
                </motion.div>
                
                <div className="flex justify-center">
                  <motion.div 
                    animate={{ height: [20, 24, 20] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-0.5 bg-gradient-to-b from-green-400 via-primary to-red-400"
                  />
                </div>

                <motion.div 
                  className="relative"
                  whileFocus={{ scale: 1.02 }}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-gradient-to-r from-red-400 to-red-500" />
                  <Input
                    value={dropoff}
                    onChange={(e) => setDropoff(e.target.value)}
                    className="pl-8 bg-background/50"
                    placeholder="Dropoff location"
                    data-testid="input-dropoff"
                  />
                </motion.div>
              </div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="mt-6 p-4 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-lg"
              >
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Distance</span>
                  <span className="font-medium text-foreground">4.2 km</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Est. Duration</span>
                  <span className="font-medium text-foreground">12 min</span>
                </div>
              </motion.div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="p-6 md:col-span-1 border-primary/20 bg-gradient-to-br from-card to-card/80 h-full">
              <div className="flex items-center gap-2 mb-6">
                <Car className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Choose Vehicle</span>
              </div>

              <div className="space-y-3">
                {mockVehicles.map((vehicle, idx) => (
                  <motion.button
                    key={vehicle.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    onClick={() => setSelectedVehicle(vehicle)}
                    whileHover={{ scale: 1.02, x: 4 }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full p-4 rounded-xl border text-left transition-all ${
                      selectedVehicle.id === vehicle.id 
                        ? "border-primary bg-gradient-to-r from-primary/10 to-transparent" 
                        : "border-border bg-card hover:border-primary/50"
                    }`}
                    data-testid={`button-vehicle-${vehicle.name.toLowerCase()}`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-foreground">{vehicle.name}</span>
                        <span className="text-sm text-muted-foreground ml-2">{vehicle.type}</span>
                      </div>
                      {selectedVehicle.id === vehicle.id && (
                        <motion.div 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="w-5 h-5 rounded-full bg-gradient-to-r from-primary to-primary/80 flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {vehicle.eta}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {vehicle.rating}
                      </span>
                      <span>{vehicle.seats} seats</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="p-6 md:col-span-1 border-primary/20 bg-gradient-to-br from-card to-card/80 h-full flex flex-col">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Fare Breakdown</span>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Base fare</span>
                  <span className="text-foreground">₹{Math.round(selectedVehicle.price * 0.4)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Distance (4.2 km)</span>
                  <span className="text-foreground">₹{Math.round(selectedVehicle.price * 0.5)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Service fee</span>
                  <span className="text-foreground">₹{Math.round(selectedVehicle.price * 0.1)}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent my-2" />
                <div className="flex justify-between">
                  <span className="font-semibold text-foreground">Total</span>
                  <motion.span 
                    key={selectedVehicle.price}
                    initial={{ scale: 1.2, color: "hsl(var(--primary))" }}
                    animate={{ scale: 1 }}
                    className="font-bold text-xl text-primary"
                  >
                    ₹{selectedVehicle.price}
                  </motion.span>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                size="lg"
                onClick={handleBook}
                disabled={isBooked}
                data-testid="button-book-ride"
              >
                <motion.span
                  className="flex items-center gap-2"
                  animate={isBooked ? { scale: [1, 1.1, 1] } : {}}
                >
                  {isBooked ? (
                    <>
                      <Check className="w-4 h-4" />
                      Ride Booked!
                    </>
                  ) : (
                    <>
                      <Car className="w-4 h-4" />
                      Book {selectedVehicle.name}
                    </>
                  )}
                </motion.span>
              </Button>

              <p className="text-xs text-muted-foreground text-center mt-4">
                Payment required for cab bookings
              </p>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
