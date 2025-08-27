import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

export default function Cart() {
  const { items, isLoading, itemCount, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-300 rounded w-48"></div>
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex space-x-4 p-6 bg-card rounded-lg">
                <div className="w-20 h-20 bg-gray-300 rounded"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background pt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <ShoppingBag className="h-24 w-24 mx-auto text-muted-foreground mb-6" />
            <h1 className="text-4xl font-bold mb-4">Your Cart is Empty</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Add some products to your cart to get started!
            </p>
            <Link href="/products">
              <Button className="px-8 py-3 bg-accent text-accent-foreground rounded-full font-semibold text-lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Shopping Cart</h1>
            <p className="text-muted-foreground">
              {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
            </p>
          </div>
          {items.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-destructive hover:text-destructive"
              data-testid="button-clear-cart"
            >
              Clear Cart
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <Card key={item.id} className="overflow-hidden" data-testid={`cart-item-${item.id}`}>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    {/* Product Image */}
                    <div className="flex-shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-lg"
                        data-testid={`img-cart-item-${item.id}`}
                      />
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <Link href={`/products/${item.product.id}`}>
                        <h3 className="font-semibold text-lg hover:text-accent transition-colors line-clamp-1">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.product.category}</p>
                      <p className="text-lg font-bold text-accent mt-1">
                        ${parseFloat(item.product.price).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="h-8 w-8"
                        data-testid={`button-decrease-${item.id}`}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="text-lg font-semibold w-12 text-center" data-testid={`text-quantity-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="h-8 w-8"
                        data-testid={`button-increase-${item.id}`}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Item Total */}
                    <div className="text-right">
                      <p className="text-lg font-bold">
                        ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFromCart(item.productId)}
                        className="text-destructive hover:text-destructive mt-2"
                        data-testid={`button-remove-${item.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})</span>
                    <span data-testid="text-subtotal">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span className={cn(
                      total >= 100 ? "text-green-600" : "text-foreground"
                    )}>
                      {total >= 100 ? "FREE" : "$9.99"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(total * 0.08).toFixed(2)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span data-testid="text-total">
                      ${(total + (total >= 100 ? 0 : 9.99) + total * 0.08).toFixed(2)}
                    </span>
                  </div>
                </div>

                {total < 100 && (
                  <div className="bg-accent/10 p-3 rounded-lg">
                    <p className="text-sm text-accent">
                      Add ${(100 - total).toFixed(2)} more to get free shipping!
                    </p>
                  </div>
                )}

                <Link href="/checkout">
                  <Button className="w-full py-3 bg-accent text-accent-foreground rounded-lg font-semibold hover:bg-accent/90 transition-colors text-lg" data-testid="button-checkout">
                    Proceed to Checkout
                  </Button>
                </Link>

                <Link href="/products">
                  <Button variant="outline" className="w-full" data-testid="button-continue-shopping">
                    Continue Shopping
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
