const { Router } = require("express");
const {
  db,
  adsTable,
  adClaimsTable,
  usersTable,
  transactionsTable,
  platformSettingsTable
} = require("../db/index");

const { eq, and } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");
const crypto = require("crypto");
const { z } = require("zod");

const adsRouter = Router();

// ================= ADS =================
adsRouter.get("/", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const allAds = await db
      .select()
      .from(adsTable)
      .where(eq(adsTable.isActive, true));

    const claims = await db
      .select()
      .from(adClaimsTable)
      .where(eq(adClaimsTable.userId, userId));

    const claimedIds = new Set(claims.map(c => c.adId));

    res.json(
      allAds.map(a => ({
        id: a.id,
        title: a.title,
        reward: Number(a.reward),
        imageUrl: a.imageUrl,
        adUrl: a.adUrl,
        isClaimed: claimedIds.has(a.id)
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= CLAIM AD =================
adsRouter.post("/:adId/claim", requireAuth, async (req, res) => {
  const { userId } = req.user;
  const adId = Number(req.params.adId);

  if (isNaN(adId)) {
    res.status(400).json({ error: "Invalid ad ID" });
    return;
  }

  try {
    const [ad] = await db
      .select()
      .from(adsTable)
      .where(eq(adsTable.id, adId))
      .limit(1);

    if (!ad || !ad.isActive) {
      res.status(404).json({ error: "Ad not found" });
      return;
    }

    const [existing] = await db
      .select()
      .from(adClaimsTable)
      .where(
        and(
          eq(adClaimsTable.userId, userId),
          eq(adClaimsTable.adId, adId)
        )
      )
      .limit(1);

    if (existing) {
      res.status(400).json({ error: "Ad already claimed" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const reward = Number(ad.reward);
    const newBalance = Number(user?.balance ?? 0) + reward;

    await db.insert(adClaimsTable).values({ userId, adId });

    await db.update(usersTable)
      .set({
        balance: String(newBalance),
        totalEarned: String(Number(user?.totalEarned ?? 0) + reward)
      })
      .where(eq(usersTable.id, userId));

    await db.insert(transactionsTable).values({
      userId,
      type: "earn_ad",
      amount: String(reward),
      status: "completed",
      description: `Ad reward: ${ad.title}`
    });

    res.json({
      success: true,
      reward,
      newBalance
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= SURVEYS =================
const surveysRouter = Router();

surveysRouter.get("/", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const [settings] = await db
      .select()
      .from(platformSettingsTable)
      .limit(1);

    const appId = settings?.cpxAppId || "DEMO_APP";

    const surveys = [
      {
        id: 1,
        title: "Consumer Preferences Survey",
        reward: 2.5,
        lengthMinutes: 10,
        url: `https://offers.cpx-research.com/index.php?app_id=${appId}&ext_user_id=${userId}&subid_1=clickearn`
      },
      {
        id: 2,
        title: "Technology Usage Poll",
        reward: 1.75,
        lengthMinutes: 7,
        url: `https://offers.cpx-research.com/index.php?app_id=${appId}&ext_user_id=${userId}&subid_1=clickearn`
      },
      {
        id: 3,
        title: "Lifestyle & Habits Research",
        reward: 3.0,
        lengthMinutes: 15,
        url: `https://offers.cpx-research.com/index.php?app_id=${appId}&ext_user_id=${userId}&subid_1=clickearn`
      },
      {
        id: 4,
        title: "Brand Awareness Survey",
        reward: 1.5,
        lengthMinutes: 5,
        url: `https://offers.cpx-research.com/index.php?app_id=${appId}&ext_user_id=${userId}&subid_1=clickearn`
      }
    ];

    res.json(surveys);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= POSTBACK =================
const PostbackBody = z.object({
  userId: z.number(),
  transactionId: z.string(),
  reward: z.number(),
  hash: z.string()
});

surveysRouter.post("/postback", async (req, res) => {
  const parsed = PostbackBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid payload" });
    return;
  }

  const { userId, transactionId, reward, hash } = parsed.data;

  try {
    const [settings] = await db
      .select()
      .from(platformSettingsTable)
      .limit(1);

    const secretKey = settings?.cpxSecretKey || "";

    const expectedHash = crypto
      .createHash("md5")
      .update(`${userId}-${transactionId}-${secretKey}`)
      .digest("hex");

    if (secretKey && hash !== expectedHash) {
      res.status(403).json({ error: "Invalid hash" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    await db.update(usersTable)
      .set({
        balance: String(Number(user.balance) + reward),
        totalEarned: String(Number(user.totalEarned) + reward)
      })
      .where(eq(usersTable.id, userId));

    await db.insert(transactionsTable).values({
      userId,
      type: "earn_survey",
      amount: String(reward),
      status: "completed",
      description: `Survey completed (CPX Research) — txn: ${transactionId}`
    });

    res.json({ ok: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = {
  adsRouter,
  surveysRouter
};
