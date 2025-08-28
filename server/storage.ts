import { type Category, type Product, type CartItem, type User, type InsertCategory, type InsertProduct, type InsertCartItem, type InsertUser, type CartItemWithProduct } from "@shared/schema";
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

  // Users
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserById(id: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User | undefined>;
}

export class MemStorage implements IStorage {
  private categories: Map<string, Category>;
  private products: Map<string, Product>;
  private cartItems: Map<string, CartItem>;
  private users: Map<string, User>;

  constructor() {
    this.categories = new Map();
    this.products = new Map();
    this.cartItems = new Map();
    this.users = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize users with default admin
    const adminUser: User = {
      id: randomUUID(),
      username: "admin",
      name: "Administrator",
      email: "admin@example.com",
      password: "admin123", // In production, this should be hashed
      role: "admin",
      phone: null,
      address: null,
      city: null,
      country: null,
      zipCode: null,
      avatar: null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(adminUser.id, adminUser);

    // Initialize categories
    const categories = [
      { name: "Laptops", icon: "fas fa-laptop", productCount: 0 },
      { name: "Smartphones", icon: "fas fa-mobile-alt", productCount: 0 },
      { name: "Audio", icon: "fas fa-headphones", productCount: 0 },
      { name: "Gaming", icon: "fas fa-gamepad", productCount: 0 },
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
      },
      {
        name: "ASUS ROG Zephyrus G14",
        description: "Powerful gaming laptop with AMD Ryzen 9 processor and RTX 4060 graphics.",
        price: "1599.00",
        image: "https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Laptops",
        rating: "4.5",
        inStock: true
      },
      {
        name: "HP Spectre x360",
        description: "Premium 2-in-1 laptop with Intel Core i7 and stunning OLED display.",
        price: "1399.00",
        image: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Laptops",
        rating: "4.4",
        inStock: true
      },
      {
        name: "Google Pixel 8 Pro",
        description: "AI-powered smartphone with exceptional camera and pure Android experience.",
        price: "999.00",
        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Smartphones",
        rating: "4.6",
        inStock: true
      },
      {
        name: "OnePlus 12",
        description: "Flagship phone with Snapdragon 8 Gen 3 and ultra-fast charging.",
        price: "799.00",
        image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Smartphones",
        rating: "4.5",
        inStock: true
      },
      {
        name: "Bose QuietComfort Ultra",
        description: "Premium wireless earbuds with world-class noise cancellation.",
        price: "299.00",
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        rating: "4.8",
        inStock: true
      },
      {
        name: "Audio-Technica ATH-M50x",
        description: "Professional studio monitor headphones for critical listening.",
        price: "149.00",
        image: "https://images.unsplash.com/photo-1484704849700-f032a568e944?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        rating: "4.7",
        inStock: true
      },
      {
        name: "JBL Charge 5",
        description: "Portable Bluetooth speaker with powerful sound and long battery life.",
        price: "179.00",
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Audio",
        rating: "4.6",
        inStock: true
      },
      {
        name: "Xbox Series X",
        description: "Most powerful Xbox ever with 4K gaming and ultra-fast loading.",
        price: "499.00",
        image: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Gaming",
        rating: "4.8",
        inStock: true
      },
      {
        name: "Nintendo Switch OLED",
        description: "Handheld gaming console with vibrant OLED screen and versatile play modes.",
        price: "349.00",
        image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Gaming",
        rating: "4.7",
        inStock: true
      },
      {
        name: "Razer DeathAdder V3",
        description: "High-performance gaming mouse with Focus Pro 30K sensor.",
        price: "99.00",
        image: "https://images.unsplash.com/photo-1527814050087-3793815479db?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
        category: "Gaming",
        rating: "4.5",
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
        badge: prod.badge || null,
        originalPrice: prod.originalPrice || null,
        rating: prod.rating || "0"
      };
      this.products.set(product.id, product);
    });
  }

  async getCategories(): Promise<Category[]> {
    const categories = Array.from(this.categories.values());
    const products = Array.from(this.products.values());
    
    // Calculate real product counts for each category
    return categories.map(category => ({
      ...category,
      productCount: products.filter(product => 
        product.category.toLowerCase() === category.name.toLowerCase()
      ).length
    }));
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
      discount: insertProduct.discount ?? 0,
      originalPrice: insertProduct.originalPrice ?? null,
      rating: insertProduct.rating ?? "0",
      badge: insertProduct.badge ?? null
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
      existingItem.quantity += insertItem.quantity || 1;
      this.cartItems.set(existingItem.id, existingItem);
      return existingItem;
    }

    const id = randomUUID();
    const cartItem: CartItem = { 
      ...insertItem, 
      id,
      quantity: insertItem.quantity || 1,
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

  // User methods
  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = {
      ...insertUser,
      id,
      role: insertUser.role || "user",
      isActive: insertUser.isActive ?? true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: string, updateData: Partial<InsertUser>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;

    const updatedUser: User = {
      ...user,
      ...updateData,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }
}

export const storage = new MemStorage();
