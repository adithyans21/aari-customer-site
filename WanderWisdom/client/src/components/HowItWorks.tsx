import { Badge } from "@/components/ui/badge";
import { MessageCircle, FileText, CreditCard, Plane } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    id: 1,
    icon: MessageCircle,
    title: "Chat with Aari",
    description: "Tell Aari about your interests, travel dates, and what experiences matter most to you.",
  },
  {
    id: 2,
    icon: FileText,
    title: "Get Your Itinerary",
    description: "Receive a personalized plan with tours, activities, and hidden gems in Kodaikanal.",
  },
  {
    id: 3,
    icon: CreditCard,
    title: "Book & Pay",
    description: "Secure cabs and tours with transparent pricing. Payment is required only for cab bookings.",
  },
  {
    id: 4,
    icon: Plane,
    title: "Enjoy Your Trip",
    description: "Explore Kodaikanal with confidence knowing Aari is always available to help.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 lg:py-24 relative overflow-hidden" id="how-it-works">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/40 to-background" />
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            Simple Process
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              How Aari Works
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From idea to adventure in four simple steps. No complicated planning, 
            no endless research.
          </p>
        </motion.div>

        <div className="relative">
          <motion.div 
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.5 }}
            className="hidden lg:block absolute top-16 left-[12%] right-[12%] h-0.5 bg-gradient-to-r from-transparent via-primary/30 to-transparent origin-left"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative"
              >
                <motion.div 
                  whileHover={{ y: -8 }}
                  className="flex flex-col items-center text-center"
                >
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: [0, -10, 10, 0] }}
                    transition={{ type: "spring", stiffness: 300 }}
                    className="relative z-10 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center mb-6 shadow-lg shadow-primary/25"
                  >
                    <step.icon className="w-7 h-7 text-primary-foreground" />
                    <motion.div 
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + idx * 0.1, type: "spring" }}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-background border-2 border-primary flex items-center justify-center shadow-md"
                    >
                      <span className="text-sm font-bold text-primary">{step.id}</span>
                    </motion.div>
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm max-w-[250px]">
                    {step.description}
                  </p>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
