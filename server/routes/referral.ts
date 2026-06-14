const { Router } = require("express");
const { db, usersTable, referralsTable } = require("../db/index");
const { eq } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// ================= REFERRAL INFO =================
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    if (!user) {
      res.status(404).json({ error: "Not found" });
      return;
    }

    const refs = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referrerId, userId));

    const totalEarned = refs.reduce(
      (sum, r) => sum + Number(r.reward),
      0
    );

    const domain = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.REPLIT_DOMAINS?.split(",")[0]
        ? `https://${process.env.REPLIT_DOMAINS.split(",")[0]}`
        : "http://localhost:3000";

    const referralLink = `${domain}/register?ref=${user.referralCode}`;

    res.json({
      referralCode: user.referralCode,
      referralLink,
      totalReferred: refs.length,
      totalEarned
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= REFERRED USERS =================
router.get("/referred", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const refs = await db
      .select()
      .from(referralsTable)
      .where(eq(referralsTable.referrerId, userId));

    const result = await Promise.all(
      refs.map(async (r) => {
        const [referred] = await db
          .select()
          .from(usersTable)
          .where(eq(usersTable.id, r.referredId))
          .limit(1);

        return {
          id: r.id,
          name: referred?.name ?? "Unknown",
          joinedAt: r.createdAt.toISOString(),
          earnings: Number(r.reward)
        };
      })
    );

    res.json(result);

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
