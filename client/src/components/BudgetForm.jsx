import { useState } from "react"
import { createBudget, updateBudget } from "../lib/api"
import "../styles/BudgetForm.css"

function BudgetForm({ categories, onBudgetUpdated, existingBudgets }) {
  const [formData, setFormData] = useState({
    category: "",
    amount: "",
    month: new Date().toISOString().slice(0, 7),
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [submitSuccess, setSubmitSuccess] = useState(null)

  const validateForm = () => {
    const newErrors = {}

    if (!formData.category) {
      newErrors.category = "Category is required"
    }

    if (!formData.amount) {
      newErrors.amount = "Budget amount is required"
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Budget amount must be a positive number"
    }

    if (!formData.month) {
      newErrors.month = "Month is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }

    if (submitSuccess) {
      setSubmitSuccess(null)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const budgetData = {
        ...formData,
        amount: Number(formData.amount),
      }

      const existingBudget = existingBudgets.find(
        (b) => b.category === budgetData.category && b.month === budgetData.month,
      )

      let result
      if (existingBudget) {
        result = await updateBudget(existingBudget._id, budgetData)
        setSubmitSuccess(`Budget for ${budgetData.category} updated successfully`)
      } else {
        result = await createBudget(budgetData)
        setSubmitSuccess(`Budget for ${budgetData.category} created successfully`)
      }

      onBudgetUpdated(result)

      setFormData({
        ...formData,
        amount: "",
      })
    } catch (err) {
      console.error("Error submitting budget:", err)
      setSubmitError("Failed to save budget. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const monthOptions = []
  for (let i = 0; i < 12; i++) {
    const date = new Date()
    date.setMonth(date.getMonth() + i)
    const monthValue = date.toISOString().slice(0, 7)
    const monthLabel = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    monthOptions.push({ value: monthValue, label: monthLabel })
  }

  return (
    <div className="budget-form-container">
      <h2>Set Monthly Budget</h2>

      {submitError && <div className="error-message">{submitError}</div>}

      {submitSuccess && <div className="success-message">{submitSuccess}</div>}

      <form onSubmit={handleSubmit} className="budget-form">
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            disabled={isSubmitting}
          >
            <option value="">Select a category</option>
            {categories.map((category) => (
              <option key={category._id} value={category.name}>
                {category.name}
              </option>
            ))}
          </select>
          {errors.category && <span className="error">{errors.category}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="month">Month</label>
          <select id="month" name="month" value={formData.month} onChange={handleChange} disabled={isSubmitting}>
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          {errors.month && <span className="error">{errors.month}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="amount">Budget Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter budget amount"
            step="0.01"
            min="0.01"
            disabled={isSubmitting}
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Set Budget"}
          </button>
        </div>
      </form>

      {existingBudgets.length > 0 && (
        <div className="existing-budgets">
          <h3>Current Budgets</h3>
          <table className="budgets-table">
            <thead>
              <tr>
                <th>Category</th>
                <th>Month</th>
                <th>Budget Amount</th>
              </tr>
            </thead>
            <tbody>
              {existingBudgets
                .sort((a, b) => b.month.localeCompare(a.month) || a.category.localeCompare(b.category))
                .map((budget) => {
                  const date = new Date(budget.month + "-01")
                  const monthDisplay = date.toLocaleDateString("en-US", { month: "long", year: "numeric" })

                  return (
                    <tr key={`${budget.category}-${budget.month}`}>
                      <td>{budget.category}</td>
                      <td>{monthDisplay}</td>
                      <td className="amount">
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                        }).format(budget.amount)}
                      </td>
                    </tr>
                  )
                })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default BudgetForm
