import { useState, useEffect } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts"
import "../styles/Charts.css"

function BudgetComparisonChart({ transactions, budgets }) {
  const [chartData, setChartData] = useState([])
  const [selectedMonth, setSelectedMonth] = useState("")
  const [availableMonths, setAvailableMonths] = useState([])

  useEffect(() => {
    if (!budgets.length || !transactions.length) {
      setChartData([])
      return
    }

    // Get unique months from budgets
    const months = [...new Set(budgets.map((b) => b.month))].sort().reverse()
    setAvailableMonths(months)

    if (months.length && !selectedMonth) {
      setSelectedMonth(months[0])
    }
  }, [budgets, transactions, selectedMonth])

  useEffect(() => {
    if (!selectedMonth || !budgets.length || !transactions.length) {
      setChartData([])
      return
    }

    const monthlyBudgets = budgets.filter((b) => b.month === selectedMonth)

    if (!monthlyBudgets.length) {
      setChartData([])
      return
    }

    const startDate = new Date(`${selectedMonth}-01`)
    const endDate = new Date(startDate)
    endDate.setMonth(endDate.getMonth() + 1)
    endDate.setDate(0)

    const monthlyTransactions = transactions.filter((t) => {
      const date = new Date(t.date)
      return date >= startDate && date <= endDate
    })

    const categorySpending = {}
    monthlyTransactions.forEach((t) => {
      const category = t.category || "Uncategorized"
      categorySpending[category] = (categorySpending[category] || 0) + t.amount
    })

    // Prepare chart data
    const data = monthlyBudgets.map((budget) => {
      const actual = categorySpending[budget.category] || 0
      const remaining = budget.amount - actual
      const percentUsed = (actual / budget.amount) * 100

      return {
        category: budget.category,
        budget: budget.amount,
        actual: actual,
        remaining: remaining > 0 ? remaining : 0,
        overspent: remaining < 0 ? Math.abs(remaining) : 0,
        percentUsed: percentUsed.toFixed(0) + "%",
      }
    })

    setChartData(data)
  }, [selectedMonth, budgets, transactions])

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value)
  }

  const formatMonthDisplay = (monthStr) => {
    if (!monthStr) return ""
    const date = new Date(`${monthStr}-01`)
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
  }

  if (!budgets.length) {
    return (
      <div className="chart-container">
        <h2>Budget vs. Actual Spending</h2>
        <div className="no-data">No budget data available. Please set budgets first.</div>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>Budget vs. Actual Spending</h2>
        <div className="chart-controls">
          <select value={selectedMonth} onChange={handleMonthChange}>
            <option value="">Select Month</option>
            {availableMonths.map((month) => (
              <option key={month} value={month}>
                {formatMonthDisplay(month)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {chartData.length > 0 ? (
        <div className="chart-wrapper">
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis tickFormatter={(value) => `${value}`} width={80} />
              <Tooltip
                formatter={(value, name) => {
                  if (name === "budget") return [`${value.toFixed(2)}`, "Budget"]
                  if (name === "actual") return [`${value.toFixed(2)}`, "Actual Spending"]
                  if (name === "remaining") return [`${value.toFixed(2)}`, "Remaining"]
                  if (name === "overspent") return [`${value.toFixed(2)}`, "Overspent"]
                  return [value, name]
                }}
              />
              <Legend />
              <Bar dataKey="budget" name="Budget" fill="#8884d8" />
              <Bar dataKey="actual" name="Actual Spending" fill="#82ca9d" />
              <ReferenceLine y={0} stroke="#000" />
            </BarChart>
          </ResponsiveContainer>

          <div className="budget-insights">
            <h3>Spending Insights for {formatMonthDisplay(selectedMonth)}</h3>
            <ul className="insights-list">
              {chartData.map((item) => (
                <li key={item.category} className={`insight-item ${item.overspent > 0 ? "overspent" : ""}`}>
                  <div className="insight-category">{item.category}</div>
                  <div className="insight-bar">
                    <div
                      className="insight-progress"
                      style={{
                        width: `${Math.min(item.percentUsed, 100)}%`,
                        backgroundColor: item.overspent > 0 ? "#ff6b6b" : "#82ca9d",
                      }}
                    ></div>
                  </div>
                  <div className="insight-details">
                    <span className="insight-percent">{item.percentUsed}</span>
                    <span className="insight-values">
                      ${item.actual.toFixed(2)} of ${item.budget.toFixed(2)}
                    </span>
                    {item.overspent > 0 ? (
                      <span className="insight-warning">Overspent by ${item.overspent.toFixed(2)}</span>
                    ) : (
                      <span className="insight-remaining">${item.remaining.toFixed(2)} remaining</span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : (
        <div className="no-data">
          {selectedMonth
            ? `No budget data available for ${formatMonthDisplay(selectedMonth)}`
            : "Please select a month to view budget comparison"}
        </div>
      )}
    </div>
  )
}

export default BudgetComparisonChart
