import { useState } from "react"
import { deleteTransaction } from "../lib/api"
import "../styles/TransactionList.css"

function TransactionList({ transactions, onDelete, onEdit }) {
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState(null)

  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedTransactions = [...transactions].sort((a, b) => {
    let aValue = a[sortField]
    let bValue = b[sortField]

    if (sortField === "date") {
      aValue = new Date(aValue)
      bValue = new Date(bValue)
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1
    return 0
  })

  const handleDeleteClick = async (id) => {
    if (deleteConfirm === id) {
      try {
        setIsDeleting(true)
        setError(null)
        await deleteTransaction(id)
        onDelete(id)
      } catch (err) {
        console.error("Error deleting transaction:", err)
        setError("Failed to delete transaction. Please try again.")
      } finally {
        setIsDeleting(false)
        setDeleteConfirm(null)
      }
    } else {
      setDeleteConfirm(id)
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  if (transactions.length === 0) {
    return (
      <div className="transaction-list-container">
        <h2>Transactions</h2>
        <div className="no-transactions">No transactions found. Add one to get started!</div>
      </div>
    )
  }

  return (
    <div className="transaction-list-container">
      <h2>Transactions</h2>

      {error && <div className="error-message">{error}</div>}

      <div className="transaction-list-wrapper">
        <table className="transaction-list">
          <thead>
            <tr>
              <th onClick={() => handleSort("date")} className="sortable">
                Date {sortField === "date" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th onClick={() => handleSort("description")} className="sortable">
                Description {sortField === "description" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              {transactions.some((t) => t.category) && (
                <th onClick={() => handleSort("category")} className="sortable">
                  Category {sortField === "category" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              <th onClick={() => handleSort("amount")} className="sortable">
                Amount {sortField === "amount" && (sortDirection === "asc" ? "↑" : "↓")}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedTransactions.map((transaction) => (
              <tr key={transaction._id}>
                <td>{formatDate(transaction.date)}</td>
                <td>{transaction.description}</td>
                {transactions.some((t) => t.category) && <td>{transaction.category || "-"}</td>}
                <td className="amount">{formatAmount(transaction.amount)}</td>
                <td className="actions">
                  <button className="btn-edit" onClick={() => onEdit(transaction)} disabled={isDeleting}>
                    Edit
                  </button>
                  <button
                    className={`btn-delete ${deleteConfirm === transaction._id ? "confirm" : ""}`}
                    onClick={() => handleDeleteClick(transaction._id)}
                    disabled={isDeleting && deleteConfirm !== transaction._id}
                  >
                    {deleteConfirm === transaction._id ? (isDeleting ? "Deleting..." : "Confirm") : "Delete"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default TransactionList
