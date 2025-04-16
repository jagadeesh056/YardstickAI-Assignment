import { useState, useEffect } from "react"
import TransactionForm from "./components/TransactionForm"
import TransactionList from "./components/TransactionList"
import MonthlyChart from "./components/MonthlyChart"
import Dashboard from "./components/Dashboard"
import BudgetForm from "./components/BudgetForm"
import BudgetComparisonChart from "./components/BudgetComparisonChart"
import ClipLoader from "react-spinners/ClipLoader";
import { fetchTransactions, fetchCategories, fetchBudgets } from "./lib/api"
import "./styles/App.css"

function App() {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [budgets, setBudgets] = useState([])
  const [activeTab, setActiveTab] = useState("transactions")
  const [editTransaction, setEditTransaction] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const [transactionsData, categoriesData, budgetsData] = await Promise.all([
          fetchTransactions(),
          fetchCategories(),
          fetchBudgets(),
        ])

        setTransactions(transactionsData)
        setCategories(categoriesData)
        setBudgets(budgetsData)
      } catch (err) {
        console.error("Error loading data:", err)
        setError("Failed to load data. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleTransactionAdded = (newTransaction) => {
    setTransactions([...transactions, newTransaction])
  }

  const handleTransactionUpdated = (updatedTransaction) => {
    setTransactions(transactions.map((t) => (t._id === updatedTransaction._id ? updatedTransaction : t)))
    setEditTransaction(null)
  }

  const handleTransactionDeleted = (id) => {
    setTransactions(transactions.filter((t) => t._id !== id))
  }

  const handleEditClick = (transaction) => {
    setEditTransaction(transaction)
    setActiveTab("transactions")
  }

  const handleBudgetUpdated = (newBudget) => {
    const existingIndex = budgets.findIndex((b) => b.category === newBudget.category && b.month === newBudget.month)

    if (existingIndex >= 0) {
      const updatedBudgets = [...budgets]
      updatedBudgets[existingIndex] = newBudget
      setBudgets(updatedBudgets)
    } else {
      setBudgets([...budgets, newBudget])
    }
  }

  if (loading) return <div className="loading"><ClipLoader /></div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="app-container">
      <header>
        <h1>Personal Finance Visualizer</h1>
        <nav>
          <ul className="tabs">
            <li className={activeTab === "transactions" ? "active" : ""} onClick={() => setActiveTab("transactions")}>
              Transactions
            </li>
            <li className={activeTab === "dashboard" ? "active" : ""} onClick={() => setActiveTab("dashboard")}>
              Dashboard
            </li>
            <li className={activeTab === "budgeting" ? "active" : ""} onClick={() => setActiveTab("budgeting")}>
              Budgeting
            </li>
          </ul>
        </nav>
      </header>

      <main>
        {activeTab === "transactions" && (
          <div className="transactions-container">
            <TransactionForm
              onTransactionAdded={handleTransactionAdded}
              onTransactionUpdated={handleTransactionUpdated}
              editTransaction={editTransaction}
              categories={categories}
            />
            <TransactionList transactions={transactions} onDelete={handleTransactionDeleted} onEdit={handleEditClick} />
            <MonthlyChart transactions={transactions} />
          </div>
        )}

        {activeTab === "dashboard" && <Dashboard transactions={transactions} categories={categories} />}

        {activeTab === "budgeting" && (
          <div className="budgeting-container">
            <BudgetForm categories={categories} onBudgetUpdated={handleBudgetUpdated} existingBudgets={budgets} />
            <BudgetComparisonChart transactions={transactions} budgets={budgets} />
          </div>
        )}
      </main>
    </div>
  )
}

export default App
