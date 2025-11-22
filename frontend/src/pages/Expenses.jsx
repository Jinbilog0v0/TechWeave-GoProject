import React, { useState } from 'react';
import ExpenseDisplay from '../components/ExpenseDisplay.jsx';
import { Plus, X, Trash2, DollarSign } from 'lucide-react';

const Expenses = () => {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Project Meeting Lunch', amount: 500, category: 'Food', date: '2024-11-08' },
    { id: 2, description: 'Software License', amount: 2000, category: 'Software', date: '2024-11-05' },
    { id: 3, description: 'Office Supplies', amount: 800, category: 'Supplies', date: '2024-11-03' },
    { id: 4, description: 'Transportation', amount: 1200, category: 'Travel', date: '2024-11-07' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0],
  });

  const handleAddExpense = (e) => {
    e.preventDefault();

    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in all required fields.');
      return;
    }

    setExpenses([
      ...expenses,
      {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount),
      },
    ]);

    setNewExpense({
      description: '',
      amount: '',
      category: 'Food',
      date: new Date().toISOString().split('T')[0],
    });
    setShowForm(false);
  };

  const handleDeleteExpense = (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      setExpenses(expenses.filter((exp) => exp.id !== id));
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Expense Tracker</h2>
          <p className="text-gray-600 mt-1">Track and manage your project expenses</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Expense Summary / Display Component */}
      <ExpenseDisplay expenses={expenses} />

      {/* Expenses List */}
      {expenses.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md p-6 mt-8 border border-gray-200">
          <h3 className="text-xl font-bold mb-6 text-gray-800">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div
                key={expense.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
              >
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{expense.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                      {expense.category}
                    </span>
                    <span className="text-xs text-gray-500">{expense.date}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4 ml-4">
                  <span className="text-lg font-bold text-green-700 whitespace-nowrap">
                    ₱{expense.amount.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDeleteExpense(expense.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition flex-shrink-0"
                    title="Delete Expense"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-xl shadow-md border border-gray-200 mt-8">
          <div className="text-gray-400 mb-4">
            <DollarSign size={64} strokeWidth={1} />
          </div>
          <h3 className="text-xl font-semibold text-gray-700 mb-2">No expenses yet</h3>
          <p className="text-gray-500 mb-6">Start tracking your project expenses</p>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center space-x-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg"
          >
            <Plus size={20} />
            <span>Add First Expense</span>
          </button>
        </div>
      )}

      {/* Add Expense Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-gray-800 mb-6">Add New Expense</h3>

            <form onSubmit={handleAddExpense} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description *
                </label>
                <input
                  type="text"
                  placeholder="Enter expense description"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amount (₱) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                >
                  <option value="Food">Food</option>
                  <option value="Software">Software</option>
                  <option value="Supplies">Supplies</option>
                  <option value="Travel">Travel</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition font-semibold shadow-md hover:shadow-lg"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;