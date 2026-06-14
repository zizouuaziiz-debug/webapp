const { Router } = require("express");
const {
  db,
  usersTable,
  tasksTable,
  taskCompletionsTable,
  transactionsTable
} = require("../db/index");

const { eq, and } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// ================= VIP MULTIPLIER =================
function getMultiplier(vipLevel) {
  return { 0: 1, 1: 1.5, 2: 2, 3: 3 }[vipLevel] ?? 1;
}

// ================= GET TASKS =================
router.get("/", requireAuth, async (req, res) => {
  const { userId } = req.user;

  try {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const multiplier = user ? getMultiplier(user.vipLevel) : 1;

    const allTasks = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.isActive, true));

    const completions = await db
      .select()
      .from(taskCompletionsTable)
      .where(eq(taskCompletionsTable.userId, userId));

    const completedIds = new Set(completions.map(c => c.taskId));

    res.json(
      allTasks.map(t => ({
        id: t.id,
        title: t.title,
        description: t.description,
        reward: Number(t.reward) * multiplier,
        type: t.type,
        isCompleted: completedIds.has(t.id),
        expiresAt: t.expiresAt ? t.expiresAt.toISOString() : null
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= COMPLETE TASK =================
router.post("/:taskId/complete", requireAuth, async (req, res) => {
  const { userId } = req.user;
  const taskId = Number(req.params.taskId);

  if (isNaN(taskId)) {
    res.status(400).json({ error: "Invalid task ID" });
    return;
  }

  try {
    const [task] = await db
      .select()
      .from(tasksTable)
      .where(eq(tasksTable.id, taskId))
      .limit(1);

    if (!task || !task.isActive) {
      res.status(404).json({ error: "Task not found" });
      return;
    }

    const [existing] = await db
      .select()
      .from(taskCompletionsTable)
      .where(
        and(
          eq(taskCompletionsTable.userId, userId),
          eq(taskCompletionsTable.taskId, taskId)
        )
      )
      .limit(1);

    if (existing) {
      res.status(400).json({ error: "Task already completed" });
      return;
    }

    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, userId))
      .limit(1);

    const multiplier = getMultiplier(user?.vipLevel ?? 0);
    const reward = Number(task.reward) * multiplier;

    await db.insert(taskCompletionsTable).values({
      userId,
      taskId
    });

    await db.update(usersTable)
      .set({
        balance: String(Number(user?.balance ?? 0) + reward),
        totalEarned: String(Number(user?.totalEarned ?? 0) + reward)
      })
      .where(eq(usersTable.id, userId));

    await db.insert(transactionsTable).values({
      userId,
      type: "earn_task",
      amount: String(reward),
      status: "completed",
      description: `Completed task: ${task.title}`
    });

    res.json({
      success: true,
      reward,
      newBalance: Number(user?.balance ?? 0) + reward
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
