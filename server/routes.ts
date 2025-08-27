import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertCartItemSchema } from "@shared/schema";
import { randomUUID } from "crypto";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);
  return httpServer;
}
