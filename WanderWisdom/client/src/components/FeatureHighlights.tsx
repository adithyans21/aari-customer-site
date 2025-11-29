import { Card } from "@/components/ui/card";
import { Brain, Zap, Sparkles, HeadphonesIcon } from "lucide-react";
import { motion } from "framer-motion";

const features = [
  {
    icon: Brain,
    title: "Smart Planning",
    description: "Aari analyzes your preferences to create perfectly tailored itineraries for Kodaikanal.",
    stat: "500+ tours planned",
  },
  {
    icon: Zap,
    title: "Instant Booking",
    description: "Book cabs and tours in seconds with real-time availability and transparent pricing.",
    stat: "2-minute avg. booking",
  },
  {
    icon: Sparkles,
    title: "AI Personalization",
    description: "Recommendations that learn and improve based on your preferences and feedback.",
    stat: "95% satisfaction rate",
  },
  {
    icon: HeadphonesIcon,
    title: "24/7 Assistance",
    description: "Aari is always available to answer questions and help with your travel plans.",
    stat: "Instant responses",
  },
];

export default function FeatureHighlights() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Why Choose Aari
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Everything you need for a seamless Kodaikanal experience, powered by 
            intelligent AI technology.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, idx) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 h-full border-primary/20 bg-gradient-to-br from-card via-card to-primary/5 group">
                  <motion.div 
                    whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center mb-4 group-hover:from-primary/30 group-hover:to-primary/10 transition-colors"
                  >
                    <feature.icon className="w-6 h-6 text-primary" />
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {feature.description}
                  </p>
                  <p className="text-xs font-medium bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    {feature.stat}
                  </p>
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
