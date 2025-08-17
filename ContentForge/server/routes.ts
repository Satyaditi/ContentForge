import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateMarketingContent, generateMarketingImage } from "./services/gemini";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { z } from "zod";

const generateContentSchema = z.object({
  language: z.string().min(1, "Language is required"),
  contentType: z.string().min(1, "Content type is required"),
  tone: z.string().min(1, "Tone is required"),
  contentIdea: z.string().min(1, "Content idea is required").max(5000, "Content idea too long"),
  includeImage: z.boolean().optional().default(false)
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Protected generate marketing content endpoint
  app.post("/api/generate-content", isAuthenticated, async (req: any, res) => {
    try {
      // Validate request body
      const validationResult = generateContentSchema.safeParse(req.body);
      
      if (!validationResult.success) {
        return res.status(400).json({
          message: "Invalid request data",
          errors: validationResult.error.errors
        });
      }

      const { language, contentType, tone, contentIdea, includeImage } = validationResult.data;
      const userId = req.user.claims.sub;

      // Generate content using Gemini AI
      const generatedContent = await generateMarketingContent(
        language,
        contentType,
        tone,
        contentIdea
      );

      // Generate image if requested
      let imageUrl = null;
      if (includeImage) {
        imageUrl = await generateMarketingImage(contentType, tone, contentIdea);
      }

      // Save the content request to the database
      await storage.createContentRequest({
        userId,
        language,
        contentType,
        tone,
        contentIdea,
        generatedContent,
        includeImage,
        imageUrl,
      });

      res.json({
        content: generatedContent,
        imageUrl: imageUrl
      });
    } catch (error: any) {
      console.error("Error in generate-content endpoint:", error);
      res.status(500).json({
        message: error.message || "Failed to generate content"
      });
    }
  });

  // Get user's content history
  app.get("/api/content-history", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const contentHistory = await storage.getContentRequestsByUser(userId);
      res.json(contentHistory);
    } catch (error) {
      console.error("Error fetching content history:", error);
      res.status(500).json({ message: "Failed to fetch content history" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
