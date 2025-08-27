import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ShoppingCart, Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { cn } from "@/lib/utils";

interface CartDrawerProps {
  className?: string;
}

export function CartDrawer({ className }: CartDrawerProps) {
  const { items, itemCount, total, updateQuantity, removeFromCart } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  const subtotal = total;
  const shipping = total >= 100 ? 0 : 9.99;
  const tax = total * 0.08;
  const finalTotal = subtotal + shipping + tax;

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={cn("relative p-2 hover:bg-secondary rounded-full transition-colors", className)}
          data-testid="button-cart-drawer"
        >
          <ShoppingCart className="h-5 w-5" />
          {itemCount > 0 && (
            <Badge className="cart-badge absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium p-0 min-w-[1.25rem]">
              {itemCount > 99 ? "99+" : itemCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:w-96 flex flex-col">
        <SheetHeader>
          <SheetTitle>Shopping Cart</SheetTitle>
          <p className="text-sm text-muted-foreground">
            {itemCount} {itemCount === 1 ? "item" : "items"} in your cart
          </p>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16">
            <ShoppingBag className="h-16 w-16 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Add some products to get started!
            </p>
            <Link href="/products">
              <Button onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto space-y-4 py-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 bg-secondary/30 rounded-lg" data-testid={`cart-drawer-item-${item.id}`}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                  />
                  
                  <div className="flex-1 min-w-0">
                    <Link href={`/products/${item.product.id}`}>
                      <h4 className="font-medium text-sm line-clamp-1 hover:text-accent transition-colors">
                        {item.product.name}
                      </h4>
                    </Link>
                    <p className="text-xs text-muted-foreground">{item.product.category}</p>
                    <p className="text-sm font-semibold text-accent mt-1">
                      ${parseFloat(item.product.price).toFixed(2)}
                    </p>
                    
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2 mt-2">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        data-testid={`button-decrease-drawer-${item.id}`}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm font-medium w-8 text-center" data-testid={`text-quantity-drawer-${item.id}`}>
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        data-testid={`button-increase-drawer-${item.id}`}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end space-y-2">
                    <p className="text-sm font-bold">
                      ${(parseFloat(item.product.price) * item.quantity).toFixed(2)}
                    </p>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive hover:text-destructive"
                      onClick={() => removeFromCart(item.productId)}
                      data-testid={`button-remove-drawer-${item.id}`}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Cart Summary */}
            <div className="space-y-4 py-4">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span data-testid="text-drawer-subtotal">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span className={cn(
                    shipping === 0 ? "text-green-600" : "text-foreground"
                  )}>
                    {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span data-testid="text-drawer-total">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              {total < 100 && (
                <div className="bg-accent/10 p-3 rounded-lg">
                  <p className="text-xs text-accent">
                    Add ${(100 - total).toFixed(2)} more to get free shipping!
                  </p>
                </div>
              )}

              <div className="space-y-2">
                <Link href="/checkout">
                  <Button
                    className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                    onClick={() => setIsOpen(false)}
                    data-testid="button-drawer-checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </Link>
                
                <Link href="/cart">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setIsOpen(false)}
                    data-testid="button-drawer-view-cart"
                  >
                    View Cart
                  </Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}

export default CartDrawer;
