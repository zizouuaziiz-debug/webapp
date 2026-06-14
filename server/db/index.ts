import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { pgTable, serial, text, numeric, integer, boolean, timestamp, varchar } from "drizzle-orm/pg-core";
import { z } from "zod";

const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
export const db = drizzle(pool);

// ─── SCHEMA ──────────────────────────────────────────────────────────────────

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  googleId: text("google_id"),
  balance: numeric("balance", { precision: 10, scale: 4 }).notNull().default("0"),
  pendingBalance: numeric("pending_balance", { precision: 10, scale: 4 }).notNull().default("0"),
  totalEarned: numeric("total_earned", { precision: 10, scale: 4 }).notNull().default("0"),
  totalWithdrawn: numeric("total_withdrawn", { precision: 10, scale: 4 }).notNull().default("0"),
  vipLevel: integer("vip_level").notNull().default(0),
  referralCode: varchar("referral_code", { length: 20 }).notNull().unique(),
  referredBy: integer("referred_by"),
  isAdmin: boolean("is_admin").notNull().default(false),
  isBanned: boolean("is_banned").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const transactionsTable = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: varchar("type", { length: 50 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 4 }).notNull(),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  description: text("description").notNull(),
  metadata: text("metadata"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const tasksTable = pgTable("tasks", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: numeric("reward", { precision: 10, scale: 4 }).notNull(),
  type: varchar("type", { length: 30 }).notNull().default("general"),
  isActive: boolean("is_active").notNull().default(true),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const taskCompletionsTable = pgTable("task_completions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  taskId: integer("task_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const offersTable = pgTable("offers", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  reward: numeric("reward", { precision: 10, scale: 4 }).notNull(),
  imageUrl: text("image_url").notNull(),
  ctaLabel: text("cta_label").notNull(),
  ctaUrl: text("cta_url").notNull(),
  category: varchar("category", { length: 50 }).notNull().default("general"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adsTable = pgTable("ads", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  reward: numeric("reward", { precision: 10, scale: 4 }).notNull(),
  imageUrl: text("image_url").notNull(),
  adUrl: text("ad_url").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adClaimsTable = pgTable("ad_claims", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  adId: integer("ad_id").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const referralsTable = pgTable("referrals", {
  id: serial("id").primaryKey(),
  referrerId: integer("referrer_id").notNull(),
  referredId: integer("referred_id").notNull().unique(),
  reward: numeric("reward", { precision: 10, scale: 4 }).notNull().default("1.00"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const platformSettingsTable = pgTable("platform_settings", {
  id: serial("id").primaryKey(),
  monetagPublisherId: text("monetag_publisher_id").notNull().default(""),
  cpxAppId: text("cpx_app_id").notNull().default(""),
  cpxSecretKey: text("cpx_secret_key").notNull().default(""),
  referralReward: numeric("referral_reward", { precision: 10, scale: 4 }).notNull().default("1.00"),
  adClickReward: numeric("ad_click_reward", { precision: 10, scale: 4 }).notNull().default("0.01"),
  withdrawalMinimum: numeric("withdrawal_minimum", { precision: 10, scale: 4 }).notNull().default("5.00"),
  withdrawalsEnabled: boolean("withdrawals_enabled").notNull().default(false),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
