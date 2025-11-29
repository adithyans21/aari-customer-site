import { useState, useRef, useEffect } from "react";
import { HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface HintProps {
  text: string;
  delay?: number;
  children?: React.ReactNode;
}

export default function Hint({ text, delay = 2000, children }: HintProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [showFromHover, setShowFromHover] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const handleMouseEnter = () => {
    setShowFromHover(true);
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  };

  const handleMouseLeave = () => {
    setShowFromHover(false);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  const handleIconClick = () => {
    setIsVisible(!isVisible);
  };

  return (
    <div 
      ref={containerRef}
      className="relative inline-flex items-center gap-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      <button
        onClick={handleIconClick}
        className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
        data-testid="button-hint-toggle"
        aria-label="Show hint"
      >
        <HelpCircle className="w-4 h-4" />
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 top-full mt-2 z-50 max-w-xs bg-card border border-card-border rounded-lg shadow-lg p-3"
          >
            <div className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-card-border" />
            <div className="absolute -top-[7px] left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-transparent border-b-card" />
            <p className="text-sm text-muted-foreground" data-testid="text-hint-content">{text}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
