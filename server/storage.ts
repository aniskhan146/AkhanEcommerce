import { type Category, type Product, type CartItem, type InsertCategory, type InsertProduct, type InsertCartItem, type CartItemWithProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryById(id: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;

  // Products
  getProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getFeaturedProducts(): Promise<Product[]>;
  getProductById(id: string): Promise<Product | undefined>;
  searchProducts(query: string): Promise<Product[]>;
  createProduct(product: InsertProduct): Promise<Product>;

  // Cart
  getCartItems(sessionId: string): Promise<CartItemWithProduct[]>;
  addToCart(item: InsertCartItem): Promise<CartItem>;
  updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(sessionId: string, productId: string): Promise<void>;
  clearCart(sessionId: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize categories
    const categories = [
      { name: "Laptops", icon: "fas fa-laptop", productCount: 25 },
      { name: "Smartphones", icon: "fas fa-mobile-alt", productCount: 18 },
      { name: "Audio", icon: "fas fa-headphones", productCount: 12 },
      { name: "Gaming", icon: "fas fa-gamepad", productCount: 15 },
    ];

    categories.forEach(cat => {
      const category: Category = { ...cat, id: randomUUID() };
      this.categories.set(category.id, category);
    });

    // Initialize products
    const products = [
      {
        name: "MacBook Pro 14\" M2 Chip",
        description: "Supercharged by M2 Pro or M2 Max chip. Up to 22 hours of battery life.",
        price: "1999.00",
        originalPrice: "2349.00",
        image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Laptops",
        rating: "4.8",
        featured: true,
        discount: 15,
        badge: "15% OFF"
      },
      {
        name: "iPhone 15 Pro Max",
        description: "Titanium. So strong. So light. So Pro. A17 Pro chip with advanced features.",
        price: "1199.00",
        image: "https://images.unsplash.com/photo-1556656793-08538906a9f8?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Smartphones",
        rating: "4.9",
        featured: true,
        badge: "NEW"
      },
      {
        name: "Sony WH-1000XM5",
        description: "Industry-leading noise cancellation with premium sound quality.",
        price: "399.00",
        originalPrice: "449.00",
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        rating: "4.7",
        featured: true,
        discount: 11
      },
      {
        name: "PlayStation 5 Console",
        description: "Experience lightning-fast loading with an ultra-high speed SSD.",
        price: "499.00",
        image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Gaming",
        rating: "4.8",
        featured: true,
        badge: "HOT"
      },
      {
        name: "Dell XPS 13 Plus",
        description: "Ultra-thin laptop with stunning 13.4-inch display and 12th Gen Intel processors.",
        price: "1299.00",
        image: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Laptops",
        rating: "4.6",
        inStock: true
      },
      {
        name: "Samsung Galaxy S24 Ultra",
        description: "Most advanced Galaxy phone with S Pen and professional-grade cameras.",
        price: "1099.00",
        image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Smartphones",
        rating: "4.7",
        inStock: true
      }
    ];

    products.forEach(prod => {
      const product: Product = { 
        ...prod, 
        id: randomUUID(),
        inStock: true,
        featured: prod.featured || false,
        discount: prod.discount || 0,
        badge: prod.badge || null
      };
      this.products.set(product.id, product);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values());
  }

  async getCategoryById(id: string): Promise<Category | undefined> {
    return this.categories.get(id);
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = randomUUID();
    const category: Category = { ...insertCategory, id, productCount: 0 };
    this.categories.set(id, category);
    return category;
  }

  async getProducts(): Promise<Product[]> {
    return Array.from(this.products.values());
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getFeaturedProducts(): Promise<Product[]> {
    return Array.from(this.products.values()).filter(
      (product) => product.featured
    );
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async searchProducts(query: string): Promise<Product[]> {
    const searchTerm = query.toLowerCase();
    return Array.from(this.products.values()).filter(
      (product) =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
  }

  async createProduct(insertProduct: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const product: Product = { 
      ...insertProduct, 
      id,
      inStock: insertProduct.inStock ?? true,
      featured: insertProduct.featured ?? false,
      discount: insertProduct.discount ?? 0
    };
    this.products.set(id, product);
    return product;
  }

  async getCartItems(sessionId: string): Promise<CartItemWithProduct[]> {
    const items = Array.from(this.cartItems.values()).filter(
      (item) => item.sessionId === sessionId
    );
    
    return items.map(item => ({
      ...item,
      product: this.products.get(item.productId)!
    })).filter(item => item.product);
  }

  async addToCart(insertItem: InsertCartItem): Promise<CartItem> {
    // Check if item already exists in cart
    const existingItem = Array.from(this.cartItems.values()).find(
      item => item.sessionId === insertItem.sessionId && item.productId === insertItem.productId
    );

    if (existingItem) {
      // Update quantity
      existingItem.quantity += insertItem.quantity;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      createdAt: new Date()
    };
    this.cartItems.set(id, cartItem);
    return cartItem;
  }

  async updateCartItemQuantity(sessionId: string, productId: string, quantity: number): Promise<CartItem | undefined> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.productId === productId
    );

    if (item) {
      if (quantity <= 0) {
        this.cartItems.delete(item.id);
        return undefined;
      }
      item.quantity = quantity;
      this.cartItems.set(item.id, item);
      return item;
    }

    return undefined;
  }

  async removeFromCart(sessionId: string, productId: string): Promise<void> {
    const item = Array.from(this.cartItems.values()).find(
      item => item.sessionId === sessionId && item.productId === productId
    );

    if (item) {
      this.cartItems.delete(item.id);
    }
  }

  async clearCart(sessionId: string): Promise<void> {
    const itemsToDelete = Array.from(this.cartItems.values()).filter(
      item => item.sessionId === sessionId
    );

    itemsToDelete.forEach(item => {
      this.cartItems.delete(item.id);
    });
  }
}

export const storage = new MemStorage();
