import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Heart, ShoppingCart } from "lucide-react";
import WaveBackground from "@/components/WaveBackground";
import type { Product, Category } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Home() {
  const { addToCart, isAddingToCart } = useCart();

  const { data: allProducts = [], isLoading: productsLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  // Select only 6 featured products for home page
  const featuredProducts = allProducts.slice(0, 6);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const handleAddToCart = (productId: string) => {
    addToCart(productId);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen relative">
      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <WaveBackground backdropBlurAmount="sm" className="absolute inset-0" />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" />
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in">
            <span className="text-foreground">Premium</span>
            <span className="text-accent block mt-2">Electronics</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up">
            Discover the latest technology and gadgets with unbeatable prices and quality
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
            <Button
              onClick={() => scrollToSection("products")}
              className="px-8 py-4 bg-accent text-accent-foreground rounded-full font-semibold text-lg hover:bg-accent/90 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
              data-testid="button-shop-now"
            >
              Shop Now
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("categories")}
              className="px-8 py-4 border-2 border-foreground text-foreground rounded-full font-semibold text-lg hover:bg-foreground hover:text-background transition-all duration-200"
              data-testid="button-explore-categories"
            >
              Explore Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-xl text-muted-foreground">Find exactly what you're looking for</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categoriesLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl p-6 animate-pulse">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-300 rounded-2xl"></div>
                  <div className="h-6 bg-gray-300 rounded mb-2"></div>
                  <div className="h-4 bg-gray-300 rounded"></div>
                </div>
              ))
            ) : (
              categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${encodeURIComponent(category.name)}`}
                >
                  <Card className="category-chip group cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <CardContent className="p-6 text-center">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-accent/70 rounded-2xl flex items-center justify-center text-2xl text-white">
                        <i className={category.icon}></i>
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                      <p className="text-sm text-muted-foreground">{category.productCount}+ Products</p>
                    </CardContent>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-4xl font-bold mb-4">Selected Products</h2>
              <p className="text-xl text-muted-foreground">Handpicked premium items for you</p>
            </div>
            
            <Link href="/products">
              <Button variant="outline" className="px-6 py-2">
                View All Products
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {productsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
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
            ) : (
              featuredProducts.map((product) => (
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

          <div className="text-center mt-12">
            <Link href="/products">
              <Button
                variant="outline"
                className="px-8 py-3 border-2 border-accent text-accent hover:bg-accent hover:text-accent-foreground rounded-full font-semibold transition-all duration-300"
                data-testid="button-view-all-products"
              >
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Deals Section */}
      <section id="deals" className="py-20 bg-gradient-to-r from-accent to-orange-600 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Limited Time Deals</h2>
            <p className="text-xl opacity-90">Don't miss out on these amazing offers</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">50% OFF</div>
                <div className="text-lg mb-4">Gaming Accessories</div>
                <div className="text-sm opacity-80 mb-4">Limited time offer on all gaming gear</div>
                <Button className="px-6 py-2 bg-white text-accent rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">Buy 2 Get 1</div>
                <div className="text-lg mb-4">Phone Cases</div>
                <div className="text-sm opacity-80 mb-4">Mix and match your favorite styles</div>
                <Button className="px-6 py-2 bg-white text-accent rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur-md border border-white/20">
              <CardContent className="p-6 text-center">
                <div className="text-4xl font-bold mb-2">Free Shipping</div>
                <div className="text-lg mb-4">Orders Over $100</div>
                <div className="text-sm opacity-80 mb-4">Fast delivery to your doorstep</div>
                <Button className="px-6 py-2 bg-white text-accent rounded-full font-semibold hover:bg-gray-100 transition-colors">
                  Shop Now
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-secondary/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Stay Updated</h2>
          <p className="text-xl text-muted-foreground mb-8">Get the latest deals and product releases delivered to your inbox</p>
          
          <div className="max-w-md mx-auto">
            <div className="flex gap-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
                data-testid="input-newsletter-email"
              />
              <Button
                className="px-6 py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors"
                data-testid="button-subscribe-newsletter"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
