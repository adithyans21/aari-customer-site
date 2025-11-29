import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import AariLogo from "./AariLogo";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { label: "Popular Trips", href: "#popular-trips" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  return (
    <motion.header 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="#" className="flex items-center gap-2 group" data-testid="link-logo">
            <motion.div 
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.6 }}
              className="text-foreground"
            >
              <AariLogo size={36} />
            </motion.div>
            <span className="text-xl font-bold text-foreground">Aari</span>
            <Badge variant="secondary" className="text-xs">BETA</Badge>
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item, idx) => (
              <motion.a
                key={item.label}
                href={item.href}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * idx }}
                className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative group"
                data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300" />
              </motion.a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" data-testid="button-login">
              Log in
            </Button>
            <Button 
              className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
              data-testid="button-get-started"
            >
              Get Started
            </Button>
          </div>

          <Button
            size="icon"
            variant="ghost"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-background border-b border-border"
          >
            <div className="px-6 py-4 space-y-4">
              {navItems.map((item, idx) => (
                <motion.a
                  key={item.label}
                  href={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  className="block text-muted-foreground hover:text-foreground transition-colors font-medium"
                  data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.label}
                </motion.a>
              ))}
              <div className="flex flex-col gap-2 pt-4 border-t border-border">
                <Button variant="ghost" className="justify-start" data-testid="button-mobile-login">
                  Log in
                </Button>
                <Button data-testid="button-mobile-get-started">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
