const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Account",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["credit", "debit"],
      required: true,
    },
    description: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["completed", "pending", "failed"],
      default: "completed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);
