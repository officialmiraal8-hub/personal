import { type User, type InsertUser, type Project, type InsertProject, type Participation, type InsertParticipation } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  getUserByWallet(walletAddress: string): Promise<User | undefined>;
  getUserByReferralCode(referralCode: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: string, points: number): Promise<User>;
  
  // Project operations
  getProject(id: string): Promise<Project | undefined>;
  getAllProjects(): Promise<Project[]>;
  getActiveProjects(): Promise<Project[]>;
  getProjectsByCreator(creatorId: string): Promise<Project[]>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Participation operations
  getParticipation(id: string): Promise<Participation | undefined>;
  getParticipationsByUser(userId: string): Promise<Participation[]>;
  getParticipationsByProject(projectId: string): Promise<Participation[]>;
  createParticipation(participation: InsertParticipation): Promise<Participation>;
  
  // Referral operations
  getReferralsByUser(userId: string): Promise<User[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private projects: Map<string, Project>;
  private participations: Map<string, Participation>;

  constructor() {
    this.users = new Map();
    this.projects = new Map();
    this.participations = new Map();
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUserByWallet(walletAddress: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.walletAddress === walletAddress,
    );
  }

  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id,
      starPoints: insertUser.starPoints || 0,
      referredBy: insertUser.referredBy || null,
      createdAt: new Date(),
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserPoints(userId: string, points: number): Promise<User> {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error("User not found");
    }
    user.starPoints = points;
    this.users.set(userId, user);
    return user;
  }

  // Project operations
  async getProject(id: string): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async getAllProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getActiveProjects(): Promise<Project[]> {
    const now = new Date();
    return Array.from(this.projects.values()).filter(
      (project) => project.status === "active" && new Date(project.endsAt) > now
    );
  }

  async getProjectsByCreator(creatorId: string): Promise<Project[]> {
    return Array.from(this.projects.values()).filter(
      (project) => project.creatorId === creatorId
    );
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const id = randomUUID();
    const createdAt = new Date();
    const endsAt = new Date(
      createdAt.getTime() + insertProject.participationPeriodDays * 24 * 60 * 60 * 1000
    );
    
    const project: Project = {
      ...insertProject,
      id,
      decimals: insertProject.decimals || 7,
      hasVesting: insertProject.hasVesting ?? false,
      logoUrl: insertProject.logoUrl || null,
      twitterUrl: insertProject.twitterUrl || null,
      telegramUrl: insertProject.telegramUrl || null,
      websiteUrl: insertProject.websiteUrl || null,
      vestingPeriodDays: insertProject.vestingPeriodDays || null,
      contractAddress: `STELLAR_CONTRACT_${id.slice(0, 8).toUpperCase()}`,
      status: "active",
      createdAt,
      endsAt,
    };
    this.projects.set(id, project);
    return project;
  }

  // Participation operations
  async getParticipation(id: string): Promise<Participation | undefined> {
    return this.participations.get(id);
  }

  async getParticipationsByUser(userId: string): Promise<Participation[]> {
    return Array.from(this.participations.values()).filter(
      (participation) => participation.userId === userId
    );
  }

  async getParticipationsByProject(projectId: string): Promise<Participation[]> {
    return Array.from(this.participations.values()).filter(
      (participation) => participation.projectId === projectId
    );
  }

  async createParticipation(insertParticipation: InsertParticipation): Promise<Participation> {
    const id = randomUUID();
    const participation: Participation = {
      ...insertParticipation,
      id,
      createdAt: new Date(),
    };
    this.participations.set(id, participation);
    return participation;
  }

  // Referral operations
  async getReferralsByUser(userId: string): Promise<User[]> {
    const user = this.users.get(userId);
    if (!user) {
      return [];
    }
    return Array.from(this.users.values()).filter(
      (u) => u.referredBy === user.referralCode
    );
  }
}

export const storage = new MemStorage();
