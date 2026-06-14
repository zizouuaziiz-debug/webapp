const { Router } = require("express");
const { db, offersTable } = require("../db/index");
const { eq } = require("drizzle-orm");
const { requireAuth } = require("../middleware/auth");

const router = Router();

router.get("/", requireAuth, async (req, res) => {
  try {
    const offers = await db
      .select()
      .from(offersTable)
      .where(eq(offersTable.isActive, true));

    res.json(
      offers.map(o => ({
        id: o.id,
        title: o.title,
        description: o.description,
        reward: Number(o.reward),
        imageUrl: o.imageUrl,
        ctaLabel: o.ctaLabel,
        ctaUrl: o.ctaUrl,
        category: o.category
      }))
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
