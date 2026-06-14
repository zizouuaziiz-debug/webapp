const { Router } = require("express");
const { db, usersTable, transactionsTable } = require("../db/index");
const { eq, desc } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");
const { z } = require("zod");

const router = Router();

const WithdrawBody = z.object({
  amount: z.number().positive(),
  method: z.string()
});

// ================= WALLET INFO =================
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

    res.json({
      balance: Number(user.balance),
      pendingBalance: Number(user.pendingBalance),
      totalEarned: Number(user.totalEarned),
      totalWithdrawn: Number(user.totalWithdrawn)
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= TRANSACTIONS =================
router.get("/transactions", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const txns = await db
      .select()
      .from(transactionsTable)
      .where(eq(transactionsTable.userId, userId))
      .orderBy(desc(transactionsTable.createdAt))
      .limit(50);

    res.json(
      txns.map(t => ({
        id: t.id,
        type: t.type,
        amount: Number(t.amount),
        status: t.status,
        description: t.description,
        createdAt: t.createdAt.toISOString()
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= WITHDRAW =================
router.post("/withdraw", requireAuth, async (req, res) => {
  const { userId } = req.user;

  const parsed = WithdrawBody.safeParse(req.body);

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

    if (Number(user.balance) < amount) {
      res.status(400).json({ error: "Insufficient balance" });
      return;
    }

    await db.update(usersTable)
      .set({
        balance: String(Number(user.balance) - amount),
        pendingBalance: String(Number(user.pendingBalance) + amount),
        totalWithdrawn: String(Number(user.totalWithdrawn) + amount)
      })
      .where(eq(usersTable.id, userId));

    const [txn] = await db
      .insert(transactionsTable)
      .values({
        userId,
        type: "withdraw",
        amount: String(amount),
        status: "pending",
        description: `Withdrawal request via ${method}`
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
