import { useState, useEffect } from "react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import "../styles/Charts.css"

function MonthlyChart({ transactions }) {
  const [chartData, setChartData] = useState([])
  const [timeRange, setTimeRange] = useState("6months")

  useEffect(() => {
    if (!transactions.length) {
      setChartData([])
      return
    }

    const monthlyData = {}

    const now = new Date()
    let startDate

    switch (timeRange) {
      case "3months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1)
        break
      case "6months":
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
        break
      case "1year":
        startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1)
        break
      default:
        startDate = new Date(now.getFullYear(), now.getMonth() - 6, 1)
    }

    const currentDate = new Date(startDate)
    while (currentDate <= now) {
      const monthKey = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}`
      monthlyData[monthKey] = { month: monthKey, total: 0 }
      currentDate.setMonth(currentDate.getMonth() + 1)
    }

    transactions.forEach((transaction) => {
      const date = new Date(transaction.date)
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`

      if (monthlyData[monthKey] && date >= startDate) {
        monthlyData[monthKey].total += transaction.amount
      }
    })

    const sortedData = Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month))

    const formattedData = sortedData.map((item) => {
      const [year, month] = item.month.split("-")
      const date = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)
      return {
        ...item,
        month: date.toLocaleDateString("en-US", { month: "short", year: "2-digit" }),
      }
    })

    setChartData(formattedData)
  }, [transactions, timeRange])

  const handleTimeRangeChange = (e) => {
    setTimeRange(e.target.value)
  }

  if (!transactions.length) {
    return (
      <div className="chart-container">
        <h2>Monthly Expenses</h2>
        <div className="no-data">No transaction data available for chart</div>
      </div>
    )
  }

  return (
    <div className="chart-container">
      <div className="chart-header">
        <h2>Monthly Expenses</h2>
        <div className="chart-controls">
          <select value={timeRange} onChange={handleTimeRangeChange}>
            <option value="3months">Last 3 Months</option>
            <option value="6months">Last 6 Months</option>
            <option value="1year">Last Year</option>
          </select>
        </div>
      </div>

      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `${value}`} width={80} />
            <Tooltip
              formatter={(value) => [`${value.toFixed(2)}`, "Total Expenses"]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar dataKey="total" name="Monthly Expenses" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default MonthlyChart
