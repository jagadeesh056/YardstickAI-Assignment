# Personal Finance Visualizer

A comprehensive web application for tracking, managing, and visualizing personal finances, including transactions, budgeting, and financial insights.

## Features

- **Transaction Management**: Add, edit, and delete financial transactions with categorization
- **Financial Dashboard**: View key metrics and visualizations of your spending patterns
- **Budgeting Tools**: Set and track budgets by category and month
- **Interactive Charts**: Visualize spending trends and budget comparisons
- **Responsive Design**: Works on desktop and mobile devices

## Technology Stack

### Frontend
- React.js
- Recharts for data visualization
- CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB for data storage
- RESTful API architecture

## Project Structure

```
project-root/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TransactionForm.js
│   │   │   ├── TransactionList.js
│   │   │   ├── MonthlyChart.js
│   │   │   ├── Dashboard.js
│   │   │   ├── BudgetForm.js
│   │   │   └── BudgetComparisonChart.js
│   │   ├── lib/
│   │   │   └── api.js
│   │   ├── styles/
│   │   │   ├── App.css
│   │   │   ├── Charts.css
│   │   │   └── Dashboard.css
│   │   └── App.js
│   └── public/
├── backend/
│   ├── routes/
│   │   ├── transactions.js
│   │   ├── categories.js
│   │   └── budgets.js
│   ├── models/
│   │   ├── transaction.js
│   │   ├── category.js
│   │   └── budget.js
│   └── server.js
└── README.md
```

## API Endpoints

### Transactions
- `GET /api/transactions` - Get all transactions
- `GET /api/transactions/:id` - Get a single transaction
- `POST /api/transactions` - Create a new transaction
- `PUT /api/transactions/:id` - Update a transaction
- `DELETE /api/transactions/:id` - Delete a transaction

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create a new category
- `DELETE /api/categories/:id` - Delete a category

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get a single budget
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

## Data Models

### Transaction
```javascript
{
  _id: ObjectId,
  amount: Number,
  date: Date,
  description: String,
  category: String
}
```

### Category
```javascript
{
  _id: ObjectId,
  name: String
}
```

### Budget
```javascript
{
  _id: ObjectId,
  category: String,
  amount: Number,
  month: String // Format: "YYYY-MM"
}
```

## Installation and Setup

### Prerequisites
- Node.js (v14+)
- MongoDB

### Backend Setup
1. Clone the repository
   ```
   git clone https://github.com/yourusername/personal-finance-visualizer.git
   cd personal-finance-visualizer/backend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with your MongoDB connection string
   ```
   MONGODB_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the server
   ```
   npm start
   ```

### Frontend Setup
1. Navigate to the frontend directory
   ```
   cd ../frontend
   ```

2. Install dependencies
   ```
   npm install
   ```

3. Create a `.env` file with your API URL
   ```
   REACT_APP_API_URL=http://localhost:5000/api
   ```

4. Start the development server
   ```
   npm start
   ```

5. Access the application at `http://localhost:3000`

## Usage

### Adding Transactions
1. Navigate to the "Transactions" tab
2. Fill out the transaction form with amount, date, description, and category
3. Click "Add Transaction"

### Setting Budgets
1. Navigate to the "Budgeting" tab
2. Select a category and month
3. Enter your budget amount
4. Click "Set Budget"

### Viewing Financial Insights
1. Navigate to the "Dashboard" tab to see your spending breakdown
2. Check the "Monthly Expenses" chart to track spending over time
3. Use the "Budget vs. Actual Spending" chart to monitor your budget adherence

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Recharts](https://recharts.org/)
