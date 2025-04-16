const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const path = require("path")
require("dotenv").config()

const transactionsRoutes = require("./routes/transactions")
const categoriesRoutes = require("./routes/categories")
const budgetsRoutes = require("./routes/budgets")

const app = express()
const PORT = process.env.PORT || 5000

app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/finance-tracker"
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err)
    process.exit(1)
  })

app.use("/api/transactions", transactionsRoutes)
app.use("/api/categories", categoriesRoutes)
app.use("/api/budgets", budgetsRoutes)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: "Something went wrong!" })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
