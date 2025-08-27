import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Category } from "@shared/schema";

interface CategoryDropdownProps {
  className?: string;
  isActive?: boolean;
}

export default function CategoryDropdown({ className, isActive }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [, setLocation] = useLocation();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleCategoryClick = (href: string, e: React.MouseEvent) => {
    e.preventDefault();
    setIsOpen(false);
    setLocation(href);
  };

  return (
    <div 
      className={cn("relative", className)}
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      {/* Categories Button */}
      <button
        className={cn(
          "flex items-center gap-1 h-8 md:h-8 text-xs md:text-sm rounded-full font-medium transition-all duration-300 hover:scale-105 px-4",
          isActive && "font-semibold"
        )}
        data-testid="button-categories-dropdown"
      >
        <span>Categories</span>
        <ChevronDown 
          className={cn(
            "h-3 w-3 transition-transform duration-200",
            isOpen && "rotate-180"
          )} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-background border border-border rounded-xl shadow-lg backdrop-blur-md z-50 overflow-hidden">
          <div className="p-2">
            <div className="mb-2 px-3 py-2 text-sm font-semibold text-muted-foreground border-b border-border">
              Shop by Category
            </div>
            <div className="space-y-1">
              {/* All Categories Link */}
              <div 
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer group"
                onClick={(e) => handleCategoryClick("/products", e)}
                data-testid="category-all-products"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                  <i className="fas fa-th-large text-white text-sm"></i>
                </div>
                <div>
                  <div className="font-medium text-sm group-hover:text-accent transition-colors">
                    All Products
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Browse everything
                  </div>
                </div>
              </div>
              
              {/* Individual Categories */}
              {categories.map((category) => (
                <div 
                  key={category.id}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-secondary transition-colors cursor-pointer group"
                  onClick={(e) => handleCategoryClick(`/products?category=${encodeURIComponent(category.name)}`, e)}
                  data-testid={`category-${category.name.toLowerCase()}`}
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/70 rounded-lg flex items-center justify-center">
                    <i className={cn(category.icon, "text-white text-sm")}></i>
                  </div>
                  <div>
                    <div className="font-medium text-sm group-hover:text-accent transition-colors">
                      {category.name}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {category.productCount}+ Products
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}