const API_URL = "https://yardstickai-assignment.onrender.com/api"

export async function fetchTransactions() {
  try {
    const response = await fetch(`${API_URL}/transactions`)
    if (!response.ok) {
      throw new Error("Failed to fetch transactions")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

export async function createTransaction(transactionData) {
  try {
    const response = await fetch(`${API_URL}/transactions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })

    if (!response.ok) {
      throw new Error("Failed to create transaction")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}

export async function updateTransaction(id, transactionData) {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(transactionData),
    })

    if (!response.ok) {
      throw new Error("Failed to update transaction")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating transaction:", error)
    throw error
  }
}

export async function deleteTransaction(id) {
  try {
    const response = await fetch(`${API_URL}/transactions/${id}`, {
      method: "DELETE",
    })

    if (!response.ok) {
      throw new Error("Failed to delete transaction")
    }

    return await response.json()
  } catch (error) {
    console.error("Error deleting transaction:", error)
    throw error
  }
}

// API functions for categories
export async function fetchCategories() {
  try {
    const response = await fetch(`${API_URL}/categories`)
    if (!response.ok) {
      throw new Error("Failed to fetch categories")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching categories:", error)
    throw error
  }
}

export async function createCategory(categoryData) {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoryData),
    })

    if (!response.ok) {
      throw new Error("Failed to create category")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating category:", error)
    throw error
  }
}

// API functions for budgets
export async function fetchBudgets() {
  try {
    const response = await fetch(`${API_URL}/budgets`)
    if (!response.ok) {
      throw new Error("Failed to fetch budgets")
    }
    return await response.json()
  } catch (error) {
    console.error("Error fetching budgets:", error)
    throw error
  }
}

export async function createBudget(budgetData) {
  try {
    const response = await fetch(`${API_URL}/budgets`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    })

    if (!response.ok) {
      throw new Error("Failed to create budget")
    }

    return await response.json()
  } catch (error) {
    console.error("Error creating budget:", error)
    throw error
  }
}

export async function updateBudget(id, budgetData) {
  try {
    const response = await fetch(`${API_URL}/budgets/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(budgetData),
    })

    if (!response.ok) {
      throw new Error("Failed to update budget")
    }

    return await response.json()
  } catch (error) {
    console.error("Error updating budget:", error)
    throw error
  }
}
