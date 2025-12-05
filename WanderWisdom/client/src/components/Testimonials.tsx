import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Star, CheckCircle2, Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";
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
  const isMobileOrTablet = useIsMobileOrTablet();
  
  return (
    <section className="py-12 sm:py-16 lg:py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-muted/30 via-background to-muted/30" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mb-8 sm:mb-12">
        <motion.div 
          {...(isMobileOrTablet ? {} : {
            initial: { opacity: 0, y: 20 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true },
            transition: { duration: 0.6 }
          })}
          className="text-center mb-8 sm:mb-12"
        >
          <Badge variant="secondary" className="mb-3 sm:mb-4">
            <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
            Loved by Travelers
          </Badge>
          <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold mb-3 sm:mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              What Our Travelers Say
            </span>
          </h2>
          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Join travelers who discovered their perfect Kodaikanal experience 
            with Aari.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {testimonials.map((testimonial, idx) => {
            const cardMotionProps = isMobileOrTablet 
              ? {} 
              : {
                  initial: { opacity: 0, y: 30 },
                  whileInView: { opacity: 1, y: 0 },
                  viewport: { once: true },
                  transition: { delay: idx * 0.15, duration: 0.5 }
                };
            
            const hoverProps = isMobileOrTablet 
              ? {} 
              : {
                  whileHover: { y: -8, scale: 1.02 },
                  transition: { type: "spring", stiffness: 300 }
                };
            
            const quoteProps = isMobileOrTablet 
              ? {} 
              : {
                  initial: { rotate: 0 },
                  whileHover: { rotate: [0, -5, 5, 0] },
                  transition: { duration: 0.5 }
                };
            
            const avatarProps = isMobileOrTablet 
              ? {} 
              : {
                  whileHover: { scale: 1.1 },
                  transition: { type: "spring", stiffness: 400 }
                };
            
            return (
              <motion.div
                key={testimonial.id}
                {...cardMotionProps}
              >
                <motion.div {...hoverProps}>
                  <Card className="p-4 sm:p-6 h-full border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
                    <motion.div {...quoteProps}>
                      <Quote className="w-6 h-6 sm:w-8 sm:h-8 text-primary/20 mb-3 sm:mb-4" />
                    </motion.div>
                    
                    <div className="flex gap-1 mb-3 sm:mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => {
                        const starProps = isMobileOrTablet 
                          ? {} 
                          : {
                              initial: { opacity: 0, scale: 0 },
                              whileInView: { opacity: 1, scale: 1 },
                              viewport: { once: true },
                              transition: { delay: 0.1 * i + 0.3 * idx }
                            };
                        return (
                          <motion.div key={i} {...starProps}>
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 fill-yellow-400 text-yellow-400" />
                          </motion.div>
                        );
                      })}
                    </div>

                    <p className="text-sm sm:text-base text-foreground mb-4 sm:mb-6 leading-relaxed" data-testid={`text-testimonial-${testimonial.id}`}>
                      "{testimonial.quote}"
                    </p>

                    <div className="flex items-center gap-3">
                      <motion.div {...avatarProps}>
                        <Avatar className="w-10 h-10 sm:w-12 sm:h-12 ring-2 ring-primary/20">
                          <AvatarImage src={testimonial.avatar} alt={testimonial.name} />
                          <AvatarFallback>{testimonial.name[0]}</AvatarFallback>
                        </Avatar>
                      </motion.div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm sm:text-base text-foreground">{testimonial.name}</p>
                          {testimonial.verified && (
                            <CheckCircle2 className="w-3 h-3 sm:w-4 sm:h-4 text-primary" />
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>

                    {testimonial.verified && (
                      <Badge variant="outline" className="mt-3 sm:mt-4 text-xs bg-gradient-to-r from-primary/10 to-transparent">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Verified Traveler
                      </Badge>
                    )}
                  </Card>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
