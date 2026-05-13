const express = require("express");
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const Account = require("../models/Account");
const Transaction = require("../models/Transaction");
const { signToken } = require("../utils/jwt");

const router = express.Router();

function randomAccountNumber() {
  return Array.from({ length: 10 }, () => Math.floor(Math.random() * 10)).join("");
}

async function seedDemoTransactions(accountId) {
  const now = new Date();
  const items = [
    {
      amount: 2500,
      type: "credit",
      description: "Opening deposit",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 14),
    },
    {
      amount: -120.5,
      type: "debit",
      description: "Card purchase — Market Fresh",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 5),
    },
    {
      amount: 850,
      type: "credit",
      description: "Salary deposit",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
    },
    {
      amount: -45.99,
      type: "debit",
      description: "Subscription — Cloud storage",
      createdAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 1),
    },
  ];
  await Transaction.insertMany(
    items.map((t) => ({
      accountId,
      amount: t.amount,
      type: t.type,
      description: t.description,
      createdAt: t.createdAt,
    }))
  );
}

router.post(
  "/register",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
    body("fullName").trim().isLength({ min: 2 }).withMessage("Name is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, fullName } = req.body;
    try {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: "An account with this email already exists" });
      }
      const passwordHash = await bcrypt.hash(password, 12);
      const user = await User.create({ email, passwordHash, fullName });

      let accountNumber = randomAccountNumber();
      for (let i = 0; i < 5; i++) {
        const clash = await Account.findOne({ accountNumber });
        if (!clash) break;
        accountNumber = randomAccountNumber();
      }

      const account = await Account.create({
        userId: user._id,
        accountName: "Primary checking",
        accountNumber,
        currency: "USD",
        balance: 4184.51,
      });

      await seedDemoTransactions(account._id);

      const token = signToken({ sub: user._id.toString() });
      return res.status(201).json({
        token,
        user: { id: user._id, email: user.email, fullName: user.fullName },
        account: {
          id: account._id,
          accountName: account.accountName,
          accountNumber: account.accountNumber,
          balance: account.balance,
          currency: account.currency,
        },
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Registration failed" });
    }
  }
);

router.post(
  "/login",
  [
    body("email").isEmail().normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const ok = await bcrypt.compare(password, user.passwordHash);
      if (!ok) {
        return res.status(401).json({ error: "Invalid email or password" });
      }
      const account = await Account.findOne({ userId: user._id });
      const token = signToken({ sub: user._id.toString() });
      return res.json({
        token,
        user: { id: user._id, email: user.email, fullName: user.fullName },
        account: account
          ? {
              id: account._id,
              accountName: account.accountName,
              accountNumber: account.accountNumber,
              balance: account.balance,
              currency: account.currency,
            }
          : null,
      });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: "Login failed" });
    }
  }
);

module.exports = router;
