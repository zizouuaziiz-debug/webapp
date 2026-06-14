import { Router } from "express";
import { db, offersTable } from "../db/index";
import { eq } from "drizzle-orm";
import { requireAuth } from "../middleware/auth";

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const offers = await db.select().from(offersTable).where(eq(offersTable.isActive, true));
    res.json(offers.map(o => ({ id: o.id, title: o.title, description: o.description, reward: Number(o.reward), imageUrl: o.imageUrl, ctaLabel: o.ctaLabel, ctaUrl: o.ctaUrl, category: o.category })));
  } catch (err) { console.error(err); res.status(500).json({ error: "Server error" }); }
});

export default router;
