import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send, Check } from "lucide-react";
import { SiX, SiInstagram, SiFacebook, SiLinkedin } from "react-icons/si";
import { motion } from "framer-motion";
import { useIsMobileOrTablet } from "@/hooks/use-mobile";
import AariLogo from "./AariLogo";

const footerLinks = {
  product: [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "AI Assistant", href: "#" },
    { label: "Mobile App", href: "#" },
  ],
  resources: [
    { label: "Blog", href: "#" },
    { label: "Help Center", href: "#" },
    { label: "API Docs", href: "#" },
    { label: "Status", href: "#" },
  ],
  company: [
    { label: "About", href: "#about" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
    { label: "Partners", href: "#" },
  ],
  legal: [
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: SiX, href: "#", label: "Twitter" },
  { icon: SiInstagram, href: "#", label: "Instagram" },
  { icon: SiFacebook, href: "#", label: "Facebook" },
  { icon: SiLinkedin, href: "#", label: "LinkedIn" },
];

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubscribed, setIsSubscribed] = useState(false);
  const isMobileOrTablet = useIsMobileOrTablet();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail("");
      // todo: remove mock functionality
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const logoProps = isMobileOrTablet 
    ? {} 
    : {
        whileHover: { scale: 1.02 }
      };
  
  const logoIconProps = isMobileOrTablet 
    ? {} 
    : {
        whileHover: { rotate: 360 },
        transition: { duration: 0.6 }
      };

  return (
    <footer id="about" className="relative overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/20 to-muted/40" />
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 lg:gap-12">
          <div className="col-span-2 sm:col-span-2 md:col-span-3 lg:col-span-2">
            <motion.a 
              href="#" 
              className="flex items-center gap-2 mb-3 sm:mb-4"
              {...logoProps}
            >
              <motion.div
                {...logoIconProps}
                className="text-foreground"
              >
                <AariLogo size={isMobileOrTablet ? 32 : 36} />
              </motion.div>
              <span className="text-lg sm:text-xl font-bold text-foreground">Aari</span>
            </motion.a>
            <p className="text-muted-foreground text-xs leading-loose sm:leading-normal sm:text-sm mb-4 sm:mb-6 max-w-xs">
  Your AI-powered travel assistant for Kodaikanal. Plan tours, book cabs, and 
  discover personalized experiences effortlessly.
</p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-background/50 text-sm"
                data-testid="input-newsletter"
              />
              <Button 
                type="submit" 
                size="icon" 
                disabled={isSubscribed} 
                className="bg-gradient-to-r from-primary to-primary/80"
                data-testid="button-subscribe"
              >
                {isSubscribed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </form>
            {isSubscribed && (
              <motion.p 
                {...(isMobileOrTablet ? {} : {
                  initial: { opacity: 0, y: -10 },
                  animate: { opacity: 1, y: 0 }
                })}
                className="text-xs sm:text-sm text-primary mt-2"
              >
                Thanks for subscribing!
              </motion.p>
            )}
          </div>

          {Object.entries({
            Product: footerLinks.product,
            Resources: footerLinks.resources,
            Company: footerLinks.company,
            Legal: footerLinks.legal,
          }).map(([title, links], sectionIdx) => (
            <div key={title}>
              <h4 className="font-semibold text-sm sm:text-base text-foreground mb-3 sm:mb-4">{title}</h4>
              <ul className="space-y-2 sm:space-y-3">
                {links.map((link, idx) => {
                  const linkProps = isMobileOrTablet 
                    ? {} 
                    : {
                        initial: { opacity: 0, x: -10 },
                        whileInView: { opacity: 1, x: 0 },
                        viewport: { once: true },
                        transition: { delay: 0.05 * idx + 0.1 * sectionIdx }
                      };
                  
                  const spanProps = isMobileOrTablet 
                    ? {} 
                    : {
                        whileHover: { x: 4 }
                      };
                  
                  return (
                    <motion.li 
                      key={link.label}
                      {...linkProps}
                    >
                      <a
                        href={link.href}
                        className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors inline-block"
                        data-testid={`link-footer-${link.label.toLowerCase()}`}
                      >
                        <motion.span {...spanProps} className="inline-block">
                          {link.label}
                        </motion.span>
                      </a>
                    </motion.li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 pt-6 sm:pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            2024 Aari. All rights reserved.
          </p>
          <div className="flex items-center gap-3 sm:gap-4">
            {socialLinks.map((social, idx) => {
              const socialProps = isMobileOrTablet 
                ? {} 
                : {
                    initial: { opacity: 0, scale: 0 },
                    whileInView: { opacity: 1, scale: 1 },
                    viewport: { once: true },
                    transition: { delay: 0.1 * idx },
                    whileHover: { scale: 1.1, y: -2 }
                  };
              
              return (
                <motion.a
                  key={social.label}
                  href={social.href}
                  {...socialProps}
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg bg-gradient-to-br from-secondary to-secondary/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.label}
                  data-testid={`link-social-${social.label.toLowerCase()}`}
                >
                  <social.icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </motion.a>
              );
            })}
          </div>
        </div>

        <motion.p 
          {...(isMobileOrTablet ? {} : {
            initial: { opacity: 0 },
            whileInView: { opacity: 1 },
            viewport: { once: true }
          })}
          className="text-xs text-muted-foreground/60 text-center mt-4 sm:mt-6"
        >
          v1.0.10 | Aari operates exclusively in Kodaikanal, helping visitors plan experiences.
        </motion.p>
      </div>
    </footer>
  );
}
