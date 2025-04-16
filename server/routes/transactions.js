const express = require("express")
const router = express.Router()
const Transaction = require("../models/transaction")

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 })
    res.json(transactions)
  } catch (err) {
    console.error("Error fetching transactions:", err)
    res.status(500).json({ error: "Failed to fetch transactions" })
  }
})

// Get a single transaction
router.get("/:id", async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }
    res.json(transaction)
  } catch (err) {
    console.error("Error fetching transaction:", err)
    res.status(500).json({ error: "Failed to fetch transaction" })
  }
})

// Create a transaction
router.post("/", async (req, res) => {
  try {
    const { amount, date, description, category } = req.body
    if (!amount || !date || !description) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const transaction = new Transaction({
      amount: Number(amount),
      date: new Date(date),
      description,
      category,
    })

    const savedTransaction = await transaction.save()
    res.status(201).json(savedTransaction)
  } catch (err) {
    console.error("Error creating transaction:", err)
    res.status(500).json({ error: "Failed to create transaction" })
  }
})

// Update a transaction
router.put("/:id", async (req, res) => {
  try {
    const { amount, date, description, category } = req.body
    if (!amount || !date || !description) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      {
        amount: Number(amount),
        date: new Date(date),
        description,
        category,
      },
      { new: true },
    )

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }

    res.json(updatedTransaction)
  } catch (err) {
    console.error("Error updating transaction:", err)
    res.status(500).json({ error: "Failed to update transaction" })
  }
})

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    const deletedTransaction = await Transaction.findByIdAndDelete(req.params.id)
    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" })
    }
    res.json({ success: true, id: req.params.id })
  } catch (err) {
    console.error("Error deleting transaction:", err)
    res.status(500).json({ error: "Failed to delete transaction" })
  }
})

module.exports = router
