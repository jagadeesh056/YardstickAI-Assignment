const mongoose = require("mongoose")

const budgetSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    month: {
      type: String,
      required: true,
    },
  },
  { timestamps: true },
)

budgetSchema.index({ category: 1, month: 1 }, { unique: true })

module.exports = mongoose.model("Budget", budgetSchema)
