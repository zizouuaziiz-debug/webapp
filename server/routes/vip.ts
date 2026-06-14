const { Router } = require("express");
const { db, usersTable, transactionsTable } = require("../db/index");
const { eq } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");
const { z } = require("zod");

const router = Router();

const DepositBody = z.object({
  amount: z.number().positive(),
  method: z.string()
});

// ================= VIP LEVELS =================
const VIP_LEVELS = [
  {
    level: 0,
    name: "Free",
    requiredDeposit: 0,
    earningsMultiplier: 1.0,
    benefits: ["Basic ad access", "Standard task rewards"]
  },
  {
    level: 1,
    name: "VIP 1 — Silver",
    requiredDeposit: 50,
    earningsMultiplier: 1.5,
    benefits: ["1.5x earnings multiplier", "Priority task access", "Exclusive Silver offers"]
  },
  {
    level: 2,
    name: "VIP 2 — Gold",
    requiredDeposit: 150,
    earningsMultiplier: 2.0,
    benefits: ["2x earnings multiplier", "Daily bonus rewards", "Gold exclusive surveys", "Higher withdrawal limits"]
  },
  {
    level: 3,
    name: "VIP 3 — Platinum",
    requiredDeposit: 500,
    earningsMultiplier: 3.0,
    benefits: ["3x earnings multiplier", "Personal account manager", "Platinum exclusive offers", "Instant withdrawal processing"]
  }
];

// ================= GET LEVELS =================
router.get("/levels", (_req, res) => {
  res.json(VIP_LEVELS);
});

// ================= DEPOSIT =================
router.post("/deposit", requireAuth, async (req, res) => {
  const { userId } = req.user;

  const parsed = DepositBody.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input" });
    return;
  }

  const { amount, method } = parsed.data;

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

    let newVipLevel = user.vipLevel;

    if (amount >= 500 && newVipLevel < 3) newVipLevel = 3;
    else if (amount >= 150 && newVipLevel < 2) newVipLevel = 2;
    else if (amount >= 50 && newVipLevel < 1) newVipLevel = 1;

    await db
      .update(usersTable)
      .set({ vipLevel: newVipLevel })
      .where(eq(usersTable.id, userId));

    const [txn] = await db
      .insert(transactionsTable)
      .values({
        userId,
        type: "deposit_vip",
        amount: String(amount),
        status: "pending",
        description: `VIP deposit via ${method} — upgrading to VIP ${newVipLevel}`
      })
      .returning();

    res.status(201).json({
      id: txn.id,
      type: txn.type,
      amount: Number(txn.amount),
      status: txn.status,
      description: txn.description,
      createdAt: txn.createdAt.toISOString()
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
