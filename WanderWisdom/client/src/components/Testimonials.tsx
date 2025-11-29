import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, CheckCircle2, Quote } from "lucide-react";
import { motion } from "framer-motion";
import avatar1 from "@assets/generated_images/testimonial_avatar_woman_1.png";
import avatar2 from "@assets/generated_images/testimonial_avatar_man_1.png";
import avatar3 from "@assets/generated_images/testimonial_avatar_woman_2.png";

// todo: remove mock functionality
const testimonials = [
  {
    id: 1,
    name: "Priya Sharma",
    location: "Visited from Chennai",
    avatar: avatar1,
    rating: 5,
    quote: "Aari made our Kodaikanal trip absolutely magical! The AI understood exactly what we wanted — peaceful spots, local food, and scenic viewpoints.",
    verified: true,
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    location: "Visited from Bangalore",
    avatar: avatar2,
    rating: 5,
    quote: "The cab booking feature saved us so much hassle. Real-time pricing, reliable drivers, and the integration with our tour plan was seamless.",
    verified: true,
  },
  {
    id: 3,
    name: "Anitha Menon",
    location: "Visited from Mumbai",
    avatar: avatar3,
    rating: 5,
    quote: "My personalized profile meant every recommendation was spot on. Aari remembered I love sunrise hikes and suggested the perfect trails.",
    verified: true,
  },
];

export default function Testimonials() {
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
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            Loved by Travelers
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              What Our Travelers Say
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join travelers who discovered their perfect Kodaikanal experience 
            with Aari.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial, idx) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15, duration: 0.5 }}
              className={idx === 1 ? "md:-mt-4" : idx === 2 ? "md:mt-4" : ""}
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Card className="p-6 h-full border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                  <motion.div
                    initial={{ rotate: 0 }}
                    whileHover={{ rotate: [0, -5, 5, 0] }}
                    transition={{ duration: 0.5 }}
                  >
                    <Quote className="w-8 h-8 text-primary/20 mb-4" />
                  </motion.div>
                  
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 * i + 0.3 * idx }}
                      >
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      </motion.div>
                    ))}
                  </div>

                  <p className="text-foreground mb-6 leading-relaxed" data-testid={`text-testimonial-${testimonial.id}`}>
                    "{testimonial.quote}"
                  </p>

                  <div className="flex items-center gap-3">
                    <motion.div whileHover={{ scale: 1.1 }} transition={{ type: "spring", stiffness: 400 }}>
                      <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                        <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                        <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                      </Avatar>
                    </motion.div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-foreground">{testimonial.name}</p>
                        {testimonial.verified && (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </div>

                  {testimonial.verified && (
                    <Badge variant="outline" className="mt-4 text-xs bg-gradient-to-r from-primary/10 to-transparent">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Verified Traveler
                    </Badge>
                  )}
                </Card>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
