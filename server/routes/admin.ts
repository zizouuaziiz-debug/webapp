const { Router } = require("express");
const {
  db,
  usersTable,
  transactionsTable,
  platformSettingsTable
} = require("../db/index");

const { eq, desc, sql } = require("drizzle-orm");
const { requireAuth, requireAdmin } = require("../middleware/auth");
const { z } = require("zod");

const router = Router();

// حماية admin
router.use(requireAuth, requireAdmin);

// ================= ANALYTICS =================
router.get("/analytics", async (req, res) => {
  try {
    const [{ totalUsers }] = await db
      .select({ totalUsers: sql`count(*)::int` })
      .from(usersTable);

    const [{ activeUsers }] = await db
      .select({ activeUsers: sql`count(*)::int` })
      .from(usersTable)
      .where(eq(usersTable.isBanned, false));

    const [{ totalEarnings }] = await db
      .select({ totalEarnings: sql`coalesce(sum(amount::numeric),0)` })
      .from(transactionsTable)
      .where(eq(transactionsTable.type, "earn_ad"));

    const [{ totalWithdrawals }] = await db
      .select({ totalWithdrawals: sql`coalesce(sum(amount::numeric),0)` })
      .from(transactionsTable)
      .where(eq(transactionsTable.type, "withdraw"));

    const [{ totalClicks }] = await db
      .select({ totalClicks: sql`count(*)::int` })
      .from(transactionsTable)
      .where(eq(transactionsTable.type, "earn_ad"));

    res.json({
      totalUsers: Number(totalUsers),
      activeUsers: Number(activeUsers),
      totalEarnings: Number(totalEarnings),
      totalWithdrawals: Number(totalWithdrawals),
      totalClicks: Number(totalClicks),
      revenueToday: Number(totalEarnings) * 0.03,
      revenueWeek: Number(totalEarnings) * 0.2,
      revenueMonth: Number(totalEarnings) * 0.8
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= USERS =================
router.get("/users", async (req, res) => {
  try {
    const users = await db
      .select()
      .from(usersTable)
      .orderBy(desc(usersTable.createdAt))
      .limit(100);

    res.json(
      users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        balance: Number(u.balance),
        vipLevel: u.vipLevel,
        isAdmin: u.isAdmin,
        isBanned: u.isBanned,
        totalEarned: Number(u.totalEarned),
        createdAt: u.createdAt.toISOString()
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= UPDATE USER =================
const UpdateUserBody = z.object({
  balance: z.number().optional(),
  vipLevel: z.number().min(0).max(3).optional(),
  isAdmin: z.boolean().optional(),
  isBanned: z.boolean().optional()
});

router.patch("/users/:userId", async (req, res) => {
  const userId = Number(req.params.userId);
  const parsed = UpdateUserBody.safeParse(req.body);

  if (!parsed.success || isNaN(userId)) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const updates = {};

  if (parsed.data.balance != null) updates.balance = String(parsed.data.balance);
  if (parsed.data.vipLevel != null) updates.vipLevel = parsed.data.vipLevel;
  if (parsed.data.isAdmin != null) updates.isAdmin = parsed.data.isAdmin;
  if (parsed.data.isBanned != null) updates.isBanned = parsed.data.isBanned;

  try {
    const [updated] = await db
      .update(usersTable)
      .set(updates)
      .where(eq(usersTable.id, userId))
      .returning();

    if (!updated) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    res.json({
      id: updated.id,
      name: updated.name,
      email: updated.email,
      balance: Number(updated.balance),
      vipLevel: updated.vipLevel,
      isAdmin: updated.isAdmin,
      isBanned: updated.isBanned,
      totalEarned: Number(updated.totalEarned),
      createdAt: updated.createdAt.toISOString()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= TRANSACTIONS =================
router.get("/transactions", async (req, res) => {
  try {
    const txns = await db
      .select({
        txn: transactionsTable,
        user: { name: usersTable.name }
      })
      .from(transactionsTable)
      .leftJoin(usersTable, eq(transactionsTable.userId, usersTable.id))
      .orderBy(desc(transactionsTable.createdAt))
      .limit(200);

    res.json(
      txns.map(({ txn, user }) => ({
        id: txn.id,
        userId: txn.userId,
        userName: user?.name ?? "Unknown",
        type: txn.type,
        amount: Number(txn.amount),
        status: txn.status,
        description: txn.description,
        createdAt: txn.createdAt.toISOString()
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= SETTINGS =================
router.get("/settings", async (req, res) => {
  try {
    let [s] = await db.select().from(platformSettingsTable).limit(1);

    if (!s) {
      [s] = await db.insert(platformSettingsTable).values({}).returning();
    }

    res.json({
      monetagPublisherId: s.monetagPublisherId,
      cpxAppId: s.cpxAppId,
      cpxSecretKey: s.cpxSecretKey,
      referralReward: Number(s.referralReward),
      adClickReward: Number(s.adClickReward),
      withdrawalMinimum: Number(s.withdrawalMinimum),
      withdrawalsEnabled: s.withdrawalsEnabled
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= UPDATE SETTINGS =================
const UpdateSettingsBody = z.object({
  monetagPublisherId: z.string().optional(),
  cpxAppId: z.string().optional(),
  cpxSecretKey: z.string().optional(),
  referralReward: z.number().optional(),
  adClickReward: z.number().optional(),
  withdrawalMinimum: z.number().optional(),
  withdrawalsEnabled: z.boolean().optional()
});

router.patch("/settings", async (req, res) => {
  const parsed = UpdateSettingsBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const updates = {};

  if (parsed.data.monetagPublisherId != null)
    updates.monetagPublisherId = parsed.data.monetagPublisherId;

  if (parsed.data.cpxAppId != null)
    updates.cpxAppId = parsed.data.cpxAppId;

  if (parsed.data.cpxSecretKey != null)
    updates.cpxSecretKey = parsed.data.cpxSecretKey;

  if (parsed.data.referralReward != null)
    updates.referralReward = String(parsed.data.referralReward);

  if (parsed.data.adClickReward != null)
    updates.adClickReward = String(parsed.data.adClickReward);

  if (parsed.data.withdrawalMinimum != null)
    updates.withdrawalMinimum = String(parsed.data.withdrawalMinimum);

  if (parsed.data.withdrawalsEnabled != null)
    updates.withdrawalsEnabled = parsed.data.withdrawalsEnabled;

  try {
    let [s] = await db.select().from(platformSettingsTable).limit(1);

    if (!s) {
      [s] = await db.insert(platformSettingsTable).values({}).returning();
    }

    const [updated] = await db
      .update(platformSettingsTable)
      .set(updates)
      .where(eq(platformSettingsTable.id, s.id))
      .returning();

    res.json({
      monetagPublisherId: updated.monetagPublisherId,
      cpxAppId: updated.cpxAppId,
      cpxSecretKey: updated.cpxSecretKey,
      referralReward: Number(updated.referralReward),
      adClickReward: Number(updated.adClickReward),
      withdrawalMinimum: Number(updated.withdrawalMinimum),
      withdrawalsEnabled: updated.withdrawalsEnabled
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
