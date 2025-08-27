import { useQuery } from "@tanstack/react-query";
import { useRoute, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star, Heart, ShoppingCart, ArrowLeft, Shield, Truck, RefreshCcw } from "lucide-react";
import type { Product } from "@shared/schema";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";
import { useState } from "react";

export default function ProductDetail() {
  const [, params] = useRoute("/products/:id");
  const productId = params?.id;
  const { addToCart, isAddingToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery<Product>({
    queryKey: ["/api/products", productId],
    enabled: !!productId,
  });

  const { data: relatedProducts = [] } = useQuery<Product[]>({
    queryKey: ["/api/products", { category: product?.category }],
    enabled: !!product?.category,
    select: (data) => data.filter((p) => p.id !== productId).slice(0, 4),
  });

  const handleAddToCart = () => {
    if (productId) {
      addToCart(productId, quantity);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-24 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="h-96 bg-gray-300 rounded-2xl"></div>
              <div className="space-y-4">
                <div className="h-8 bg-gray-300 rounded"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                <div className="h-16 bg-gray-300 rounded"></div>
                <div className="h-12 bg-gray-300 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
          <p className="text-xl text-muted-foreground mb-8">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/products">
            <Button>Browse All Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2" data-testid="button-back-to-products">
              <ArrowLeft className="h-4 w-4" />
              Back to Products
            </Button>
          </Link>
        </div>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Product Image */}
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-2xl shadow-lg"
              data-testid="img-product"
            />
            {product.badge && (
              <div className="absolute top-4 left-4">
                <Badge
                  className={cn(
                    "px-4 py-2 text-sm font-semibold",
                    product.badge === "NEW" && "bg-green-500 text-white",
                    product.badge === "HOT" && "bg-red-500 text-white",
                    product.badge?.includes("OFF") && "bg-accent text-accent-foreground"
                  )}
                >
                  {product.badge}
                </Badge>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{product.category}</span>
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-current" />
                  <span className="font-medium ml-1" data-testid="text-rating">{product.rating}</span>
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-4" data-testid="text-product-name">{product.name}</h1>
              <p className="text-lg text-muted-foreground" data-testid="text-product-description">
                {product.description}
              </p>
            </div>

            <div>
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-accent" data-testid="text-price">
                  ${parseFloat(product.price).toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through" data-testid="text-original-price">
                    ${parseFloat(product.originalPrice).toFixed(2)}
                  </span>
                )}
                {product.originalPrice && (
                  <Badge variant="destructive" className="text-sm">
                    {Math.round((1 - parseFloat(product.price) / parseFloat(product.originalPrice)) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quantity</label>
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  data-testid="button-decrease-quantity"
                >
                  -
                </Button>
                <span className="text-xl font-semibold w-12 text-center" data-testid="text-quantity">
                  {quantity}
                </span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(quantity + 1)}
                  data-testid="button-increase-quantity"
                >
                  +
                </Button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAddingToCart || !product.inStock}
                className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-lg"
                data-testid="button-add-to-cart"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                {product.inStock ? "Add to Cart" : "Out of Stock"}
              </Button>
              
              <Button
                variant="outline"
                className="w-full py-3"
                data-testid="button-add-to-wishlist"
              >
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-green-500" />
                <span className="text-sm">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="h-5 w-5 text-blue-500" />
                <span className="text-sm">Free Shipping on orders over $100</span>
              </div>
              <div className="flex items-center gap-3">
                <RefreshCcw className="h-5 w-5 text-orange-500" />
                <span className="text-sm">30-day return policy</span>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold mb-8">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Card
                  key={relatedProduct.id}
                  className="bg-card rounded-2xl shadow-lg overflow-hidden border border-border group hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                  data-testid={`related-product-${relatedProduct.id}`}
                >
                  <div className="relative overflow-hidden">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-36 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {relatedProduct.badge && (
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={cn(
                            "px-2 py-1 text-xs font-semibold",
                            relatedProduct.badge === "NEW" && "bg-green-500 text-white",
                            relatedProduct.badge === "HOT" && "bg-red-500 text-white",
                            relatedProduct.badge?.includes("OFF") && "bg-accent text-accent-foreground"
                          )}
                        >
                          {relatedProduct.badge}
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs text-muted-foreground">{relatedProduct.category}</span>
                      <div className="flex items-center">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="text-xs font-medium ml-1">{relatedProduct.rating}</span>
                      </div>
                    </div>
                    
                    <Link href={`/products/${relatedProduct.id}`}>
                      <h3 className="font-semibold text-sm mb-2 line-clamp-2 hover:text-accent transition-colors">
                        {relatedProduct.name}
                      </h3>
                    </Link>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-accent">
                          ${parseFloat(relatedProduct.price).toFixed(2)}
                        </span>
                        {relatedProduct.originalPrice && (
                          <span className="text-xs text-muted-foreground line-through ml-1">
                            ${parseFloat(relatedProduct.originalPrice).toFixed(2)}
                          </span>
                        )}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => addToCart(relatedProduct.id)}
                        disabled={isAddingToCart}
                        className="px-3 py-1 text-xs bg-accent text-accent-foreground rounded hover:bg-accent/90 transition-colors"
                        data-testid={`button-add-to-cart-related-${relatedProduct.id}`}
                      >
                        <ShoppingCart className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
