import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { User, Heart, Compass, Utensils, Camera, Mountain, Sparkles, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import Hint from "./Hint";

const interests = [
  { id: "adventure", label: "Adventure", icon: Mountain },
  { id: "culture", label: "Culture", icon: Compass },
  { id: "food", label: "Food & Dining", icon: Utensils },
  { id: "photography", label: "Photography", icon: Camera },
  { id: "relaxation", label: "Relaxation", icon: Heart },
];

// todo: remove mock functionality
const mockRecommendations = [
  { title: "Kodaikanal Lake Boating", match: 95, type: "Relaxation" },
  { title: "Pine Forest Trek", match: 88, type: "Adventure" },
  { title: "Local Food Tour", match: 92, type: "Food" },
];

export default function ProfileBuilder() {
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["adventure", "food"]);
  const [budget, setBudget] = useState([2000]);
  const [preferences, setPreferences] = useState({
    earlyRiser: true,
    groupTravel: false,
    luxuryAccommodation: false,
  });

  const toggleInterest = (id: string) => {
    setSelectedInterests((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <User className="w-3 h-3 mr-1" />
            Personalization
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Build Your Travel Profile
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tell Aari about your preferences and get tailored recommendations 
            for your Kodaikanal adventure.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <div className="lg:col-span-3 space-y-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 lg:p-8 border-primary/20 bg-gradient-to-br from-card to-card/80">
                <div className="flex items-center gap-2 mb-6">
                  <Heart className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Travel Interests</span>
                  <Hint text="Select your favorite travel activities. Aari will prioritize these in your recommendations." />
                </div>

                <div className="flex flex-wrap gap-3">
                  {interests.map((interest, idx) => {
                    const isSelected = selectedInterests.includes(interest.id);
                    const Icon = interest.icon;
                    return (
                      <motion.button
                        key={interest.id}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.05 * idx }}
                        onClick={() => toggleInterest(interest.id)}
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all ${
                          isSelected
                            ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-primary"
                            : "bg-card border-border text-foreground hover:border-primary/50"
                        }`}
                        data-testid={`button-interest-${interest.id}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span className="font-medium">{interest.label}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-6 lg:p-8 border-primary/20 bg-gradient-to-br from-card to-card/80">
                <div className="flex items-center gap-2 mb-6">
                  <DollarSign className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Daily Budget</span>
                  <Hint text="Set your average daily spending limit. This helps Aari suggest activities within your range." />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Budget per day</span>
                    <motion.span 
                      key={budget[0]}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                    >
                      ₹{budget[0]}
                    </motion.span>
                  </div>
                  <Slider
                    value={budget}
                    onValueChange={setBudget}
                    min={500}
                    max={10000}
                    step={100}
                    className="w-full"
                    data-testid="slider-budget"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>₹500</span>
                    <span>₹10,000+</span>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-6 lg:p-8 border-primary/20 bg-gradient-to-br from-card to-card/80">
                <div className="flex items-center gap-2 mb-6">
                  <Compass className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Preferences</span>
                </div>

                <div className="space-y-6">
                  {Object.entries({
                    earlyRiser: "I'm an early riser",
                    groupTravel: "I prefer group activities",
                    luxuryAccommodation: "I prefer premium experiences",
                  }).map(([key, label], idx) => (
                    <motion.div 
                      key={key} 
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 * idx }}
                      className="flex items-center justify-between"
                    >
                      <Label htmlFor={key} className="text-foreground cursor-pointer">
                        {label}
                      </Label>
                      <Switch
                        id={key}
                        checked={preferences[key as keyof typeof preferences]}
                        onCheckedChange={(checked) =>
                          setPreferences((prev) => ({ ...prev, [key]: checked }))
                        }
                        data-testid={`switch-${key}`}
                      />
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2"
          >
            <div className="lg:sticky lg:top-24 space-y-6">
              <Card className="p-6 lg:p-8 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                <div className="flex items-center gap-2 mb-6">
                  <Sparkles className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Live Preview</span>
                </div>

                <div className="space-y-4 mb-6">
                  <motion.div 
                    layout
                    className="p-4 bg-gradient-to-br from-secondary/50 to-secondary/30 rounded-xl"
                  >
                    <p className="text-sm text-muted-foreground mb-2">Your Profile</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInterests.map((id) => {
                        const interest = interests.find((i) => i.id === id);
                        return interest ? (
                          <motion.div
                            key={id}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                            layout
                          >
                            <Badge variant="secondary" className="capitalize">
                              {interest.label}
                            </Badge>
                          </motion.div>
                        ) : null;
                      })}
                    </div>
                    <p className="text-sm text-muted-foreground mt-3">
                      Budget: <span className="text-foreground font-medium">₹{budget[0]}/day</span>
                    </p>
                  </motion.div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground mb-3">Aari recommends:</p>
                  <div className="space-y-3">
                    {mockRecommendations.map((rec, idx) => (
                      <motion.div
                        key={rec.title}
                        initial={{ opacity: 0, x: 10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ scale: 1.02, x: 4 }}
                        className="flex items-center justify-between p-3 bg-card border border-card-border rounded-xl cursor-pointer"
                      >
                        <div>
                          <p className="font-medium text-foreground text-sm">{rec.title}</p>
                          <p className="text-xs text-muted-foreground">{rec.type}</p>
                        </div>
                        <Badge variant="outline" className="text-xs bg-gradient-to-r from-primary/10 to-transparent">
                          {rec.match}% match
                        </Badge>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </Card>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70" 
                size="lg" 
                data-testid="button-save-profile"
              >
                <motion.span
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Profile
                </motion.span>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
