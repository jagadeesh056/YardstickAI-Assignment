import { useState, useEffect } from "react"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"
import "../styles/Dashboard.css"

function Dashboard({ transactions, categories }) {
  const [categoryData, setCategoryData] = useState([])
  const [summaryData, setSummaryData] = useState({
    totalExpenses: 0,
    avgTransaction: 0,
    transactionCount: 0,
  })
  const [recentTransactions, setRecentTransactions] = useState([])
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C"]

  useEffect(() => {
    if (!transactions.length) return
    const total = transactions.reduce((sum, t) => sum + t.amount, 0)
    const count = transactions.length

    setSummaryData({
      totalExpenses: total,
      avgTransaction: total / count,
      transactionCount: count,
    })

    const sorted = [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

    setRecentTransactions(sorted)

    if (categories.length) {
      const categoryTotals = {}

      categories.forEach((cat) => {
        categoryTotals[cat.name] = 0
      })

      categoryTotals["Uncategorized"] = 0

      transactions.forEach((transaction) => {
        const category = transaction.category || "Uncategorized"
        categoryTotals[category] = (categoryTotals[category] || 0) + transaction.amount
      })

      const categoryArray = Object.entries(categoryTotals)
        .filter(([ value]) => value > 0)
        .map(([name, value], index) => ({
          name,
          value,
          color: COLORS[index % COLORS.length],
        }))

      setCategoryData(categoryArray)
    }
  }, [transactions, categories])

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
  }

  if (!transactions.length) {
    return (
      <div className="dashboard-container">
        <h2>Dashboard</h2>
        <div className="no-data">No transaction data available for dashboard</div>
      </div>
    )
  }

  return (
    <div className="dashboard-container">
      <h2>Dashboard</h2>

      <div className="summary-cards">
        <div className="summary-card">
          <h3>Total Expenses</h3>
          <div className="card-value">{formatCurrency(summaryData.totalExpenses)}</div>
        </div>

        <div className="summary-card">
          <h3>Average Transaction</h3>
          <div className="card-value">{formatCurrency(summaryData.avgTransaction)}</div>
        </div>

        <div className="summary-card">
          <h3>Transaction Count</h3>
          <div className="card-value">{summaryData.transactionCount}</div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="category-chart">
          <h3>Category Breakdown</h3>

          {categoryData.length > 0 ? (
            <div className="chart-wrapper">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(value)} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="no-data">No category data available</div>
          )}
        </div>

        <div className="recent-transactions">
          <h3>Recent Transactions</h3>

          <ul className="recent-list">
            {recentTransactions.map((transaction) => (
              <li key={transaction._id} className="recent-item">
                <div className="recent-date">{formatDate(transaction.date)}</div>
                <div className="recent-description">{transaction.description}</div>
                <div className="recent-category">{transaction.category || "Uncategorized"}</div>
                <div className="recent-amount">{formatCurrency(transaction.amount)}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
