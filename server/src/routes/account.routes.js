const express = require("express");
const { body, validationResult } = require("express-validator");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();

const WITHDRAW_REVIEW_MESSAGE =
  "Don't withdraw now. Your funds are currently under review. Please try again later.";

router.get("/me", requireAuth, async (req, res) => {
  try {
    const account = await Account.findOne({ userId: req.user._id });
    if (!account) {
      return res.status(404).json({ error: "No account found for this user" });
    }
    const transactions = await Transaction.find({ accountId: account._id })
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    return res.json({
      user: {
        id: req.user._id,
        email: req.user.email,
        fullName: req.user.fullName,
      },
      account: {
        id: account._id,
        accountName: account.accountName,
        accountNumber: account.accountNumber,
        balance: account.balance,
        currency: account.currency,
      },
      transactions: transactions.map((t) => ({
        id: t._id,
        amount: t.amount,
        type: t.type,
        description: t.description,
        status: t.status,
        date: t.createdAt,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not load account" });
  }
});

router.post(
  "/withdraw",
  requireAuth,
  [body("amount").optional().isFloat({ min: 0.01 }).withMessage("Invalid amount")],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    return res.status(403).json({
      success: false,
      status: "UNDER_REVIEW",
      message: WITHDRAW_REVIEW_MESSAGE,
    });
  }
);

router.post("/withdraw-notify", requireAuth, async (req, res) => {
  try {
    await User.updateOne(
      { _id: req.user._id },
      { $set: { notifyWithdrawWhenAvailable: true } }
    );
    return res.json({
      success: true,
      message: "We will notify you when withdrawals are available again.",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Could not save preference" });
  }
});

module.exports = router;
