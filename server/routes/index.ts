const { Router } = require("express");

const authRouter = require("./auth");
const walletRouter = require("./wallet");
const tasksRouter = require("./tasks");
const { adsRouter, surveysRouter } = require("./ads");
const vipRouter = require("./vip");
const offersRouter = require("./offers");
const referralRouter = require("./referral");
const adminRouter = require("./admin");

const router = Router();

router.get("/healthz", (_req, res) => res.json({ status: "ok" }));

router.use("/auth", authRouter);
router.use("/wallet", walletRouter);
router.use("/tasks", tasksRouter);
router.use("/ads", adsRouter);
router.use("/surveys", surveysRouter);
router.use("/vip", vipRouter);
router.use("/offers", offersRouter);
router.use("/referral", referralRouter);
router.use("/admin", adminRouter);

module.exports = router;
