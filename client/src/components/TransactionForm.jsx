import { useState, useEffect } from "react"
import { createTransaction, updateTransaction } from "../lib/api"
import "../styles/TransactionForm.css"

function TransactionForm({ onTransactionAdded, onTransactionUpdated, editTransaction, categories }) {
  const [formData, setFormData] = useState({
    amount: "",
    date: new Date().toISOString().split("T")[0],
    description: "",
    category: "",
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)

  useEffect(() => {
    if (editTransaction) {
      setFormData({
        amount: editTransaction.amount,
        date: new Date(editTransaction.date).toISOString().split("T")[0],
        description: editTransaction.description,
        category: editTransaction.category || "",
      })
    }
  }, [editTransaction])

  const validateForm = () => {
    const newErrors = {}

    if (!formData.amount) {
      newErrors.amount = "Amount is required"
    } else if (isNaN(formData.amount) || Number(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number"
    }

    if (!formData.date) {
      newErrors.date = "Date is required"
    }

    if (!formData.description) {
      newErrors.description = "Description is required"
    }

    if (categories.length > 0 && !formData.category) {
      newErrors.category = "Category is required"
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

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
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

      const transactionData = {
        ...formData,
        amount: Number(formData.amount),
      }

      if (editTransaction) {
        const updatedTransaction = await updateTransaction(editTransaction._id, transactionData)
        onTransactionUpdated(updatedTransaction)
      } else {
        const newTransaction = await createTransaction(transactionData)
        onTransactionAdded(newTransaction)
        setFormData({
          amount: "",
          date: new Date().toISOString().split("T")[0],
          description: "",
          category: "",
        })
      }
    } catch (err) {
      console.error("Error submitting transaction:", err)
      setSubmitError("Failed to save transaction. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="transaction-form-container">
      <h2>{editTransaction ? "Edit Transaction" : "Add Transaction"}</h2>

      {submitError && <div className="error-message">{submitError}</div>}

      <form onSubmit={handleSubmit} className="transaction-form">
        <div className="form-group">
          <label htmlFor="amount">Amount ($)</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="Enter amount"
            step="0.01"
            min="0.01"
            disabled={isSubmitting}
          />
          {errors.amount && <span className="error">{errors.amount}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="date">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            disabled={isSubmitting}
          />
          {errors.date && <span className="error">{errors.date}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Enter description"
            disabled={isSubmitting}
          />
          {errors.description && <span className="error">{errors.description}</span>}
        </div>

        {categories.length > 0 && (
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
        )}

        <div className="form-actions">
          <button type="submit" className="btn-submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : editTransaction ? "Update" : "Add"}
          </button>

          {editTransaction && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => onTransactionUpdated(editTransaction)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  )
}

export default TransactionForm
