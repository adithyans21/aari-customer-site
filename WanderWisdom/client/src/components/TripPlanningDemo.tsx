import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Bot, User, MapPin, Calendar, Clock, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Hint from "./Hint";
import AariLogo from "./AariLogo";

interface Message {
  id: number;
  type: "user" | "ai";
  content: string;
}

// todo: remove mock functionality
const mockDestinations = [
  { name: "Kodaikanal Lake", duration: "2 hours", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&h=150&fit=crop" },
  { name: "Coaker's Walk", duration: "1 hour", image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&h=150&fit=crop" },
  { name: "Pillar Rocks", duration: "3 hours", image: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200&h=150&fit=crop" },
];

const mockItinerary = [
  { day: 1, title: "Lake & Gardens", activities: ["Kodaikanal Lake", "Bryant Park", "Sunset Point"] },
  { day: 2, title: "Viewpoints Tour", activities: ["Coaker's Walk", "Pillar Rocks", "Green Valley"] },
  { day: 3, title: "Nature Trails", activities: ["Pine Forest", "Silver Cascade", "Local Markets"] },
];

export default function TripPlanningDemo() {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, type: "ai", content: "Welcome to Kodaikanal! I'm Aari, your friendly travel planner. I can explore tours, plan trips & book cab services. How can I help you today?" },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [selectedDestination, setSelectedDestination] = useState(mockDestinations[0]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    const userMessage: Message = { id: Date.now(), type: "user", content: inputValue };
    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setIsTyping(true);

    // todo: remove mock functionality - simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: Date.now() + 1,
        type: "ai",
        content: `Great choice! I've found some amazing options for "${inputValue}" in Kodaikanal. Would you like to see available tours, or should I create a personalized itinerary based on your preferences?`,
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-background via-background to-muted/30" id="features">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <Badge variant="secondary" className="mb-4">
            <Sparkles className="w-3 h-3 mr-1" />
            Interactive Demo
          </Badge>
          <h2 className="text-3xl lg:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent">
              Plan Your Trip with Aari
            </span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Chat naturally with Aari to discover destinations, build itineraries, 
            and get personalized recommendations.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6 lg:p-8 flex flex-col h-[500px] border-primary/20 bg-gradient-to-br from-card to-card/80">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <AariLogo size={20} className="text-primary-foreground" />
                </div>
                <span className="font-semibold text-foreground">Aari Chat</span>
                <Badge variant="secondary" className="text-xs">BETA</Badge>
                <Hint text="Type your dream destination or travel preferences. Aari will suggest personalized itineraries!" delay={3000} />
              </div>

              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                <AnimatePresence>
                  {messages.map((message, idx) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.3, delay: idx * 0.05 }}
                      className={`flex gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        message.type === "ai" 
                          ? "bg-gradient-to-br from-primary to-primary/60" 
                          : "bg-gradient-to-br from-secondary to-secondary/60"
                      }`}>
                        {message.type === "ai" ? (
                          <AariLogo size={16} className="text-primary-foreground" />
                        ) : (
                          <User className="w-4 h-4 text-secondary-foreground" />
                        )}
                      </div>
                      <motion.div 
                        whileHover={{ scale: 1.01 }}
                        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                          message.type === "ai" 
                            ? "bg-secondary text-secondary-foreground rounded-tl-sm" 
                            : "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground rounded-tr-sm"
                        }`}
                      >
                        <p className="text-sm" data-testid={`text-message-${message.id}`}>{message.content}</p>
                      </motion.div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                
                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                      <AariLogo size={16} className="text-primary-foreground" />
                    </div>
                    <div className="bg-secondary rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <motion.span 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                        <motion.span 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                        <motion.span 
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                          className="w-2 h-2 bg-muted-foreground rounded-full"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Try: 'Show available tours'"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  className="flex-1 bg-background/50"
                  data-testid="input-chat"
                />
                <Button 
                  onClick={handleSend} 
                  size="icon" 
                  className="bg-gradient-to-r from-primary to-primary/80"
                  data-testid="button-send"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <Card className="p-6 border-primary/20 bg-gradient-to-br from-card to-card/80">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <span className="font-semibold text-foreground">Popular Destinations</span>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {mockDestinations.map((dest, idx) => (
                  <motion.button
                    key={dest.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ scale: 1.05, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedDestination(dest)}
                    className={`relative rounded-xl overflow-hidden aspect-[4/3] group ${
                      selectedDestination.name === dest.name ? "ring-2 ring-primary" : ""
                    }`}
                    data-testid={`button-destination-${dest.name.split(" ")[0].toLowerCase()}`}
                  >
                    <img 
                      src={dest.image} 
                      alt={dest.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-2">
                      <p className="text-xs font-medium text-white truncate">{dest.name}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </Card>

            <Card className="p-6 border-primary/20 bg-gradient-to-br from-card to-card/80">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-primary" />
                  <span className="font-semibold text-foreground">Sample Itinerary</span>
                </div>
                <Badge variant="outline" className="bg-gradient-to-r from-primary/10 to-transparent">3 days</Badge>
              </div>
              <div className="space-y-4">
                {mockItinerary.map((day, idx) => (
                  <motion.div
                    key={day.day}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: idx * 0.15 }}
                    className="flex gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center"
                      >
                        <span className="text-sm font-bold text-primary">{day.day}</span>
                      </motion.div>
                      {idx < mockItinerary.length - 1 && (
                        <div className="w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <h4 className="font-medium text-foreground mb-1">{day.title}</h4>
                      <div className="flex flex-wrap gap-2">
                        {day.activities.map((activity, actIdx) => (
                          <motion.div
                            key={activity}
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 * actIdx + 0.2 * idx }}
                          >
                            <Badge variant="secondary" className="text-xs">
                              <Clock className="w-3 h-3 mr-1" />
                              {activity}
                            </Badge>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
