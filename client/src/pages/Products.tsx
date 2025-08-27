import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Heart, ShoppingCart, Search } from "lucide-react";
import type { Product, Category } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Products() {
  const [location, setLocation] = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("");
  const { addToCart, isAddingToCart } = useCart();

  // Parse URL parameters
  useEffect(() => {
    const params = new URLSearchParams(location.split("?")[1] || "");
    const category = params.get("category") || "";
    const search = params.get("search") || "";
    
    setSelectedCategory(category);
    setSearchTerm(search);
  }, [location]);

  const { data: products = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products", selectedCategory, searchTerm],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (selectedCategory) params.append("category", selectedCategory);
      if (searchTerm) params.append("search", searchTerm);
      
      const response = await fetch(`/api/products?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch products");
      return response.json();
    },
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.append("search", searchTerm);
    if (selectedCategory) params.append("category", selectedCategory);
    
    setLocation(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const handleCategoryChange = (category: string) => {
    const actualCategory = category === "all" ? "" : category;
    setSelectedCategory(actualCategory);
    const params = new URLSearchParams();
    if (actualCategory) params.append("category", actualCategory);
    if (searchTerm) params.append("search", searchTerm);
    
    setLocation(`/products${params.toString() ? `?${params.toString()}` : ""}`);
  };

  const sortedProducts = [...products].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return parseFloat(a.price) - parseFloat(b.price);
      case "price-high":
        return parseFloat(b.price) - parseFloat(a.price);
      case "name":
        return a.name.localeCompare(b.name);
      case "rating":
        return parseFloat(b.rating || "0") - parseFloat(a.rating || "0");
      case "default":
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Products</h1>
          <p className="text-xl text-muted-foreground">
            {selectedCategory
              ? `Browse ${selectedCategory} products`
              : searchTerm
              ? `Search results for "${searchTerm}"`
              : "Discover our complete product catalog"}
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>
            <Button type="submit" data-testid="button-search">
              Search
            </Button>
          </form>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-4">
            <Select value={selectedCategory || "all"} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-48" data-testid="select-category">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.name}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-48" data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-6">
          <p className="text-muted-foreground">
            {productsLoading ? "Loading..." : `${sortedProducts.length} products found`}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {productsLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg overflow-hidden animate-pulse">
                <div className="h-48 bg-gray-300"></div>
                <div className="p-6 space-y-2">
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-6 bg-gray-300 rounded"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                  <div className="h-10 bg-gray-300 rounded"></div>
                </div>
              </div>
            ))
          ) : sortedProducts.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <h3 className="text-2xl font-semibold mb-4">No products found</h3>
              <p className="text-muted-foreground mb-6">
                Try adjusting your search or filters to find what you're looking for.
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setLocation("/products");
                }}
                data-testid="button-clear-filters"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            sortedProducts.map((product) => (
              <Card
                key={product.id}
                className="product-card bg-card rounded-2xl shadow-lg overflow-hidden border border-border group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                data-testid={`product-card-${product.id}`}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {product.badge && (
                    <div className="absolute top-4 left-4">
                      <Badge
                        className={cn(
                          "px-3 py-1 text-sm font-semibold",
                          product.badge === "NEW" && "bg-green-500 text-white",
                          product.badge === "HOT" && "bg-red-500 text-white",
                          product.badge?.includes("OFF") && "bg-accent text-accent-foreground"
                        )}
                      >
                        {product.badge}
                      </Badge>
                    </div>
                  )}
                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Button
                      variant="secondary"
                      size="icon"
                      className="bg-white/90 hover:bg-white"
                      data-testid={`button-favorite-${product.id}`}
                    >
                      <Heart className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{product.category}</span>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium ml-1">{product.rating}</span>
                    </div>
                  </div>
                  
                  <Link href={`/products/${product.id}`}>
                    <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-bold text-accent">
                        ${parseFloat(product.price).toFixed(2)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through ml-2">
                          ${parseFloat(product.originalPrice).toFixed(2)}
                        </span>
                      )}
                    </div>
                    <Button
                      onClick={() => handleAddToCart(product.id)}
                      disabled={isAddingToCart}
                      className="px-4 py-2 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transform hover:scale-105 transition-all duration-200"
                      data-testid={`button-add-to-cart-${product.id}`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
