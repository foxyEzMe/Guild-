import { users, discordMembers, announcements, loginLogs, type User, type InsertUser, type DiscordMember, type InsertDiscordMember, type Announcement, type InsertAnnouncement, type ServerStats, type LoginLog } from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, or } from "drizzle-orm";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: any): Promise<User>;
  updateUser(id: string, user: Partial<InsertUser>): Promise<User>;
  validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean>;
  validateSecurityAnswer(username: string, inputAnswer: string): Promise<boolean>;
  verifyUser(userId: string): Promise<User>;
  upsertUser(user: Partial<User>): Promise<User>;
  
  // Logging methods
  logLogin(data: {
    userId: string;
    username: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    success: boolean;
  }): Promise<void>;
  getLoginLogs(limit?: number): Promise<LoginLog[]>;
  
  // Discord-related methods
  getDiscordMembers(): Promise<DiscordMember[]>;
  updateDiscordMember(member: InsertDiscordMember): Promise<DiscordMember>;
  getAnnouncements(limit?: number): Promise<Announcement[]>;
  addAnnouncement(announcement: InsertAnnouncement): Promise<Announcement>;
  getServerStats(): Promise<ServerStats>;
  updateServerStats(stats: ServerStats): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Méthodes utilisateur
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async validatePassword(inputPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(inputPassword, hashedPassword);
  }

  async createUser(userData: any): Promise<User> {
    // Hash le mot de passe
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // Hash la réponse de sécurité
    const hashedSecurityAnswer = userData.securityAnswer 
      ? await bcrypt.hash(userData.securityAnswer.toLowerCase(), 10)
      : null;
    
    // Crée un ID unique
    const userId = nanoid();
    
    const [user] = await db
      .insert(users)
      .values({
        ...userData,
        id: userId,
        password: hashedPassword,
        securityAnswer: hashedSecurityAnswer,
        verified: false,
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    return user;
  }

  async updateUser(id: string, userData: any): Promise<User> {
    // Si le mot de passe est fourni, le hasher
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    
    const [updatedUser] = await db
      .update(users)
      .set({
        ...userData,
        updatedAt: new Date()
      })
      .where(eq(users.id, id))
      .returning();
    
    return updatedUser;
  }

  async validateSecurityAnswer(username: string, inputAnswer: string): Promise<boolean> {
    const user = await this.getUserByUsername(username);
    if (!user || !user.securityAnswer) {
      return false;
    }
    return bcrypt.compare(inputAnswer.toLowerCase(), user.securityAnswer);
  }

  async verifyUser(userId: string): Promise<User> {
    const [user] = await db
      .update(users)
      .set({ 
        verified: true,
        updatedAt: new Date()
      })
      .where(eq(users.id, userId))
      .returning();
    return user;
  }

  async upsertUser(userData: Partial<User>): Promise<User> {
    if (!userData.id) {
      throw new Error("ID is required for upsert operation");
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, userData.id));

    if (existingUser) {
      // Mettre à jour l'utilisateur existant
      const updateData = { ...userData };
      delete updateData.id; // Remove id from update data
      
      const [updatedUser] = await db
        .update(users)
        .set(updateData)
        .where(eq(users.id, userData.id))
        .returning();
      
      return updatedUser;
    } else {
      // Créer un nouvel utilisateur avec tous les champs requis
      const insertData = {
        id: userData.id,
        username: userData.username || '',
        password: userData.password || '',
        email: userData.email || null,
        firstName: userData.firstName || null,
        lastName: userData.lastName || null,
        profileImageUrl: userData.profileImageUrl || null,
        role: userData.role || 'user',
        isAdmin: userData.isAdmin || false,
        verified: userData.verified || false,
        securityQuestion: userData.securityQuestion || null,
        securityAnswer: userData.securityAnswer || null,
      };
      
      const [newUser] = await db
        .insert(users)
        .values([insertData])
        .returning();
      
      return newUser;
    }
  }

  // Méthodes Discord
  async getDiscordMembers(): Promise<DiscordMember[]> {
    return await db
      .select()
      .from(discordMembers)
      .orderBy(desc(discordMembers.joinedAt));
  }

  async updateDiscordMember(memberData: InsertDiscordMember): Promise<DiscordMember> {
    const [member] = await db
      .insert(discordMembers)
      .values({
        ...memberData,
        joinedAt: memberData.joinedAt || new Date()
      })
      .onConflictDoUpdate({
        target: discordMembers.id,
        set: {
          ...memberData,
          joinedAt: memberData.joinedAt || new Date()
        }
      })
      .returning();
    
    return member;
  }

  async getAnnouncements(limit: number = 10): Promise<Announcement[]> {
    return await db
      .select()
      .from(announcements)
      .orderBy(desc(announcements.createdAt))
      .limit(limit);
  }

  async addAnnouncement(announcementData: InsertAnnouncement): Promise<Announcement> {
    const [announcement] = await db
      .insert(announcements)
      .values({
        ...announcementData,
        createdAt: announcementData.createdAt || new Date()
      })
      .returning();
    
    return announcement;
  }

  // ServerStats (stockés en mémoire temporairement pour l'exemple)
  private serverStats: ServerStats = {
    totalMembers: 20,
    onlineMembers: 10,
    serverName: "Arise Crossover"
  };

  async getServerStats(): Promise<ServerStats> {
    return { ...this.serverStats };
  }

  async updateServerStats(stats: ServerStats): Promise<void> {
    this.serverStats = { ...stats };
  }

  // Méthodes de suivi des connexions
  async logLogin(data: {
    userId: string;
    username: string;
    ipAddress: string;
    userAgent: string;
    location?: string;
    success: boolean;
  }): Promise<void> {
    try {
      await db.insert(loginLogs).values({
        userId: data.userId,
        username: data.username,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        location: data.location || null,
        success: data.success,
      });
      console.log(`Login attempt logged for user: ${data.username}, IP: ${data.ipAddress}`);
    } catch (error) {
      console.error('Error logging login attempt:', error);
    }
  }

  async getLoginLogs(limit: number = 100): Promise<LoginLog[]> {
    try {
      const logs = await db.select().from(loginLogs).orderBy(desc(loginLogs.timestamp)).limit(limit);
      return logs;
    } catch (error) {
      console.error('Error fetching login logs:', error);
      return [];
    }
  }
}

export const storage = new DatabaseStorage();
