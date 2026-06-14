-- ClickEarn Database Schema
-- Run this in your Supabase SQL Editor or any PostgreSQL database

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  google_id TEXT,
  balance NUMERIC(10, 4) NOT NULL DEFAULT 0,
  pending_balance NUMERIC(10, 4) NOT NULL DEFAULT 0,
  total_earned NUMERIC(10, 4) NOT NULL DEFAULT 0,
  total_withdrawn NUMERIC(10, 4) NOT NULL DEFAULT 0,
  vip_level INTEGER NOT NULL DEFAULT 0,
  referral_code VARCHAR(20) NOT NULL UNIQUE,
  referred_by INTEGER,
  is_admin BOOLEAN NOT NULL DEFAULT false,
  is_banned BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS transactions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  type VARCHAR(50) NOT NULL,
  amount NUMERIC(10, 4) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'completed',
  description TEXT NOT NULL,
  metadata TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward NUMERIC(10, 4) NOT NULL,
  type VARCHAR(30) NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  expires_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS task_completions (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  task_id INTEGER NOT NULL REFERENCES tasks(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, task_id)
);

CREATE TABLE IF NOT EXISTS offers (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  reward NUMERIC(10, 4) NOT NULL,
  image_url TEXT NOT NULL,
  cta_label TEXT NOT NULL,
  cta_url TEXT NOT NULL,
  category VARCHAR(50) NOT NULL DEFAULT 'general',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ads (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  reward NUMERIC(10, 4) NOT NULL,
  image_url TEXT NOT NULL,
  ad_url TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS ad_claims (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  ad_id INTEGER NOT NULL REFERENCES ads(id),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, ad_id)
);

CREATE TABLE IF NOT EXISTS referrals (
  id SERIAL PRIMARY KEY,
  referrer_id INTEGER NOT NULL REFERENCES users(id),
  referred_id INTEGER NOT NULL UNIQUE REFERENCES users(id),
  reward NUMERIC(10, 4) NOT NULL DEFAULT 1.00,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS platform_settings (
  id SERIAL PRIMARY KEY,
  monetag_publisher_id TEXT NOT NULL DEFAULT '',
  cpx_app_id TEXT NOT NULL DEFAULT '',
  cpx_secret_key TEXT NOT NULL DEFAULT '',
  referral_reward NUMERIC(10, 4) NOT NULL DEFAULT 1.00,
  ad_click_reward NUMERIC(10, 4) NOT NULL DEFAULT 0.01,
  withdrawal_minimum NUMERIC(10, 4) NOT NULL DEFAULT 5.00,
  withdrawals_enabled BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Default platform settings
INSERT INTO platform_settings (id) VALUES (1) ON CONFLICT (id) DO NOTHING;

-- Sample tasks (add your own!)
INSERT INTO tasks (title, description, reward, type) VALUES
  ('Watch a Video Ad', 'Watch a 30-second video ad to completion', 0.01, 'daily'),
  ('Complete Your Profile', 'Fill in your name, bio and profile picture', 0.50, 'general'),
  ('Share on Social Media', 'Share ClickEarn on any social platform', 0.25, 'general'),
  ('Invite a Friend', 'Invite a friend who registers using your link', 1.00, 'general'),
  ('Daily Check-In', 'Log in to ClickEarn today', 0.05, 'daily')
ON CONFLICT DO NOTHING;

-- Sample ads
INSERT INTO ads (title, reward, image_url, ad_url) VALUES
  ('Premium Offer - Shop Now', 0.01, 'https://placehold.co/400x200/3b82f6/ffffff?text=Ad+1', 'https://example.com/ad1'),
  ('Exclusive Deal - Limited Time', 0.01, 'https://placehold.co/400x200/10b981/ffffff?text=Ad+2', 'https://example.com/ad2'),
  ('New Service Launch', 0.01, 'https://placehold.co/400x200/f59e0b/ffffff?text=Ad+3', 'https://example.com/ad3')
ON CONFLICT DO NOTHING;
