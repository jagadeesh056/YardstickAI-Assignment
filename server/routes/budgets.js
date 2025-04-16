const express = require("express")
const router = express.Router()
const Budget = require("../models/budget")

// Get all budgets
router.get("/", async (req, res) => {
  try {
    const budgets = await Budget.find().sort({ month: -1 })
    res.json(budgets)
  } catch (err) {
    console.error("Error fetching budgets:", err)
    res.status(500).json({ error: "Failed to fetch budgets" })
  }
})

// Get a single budget
router.get("/:id", async (req, res) => {
  try {
    const budget = await Budget.findById(req.params.id)
    if (!budget) {
      return res.status(404).json({ error: "Budget not found" })
    }
    res.json(budget)
  } catch (err) {
    console.error("Error fetching budget:", err)
    res.status(500).json({ error: "Failed to fetch budget" })
  }
})

// Create a budget
router.post("/", async (req, res) => {
  try {
    const { category, amount, month } = req.body

    // Validate required fields
    if (!category || !amount || !month) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const existingBudget = await Budget.findOne({ category, month })

    if (existingBudget) {
      existingBudget.amount = Number(amount)
      const updatedBudget = await existingBudget.save()
      return res.json(updatedBudget)
    }

    // Create new budget
    const budget = new Budget({
      category,
      amount: Number(amount),
      month,
    })

    const savedBudget = await budget.save()
    res.status(201).json(savedBudget)
  } catch (err) {
    console.error("Error creating budget:", err)
    res.status(500).json({ error: "Failed to create budget" })
  }
})

// Update a budget
router.put("/:id", async (req, res) => {
  try {
    const { category, amount, month } = req.body

    // Validate required fields
    if (!category || !amount || !month) {
      return res.status(400).json({ error: "Missing required fields" })
    }

    const updatedBudget = await Budget.findByIdAndUpdate(
      req.params.id,
      {
        category,
        amount: Number(amount),
        month,
      },
      { new: true },
    )

    if (!updatedBudget) {
      return res.status(404).json({ error: "Budget not found" })
    }

    res.json(updatedBudget)
  } catch (err) {
    console.error("Error updating budget:", err)
    res.status(500).json({ error: "Failed to update budget" })
  }
})

// Delete a budget
router.delete("/:id", async (req, res) => {
  try {
    const deletedBudget = await Budget.findByIdAndDelete(req.params.id)

    if (!deletedBudget) {
      return res.status(404).json({ error: "Budget not found" })
    }

    res.json({ success: true, id: req.params.id })
  } catch (err) {
    console.error("Error deleting budget:", err)
    res.status(500).json({ error: "Failed to delete budget" })
  }
})

module.exports = router
