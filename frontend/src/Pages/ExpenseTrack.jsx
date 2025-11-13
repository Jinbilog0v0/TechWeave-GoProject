import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ExpenseDisplay from '../Components/ExpenseDisplay';
import { Plus, X, Trash2 } from 'lucide-react';

const ExpenseTrack = ({ user, onLogout }) => {
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
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Expense Tracker</h2>
              <p className="text-gray-600">Track and manage your project expenses</p>
            </div>

            <button
              onClick={() => setShowForm(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition"
            >
              <Plus size={20} />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Expense Summary / Display Component */}
          <ExpenseDisplay expenses={expenses} />

          {/* Add Expense Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Expense</h3>

                <form onSubmit={handleAddExpense} className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Description</label>
                    <input
                      type="text"
                      placeholder="Expense Description"
                      value={newExpense.description}
                      onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Amount (₱)</label>
                    <input
                      type="number"
                      placeholder="Amount"
                      value={newExpense.amount}
                      onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Category</label>
                    <select
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                    >
                      <option value="Food">Food</option>
                      <option value="Software">Software</option>
                      <option value="Supplies">Supplies</option>
                      <option value="Travel">Travel</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Date</label>
                    <input
                      type="date"
                      value={newExpense.date}
                      onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                      className="w-full p-2 border rounded focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                  >
                    Add Expense
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Expenses List */}
          <div className="bg-white rounded-xl shadow-lg p-6 mt-8">
            <h3 className="text-xl font-bold mb-4">Recent Expenses</h3>
            <div className="space-y-3">
              {expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                >
                  <div className="flex-1">
                    <p className="font-medium">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      {expense.category} • {expense.date}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-lg font-bold text-green-700">
                      ₱{expense.amount.toLocaleString()}
                    </span>
                    <button
                      onClick={() => handleDeleteExpense(expense.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseTrack;