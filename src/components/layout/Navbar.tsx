import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "motion/react";

const NAV_LINKS = [
  { name: "ГЛАВНАЯ", href: "/" },
  { name: "ИСТОРИЯ", href: "/story" },
  { name: "КОЛЛЕКЦИЯ", href: "/wines" },
  { name: "ВИНОГРАДНИКИ", href: "/vineyards" },
  { name: "ДЕГУСТАЦИЯ", href: "/tasting" },
  { name: "НОВОСТИ", href: "/news" },
  { name: "КОНТАКТЫ", href: "/contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHome = location.pathname === "/";
  const useDarkNav = !isHome || isScrolled || isOpen;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out pb-3",
          useDarkNav
            ? "bg-background/90 backdrop-blur-md border-b border-black/5"
            : "bg-transparent"
        )}
        style={{
          paddingTop: `calc(env(safe-area-inset-top, 0px) + ${useDarkNav ? "0.75rem" : "1rem"})`
        }}
      >
        <div className="container mx-auto px-4 md:px-8 lg:px-12 flex items-center justify-between gap-4">
          <Link
            to="/"
            className={cn(
              "font-serif transition-colors whitespace-nowrap shrink-0 text-xl lg:text-2xl",
              useDarkNav ? "text-foreground" : "text-white"
            )}
          >
            Wine Jet Абхазия
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-5 lg:space-x-8 xl:space-x-10">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={cn(
                  "text-[10px] lg:text-[11px] uppercase tracking-widest transition-colors relative group",
                  useDarkNav ? "text-foreground/70 hover:text-primary" : "text-white/80 hover:text-white"
                )}
              >
                {link.name}
                <span className="absolute -bottom-2 left-0 w-0 h-[1px] bg-current transition-all duration-300 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Mobile Toggle */}
          <button
            className={cn(
              "md:hidden transition-colors",
              useDarkNav ? "text-foreground" : "text-white"
            )}
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={28} strokeWidth={1} /> : <Menu size={28} strokeWidth={1} />}
          </button>
        </div>
      </header>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-background flex flex-col items-center justify-center pt-24"
          >
            <nav className="flex flex-col items-center space-y-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="text-2xl font-serif uppercase tracking-widest text-foreground hover:text-primary transition-colors"
                >
                  {link.name}
                </Link>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
