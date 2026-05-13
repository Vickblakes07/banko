const mongoose = require("mongoose");

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    accountName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, unique: true },
    currency: { type: String, default: "USD" },
    balance: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Account", accountSchema);
