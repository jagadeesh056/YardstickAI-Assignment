const express = require("express")
const router = express.Router()
const Category = require("../models/category")

// Default categories
const DEFAULT_CATEGORIES = [
  { name: "Food" },
  { name: "Housing" },
  { name: "Transportation" },
  { name: "Utilities" },
  { name: "Entertainment" },
  { name: "Healthcare" },
  { name: "Shopping" },
  { name: "Personal" },
  { name: "Education" },
  { name: "Travel" },
]

// Get all categories
router.get("/", async (req, res) => {
  try {
    let categories = await Category.find().sort({ name: 1 })
    if (categories.length === 0) {
      await Category.insertMany(DEFAULT_CATEGORIES)
      categories = await Category.find().sort({ name: 1 })
    }

    res.json(categories)
  } catch (err) {
    console.error("Error fetching categories:", err)
    res.status(500).json({ error: "Failed to fetch categories" })
  }
})

// Create a category
router.post("/", async (req, res) => {
  try {
    const { name } = req.body
    if (!name) {
      return res.status(400).json({ error: "Category name is required" })
    }

    const existingCategory = await Category.findOne({ name })
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" })
    }

    const category = new Category({ name })
    const savedCategory = await category.save()

    res.status(201).json(savedCategory)
  } catch (err) {
    console.error("Error creating category:", err)
    res.status(500).json({ error: "Failed to create category" })
  }
})

// Delete a category
router.delete("/:id", async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id)

    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" })
    }

    res.json({ success: true, id: req.params.id })
  } catch (err) {
    console.error("Error deleting category:", err)
    res.status(500).json({ error: "Failed to delete category" })
  }
})

module.exports = router
