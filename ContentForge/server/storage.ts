import {
  users,
  contentRequests,
  type User,
  type UpsertUser,
  type ContentRequest,
  type InsertContentRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Content operations
  createContentRequest(request: InsertContentRequest): Promise<ContentRequest>;
  getContentRequestsByUser(userId: string): Promise<ContentRequest[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)

  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Content operations
  async createContentRequest(request: InsertContentRequest): Promise<ContentRequest> {
    const [contentRequest] = await db
      .insert(contentRequests)
      .values(request)
      .returning();
    return contentRequest;
  }

  async getContentRequestsByUser(userId: string): Promise<ContentRequest[]> {
    return await db
      .select()
      .from(contentRequests)
      .where(eq(contentRequests.userId, userId))
      .orderBy(desc(contentRequests.createdAt));
  }
}

export const storage = new DatabaseStorage();
