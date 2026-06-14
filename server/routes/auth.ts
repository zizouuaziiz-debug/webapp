const { Router } = require("express");
const bcrypt = require("bcryptjs");
const { db, usersTable, transactionsTable, referralsTable } = require("../db/index");
const { eq } = require("drizzle-orm");
const { requireAuth, signToken } = require("../middleware/auth");
const { generateReferralCode } = require("../lib/referralCode");
const { z } = require("zod");

const router = Router();

const RegisterBody = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  referralCode: z.string().optional(),
});

const LoginBody = z.object({
  email: z.string().email(),
  password: z.string(),
});

const GoogleBody = z.object({
  credential: z.string(),
  referralCode: z.string().optional(),
});

function formatUser(u) {
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    balance: Number(u.balance),
    pendingBalance: Number(u.pendingBalance),
    vipLevel: u.vipLevel,
    referralCode: u.referralCode,
    isAdmin: u.isAdmin,
    isBanned: u.isBanned,
    createdAt: u.createdAt.toISOString(),
  };
}

// POST /register
router.post("/register", async (req, res) => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { name, email, password, referralCode } = parsed.data;

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);
    if (existing.length > 0) {
      res.status(400).json({ error: "Email already registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const myCode = generateReferralCode();

    const [user] = await db.insert(usersTable).values({
      name,
      email,
      password: hashed,
      referralCode: myCode
    }).returning();

    if (referralCode) {
      const [referrer] = await db.select().from(usersTable).where(eq(usersTable.referralCode, referralCode)).limit(1);

      if (referrer) {
        await db.insert(referralsTable).values({
          referrerId: referrer.id,
          referredId: user.id,
          reward: "1.00"
        });

        await db.update(usersTable)
          .set({
            balance: String(Number(referrer.balance) + 1),
            totalEarned: String(Number(referrer.totalEarned) + 1)
          })
          .where(eq(usersTable.id, referrer.id));

        await db.insert(transactionsTable).values({
          userId: referrer.id,
          type: "earn_referral",
          amount: "1.00",
          status: "completed",
          description: `Referral bonus for inviting ${name}`
        });
      }
    }

    const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
    res.status(201).json({ token, user: formatUser(user) });

  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /login
router.post("/login", async (req, res) => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { email, password } = parsed.data;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    if (user.isBanned) {
      res.status(403).json({ error: "Account banned" });
      return;
    }

    if (user.password === "GOOGLE_OAUTH_USER") {
      res.status(401).json({ error: "Please sign in with Google" });
      return;
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
    res.json({ token, user: formatUser(user) });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// POST /google
router.post("/google", async (req, res) => {
  const parsed = GoogleBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { credential, referralCode } = parsed.data;

  try {
    const { OAuth2Client } = await import("google-auth-library");

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      res.status(500).json({ error: "Google OAuth not configured" });
      return;
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      res.status(400).json({ error: "Invalid Google token" });
      return;
    }

    const { email, name, sub: googleId } = payload;

    let [user] = await db.select().from(usersTable).where(eq(usersTable.email, email)).limit(1);

    if (user) {
      if (user.isBanned) {
        res.status(403).json({ error: "Account banned" });
        return;
      }

      if (!user.googleId) {
        await db.update(usersTable).set({ googleId }).where(eq(usersTable.id, user.id));
        user = { ...user, googleId };
      }

    } else {
      const myCode = generateReferralCode();

      const [newUser] = await db.insert(usersTable).values({
        name: name || email.split("@")[0],
        email,
        password: "GOOGLE_OAUTH_USER",
        googleId,
        referralCode: myCode,
      }).returning();

      user = newUser;
    }

    const token = signToken({ userId: user.id, email: user.email, isAdmin: user.isAdmin });
    res.json({ token, user: formatUser(user) });

  } catch (err) {
    console.error("Google OAuth error:", err);
    res.status(500).json({ error: "Google sign-in failed" });
  }
});

// GET /me
router.get("/me", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId)).limit(1);

    if (!user) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    res.json(formatUser(user));

  } catch (err) {
    console.error("GetMe error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
