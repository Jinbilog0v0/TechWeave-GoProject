import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ExpenseDisplay from '../Components/ExpenseDisplay';
import { Plus, Trash2 } from 'lucide-react';

const ExpenseTrack = ({ user, onLogout }) => {
  const [expenses, setExpenses] = useState([
    { id: 1, description: 'Project Meeting Lunch', amount: 500, category: 'Food', date: '2024-11-08' },
    { id: 2, description: 'Software License', amount: 2000, category: 'Software', date: '2024-11-05' },
    { id: 3, description: 'Office Supplies', amount: 800, category: 'Supplies', date: '2024-11-03' },
    { id: 4, description: 'Transportation', amount: 1200, category: 'Travel', date: '2024-11-07' }
  ]);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food',
    date: new Date().toISOString().split('T')[0]
  });

  const handleAddExpense = () => {
    if (newExpense.description && newExpense.amount) {
      setExpenses([
        ...expenses,
        {
          id: Date.now(),
          ...newExpense,
          amount: parseFloat(newExpense.amount)
        }
      ]);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Food',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800">Expense Tracker</h2>
          <p className="text-gray-600">Track and manage your project expenses</p>
        </div>

        <ExpenseDisplay expenses={expenses} />

        {/* Add Expense Form */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4">Add New Expense</h3>
          <div className="grid grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <input
              type="number"
              placeholder="Amount"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="Food">Food</option>
              <option value="Software">Software</option>
              <option value="Supplies">Supplies</option>
              <option value="Travel">Travel</option>
              <option value="Other">Other</option>
            </select>
            <button
              onClick={handleAddExpense}
              className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800"
            >
              <Plus size={20} />
              <span>Add</span>
            </button>
          </div>
        </div>

        {/* Expenses List */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold mb-4">Recent Expenses</h3>
          <div className="space-y-3">
            {expenses.map(expense => (
              <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex-1">
                  <p className="font-medium">{expense.description}</p>
                  <p className="text-sm text-gray-600">{expense.category} • {expense.date}</p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-lg font-bold text-green-700">₱{expense.amount.toLocaleString()}</span>
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
  );
};

export default ExpenseTrack;