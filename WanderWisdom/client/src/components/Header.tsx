import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";
import AariLogo from "./AariLogo";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isMobileOrTablet = useIsMobileOrTablet();

  // 1. LOCK SCROLL WHEN MENU IS OPEN
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"; // Disable scrolling
    } else {
      document.body.style.overflow = "unset"; // Enable scrolling
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isMobileMenuOpen]);

  const navItems = [
    { label: "Popular Trips", href: "#popular-trips" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "About", href: "#about" },
  ];

  const headerProps = isMobileOrTablet 
    ? {} 
    : {
        initial: { y: -100, opacity: 0 },
        animate: { y: 0, opacity: 1 },
        transition: { duration: 0.6, ease: "easeOut" }
      };

  const logoProps = isMobileOrTablet 
    ? {} 
    : {
        whileHover: { rotate: 360 },
        transition: { duration: 0.6 }
      };

  return (
    <motion.header 
      {...headerProps}
      // Added 'border-b-0' when menu is open to blend better, optional.
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-200 ${
        isMobileMenuOpen ? "bg-background" : "bg-background/80 backdrop-blur-md border-b border-border/50"
      }`}
    >
      {/* HEADER CONTENT (Logo, Desktop Nav, Toggle Button) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-50">
        <div className="flex items-center justify-between h-16 gap-4">
          <a href="#" className="flex items-center gap-2 group" data-testid="link-logo">
            <motion.div 
              {...logoProps}
              className="text-foreground"
            >
              <AariLogo size={36} />
            </motion.div>
            <span className="text-lg sm:text-xl font-bold text-foreground">Aari</span>
            <Badge variant="secondary" className="text-xs hidden sm:inline-flex">BETA</Badge>
          </a>

          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navItems.map((item, idx) => {
              const linkProps = isMobileOrTablet 
                ? {} 
                : {
                    initial: { opacity: 0, y: -10 },
                    animate: { opacity: 1, y: 0 },
                    transition: { delay: 0.1 * idx }
                  };
              return (
                <motion.a
                  key={item.label}
                  href={item.href}
                  {...linkProps}
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium relative group"
                  data-testid={`link-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                >
                  {item.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-primary/50 group-hover:w-full transition-all duration-300" />
                </motion.a>
              );
            })}
          </nav>

          <div className="hidden lg:flex items-center gap-3">
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
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            data-testid="button-mobile-menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* 2. THE BACKDROP OVERLAY 
               - fixed: Stick to viewport
               - top-16: Start exactly below the header (64px)
               - bottom-0: Go all the way down to cover the page
               - z-[49]: Sit on top of everything else, but below the Menu Content
            */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed top-16 left-0 right-0 bottom-0 bg-black/60 backdrop-blur-sm z-[49] lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)} 
            />

            {/* 3. THE MENU CONTENT */}
            <motion.div
              initial={isMobileOrTablet ? {} : { opacity: 0, height: 0 }}
              animate={isMobileOrTablet ? {} : { opacity: 1, height: "auto" }}
              exit={isMobileOrTablet ? {} : { opacity: 0, height: 0 }}
              transition={isMobileOrTablet ? {} : { duration: 0.3 }}
              className="lg:hidden bg-background border-b border-border absolute top-16 left-0 right-0 z-50 shadow-xl"
            >
              <div className="px-4 sm:px-6 py-4 space-y-4">
                {navItems.map((item, idx) => {
                  const linkProps = isMobileOrTablet 
                    ? {} 
                    : {
                        initial: { opacity: 0, x: -20 },
                        animate: { opacity: 1, x: 0 },
                        transition: { delay: 0.05 * idx }
                      };
                  return (
                    <motion.a
                      key={item.label}
                      href={item.href}
                      {...linkProps}
                      className="block text-muted-foreground hover:text-foreground transition-colors font-medium text-lg py-2"
                      data-testid={`link-mobile-nav-${item.label.toLowerCase().replace(" ", "-")}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </motion.a>
                  );
                })}
                <div className="flex flex-col gap-2 pt-4 border-t border-border">
                  <Button size="lg" className="w-full" data-testid="button-mobile-get-started">
                    Get Started
                  </Button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}