import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Search, User, Menu, X } from "lucide-react";
import DynamicNavigation from "@/components/DynamicNavigation";
import HamburgerMenuOverlay from "@/components/HamburgerMenuOverlay";
import CartDrawer from "@/components/CartDrawer";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location, setLocation] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navigationLinks = [
    { id: "home", label: "Home", href: "/" },
    { id: "products", label: "Products", href: "/products" },
    { id: "categories", label: "Categories", href: "/products?category=all" },
    { id: "deals", label: "Deals", href: "/products?featured=true" },
  ];

  const mobileMenuItems = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products" },
    { label: "Categories", href: "/products?category=all" },
    { label: "Deals", href: "/products?featured=true" },
    { label: "Cart", href: "/cart" },
  ];

  const handleLinkClick = (id: string) => {
    const link = navigationLinks.find(l => l.id === id);
    if (link) {
      if (link.href.startsWith("/#")) {
        // Handle anchor links for home page sections
        const element = document.querySelector(link.href.substring(2));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Navigate to the page using router
        setLocation(link.href);
      }
    }
  };

  const activeLink = 
    location === "/" ? "home" :
    location.startsWith("/products") ? "products" :
    location.startsWith("/categories") ? "categories" :
    location.startsWith("/deals") ? "deals" :
    "";

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled ? "bg-background/95 backdrop-blur-md border-b border-border shadow-sm" : "bg-background/80 backdrop-blur-md border-b border-border"
      )}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-8">
              {/* Logo */}
              <Link href="/">
                <div className="text-2xl font-bold text-primary flex items-center cursor-pointer">
                  <i className="fas fa-bolt text-accent mr-2"></i>
                  TechStore
                </div>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:block">
                <DynamicNavigation
                  links={navigationLinks}
                  backgroundColor="hsl(0, 0%, 100% / 0.5)"
                  textColor="hsl(215.4, 16.3%, 46.9%)"
                  highlightColor="hsl(24.6, 95%, 53.1% / 0.1)"
                  glowIntensity={3}
                  className="border border-border/50"
                  activeLink={activeLink}
                  onLinkClick={handleLinkClick}
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="hidden sm:flex relative">
                <input
                  type="search"
                  placeholder="Search products..."
                  className="w-64 px-4 py-2 pr-10 bg-secondary border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
                  data-testid="input-header-search"
                />
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>

              {/* Cart */}
              <CartDrawer />

              {/* User Account */}
              <Button
                variant="ghost"
                size="icon"
                className="p-2 hover:bg-secondary rounded-full transition-colors"
                data-testid="button-user-account"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* Mobile Menu */}
              <div className="md:hidden">
                <HamburgerMenuOverlay
                  items={mobileMenuItems}
                  buttonTop="32px"
                  buttonLeft="auto"
                  buttonSize="md"
                  buttonColor="hsl(24.6, 95%, 53.1%)"
                  overlayBackground="hsl(24.6, 95%, 53.1%)"
                  textColor="#ffffff"
                  fontSize="md"
                  fontFamily='"Inter", sans-serif'
                  fontWeight="medium"
                  animationDuration={0.8}
                  staggerDelay={0.1}
                  menuAlignment="left"
                  className="relative"
                  buttonClassName="relative"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-primary text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-2xl font-bold mb-4 flex items-center">
                <i className="fas fa-bolt text-accent mr-2"></i>
                TechStore
              </div>
              <p className="text-sm opacity-80 mb-4">
                Your trusted partner for premium electronics and cutting-edge technology.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground hover:bg-accent/90 transition-colors">
                  <i className="fab fa-facebook-f text-sm"></i>
                </a>
                <a href="#" className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground hover:bg-accent/90 transition-colors">
                  <i className="fab fa-twitter text-sm"></i>
                </a>
                <a href="#" className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-accent-foreground hover:bg-accent/90 transition-colors">
                  <i className="fab fa-instagram text-sm"></i>
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><Link href="/" className="hover:text-accent transition-colors">Home</Link></li>
                <li><Link href="/products" className="hover:text-accent transition-colors">Products</Link></li>
                <li><Link href="/products?category=all" className="hover:text-accent transition-colors">Categories</Link></li>
                <li><Link href="/products?featured=true" className="hover:text-accent transition-colors">Deals</Link></li>
                <li><a href="#" className="hover:text-accent transition-colors">About Us</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Customer Service</h3>
              <ul className="space-y-2 text-sm opacity-80">
                <li><a href="#" className="hover:text-accent transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Shipping Info</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Returns</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">FAQ</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Support</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
              <div className="space-y-2 text-sm opacity-80">
                <p><i className="fas fa-map-marker-alt mr-2"></i>123 Tech Street, Digital City</p>
                <p><i className="fas fa-phone mr-2"></i>+1 (555) 123-4567</p>
                <p><i className="fas fa-envelope mr-2"></i>hello@techstore.com</p>
              </div>
            </div>
          </div>

          <div className="border-t border-primary-foreground/20 mt-12 pt-8 text-center text-sm opacity-60">
            <p>&copy; 2024 TechStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
