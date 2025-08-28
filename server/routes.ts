import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema, loginSchema, userLoginSchema, registerSchema } from "@shared/schema";
import { randomUUID } from "crypto";

// Simple session storage (in production, use Redis or database)
const sessions: Map<string, { userId: string; expires: Date }> = new Map();

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  const requireAuth = (req: any, res: any, next: any) => {
    const sessionId = req.headers['authorization']?.replace('Bearer ', '');
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const session = sessions.get(sessionId);
    if (!session || session.expires < new Date()) {
      sessions.delete(sessionId);
      return res.status(401).json({ message: "Session expired" });
    }

    req.userId = session.userId;
    next();
  };

  const requireAdmin = async (req: any, res: any, next: any) => {
    const user = await storage.getUserById(req.userId);
    if (!user || user.role !== 'admin') {
      return res.status(403).json({ message: "Admin access required" });
    }
    req.user = user;
    next();
  };

  // Auth routes
  app.post("/api/auth/login", async (req, res) => {
    try {
      const { username, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password || !user.isActive) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      const sessionId = randomUUID();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      sessions.set(sessionId, { userId: user.id, expires });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/user-login", async (req, res) => {
    try {
      const { email, password } = userLoginSchema.parse(req.body);
      
      // Find user by email
      const users = Array.from((storage as any).users.values());
      const user = users.find(u => u.email === email);
      
      if (!user || user.password !== password || !user.isActive || user.role === 'admin') {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Create session
      const sessionId = randomUUID();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
      sessions.set(sessionId, { userId: user.id, expires });

      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      res.status(400).json({ message: "Invalid request data" });
    }
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = registerSchema.parse(req.body);
      
      // Check if username already exists
      const existingUser = await storage.getUserByUsername(userData.username!);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Create user
      const { confirmPassword, ...userDataWithoutConfirm } = userData;
      const newUser = await storage.createUser(userDataWithoutConfirm);
      
      // Create session
      const sessionId = randomUUID();
      const expires = new Date(Date.now() + 24 * 60 * 60 * 1000);
      sessions.set(sessionId, { userId: newUser.id, expires });

      // Return user without password
      const { password: _, ...userWithoutPassword } = newUser;
      res.json({ user: userWithoutPassword, sessionId });
    } catch (error) {
      res.status(400).json({ message: "Registration failed" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    const sessionId = req.headers['authorization']?.replace('Bearer ', '');
    if (sessionId) {
      sessions.delete(sessionId);
    }
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/me", requireAuth, async (req: any, res) => {
    try {
      const user = await storage.getUserById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Categories routes
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  // Products routes
  app.get("/api/products", async (req, res) => {
    try {
      const { category, search, featured } = req.query;
      
      let products;
      if (search) {
        products = await storage.searchProducts(search as string);
      } else if (category) {
        products = await storage.getProductsByCategory(category as string);
      } else if (featured) {
        products = await storage.getFeaturedProducts();
      } else {
        products = await storage.getProducts();
      }
      
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.get("/api/products/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const product = await storage.getProductById(id);
      
      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch product" });
    }
  });

  // Cart routes
  app.get("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'anonymous';
      const cartItems = await storage.getCartItems(sessionId);
      res.json(cartItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch cart items" });
    }
  });

  app.post("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'anonymous';
      const validatedData = insertCartItemSchema.parse({
        ...req.body,
        sessionId
      });
      
      const cartItem = await storage.addToCart(validatedData);
      res.status(201).json(cartItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to add item to cart" });
    }
  });

  app.put("/api/cart/:productId", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'anonymous';
      const { productId } = req.params;
      const { quantity } = req.body;
      
      const updatedItem = await storage.updateCartItemQuantity(sessionId, productId, quantity);
      if (!updatedItem && quantity > 0) {
        return res.status(404).json({ message: "Cart item not found" });
      }
      
      res.json(updatedItem);
    } catch (error) {
      res.status(400).json({ message: "Failed to update cart item" });
    }
  });

  app.delete("/api/cart/:productId", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'anonymous';
      const { productId } = req.params;
      
      await storage.removeFromCart(sessionId, productId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to remove item from cart" });
    }
  });

  app.delete("/api/cart", async (req, res) => {
    try {
      const sessionId = req.headers['session-id'] as string || 'anonymous';
      await storage.clearCart(sessionId);
      res.status(204).send();
    } catch (error) {
      res.status(400).json({ message: "Failed to clear cart" });
    }
  });

  // Admin routes
  app.get("/api/admin/users", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      // In a real app, implement pagination and filtering
      res.json({ message: "Admin users endpoint - implement as needed" });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.get("/api/admin/dashboard", requireAuth, requireAdmin, async (req: any, res) => {
    try {
      // Return admin dashboard data
      res.json({
        totalUsers: 1,
        totalProducts: (await storage.getProducts()).length,
        totalCategories: (await storage.getCategories()).length,
        recentActivity: []
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard data" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
