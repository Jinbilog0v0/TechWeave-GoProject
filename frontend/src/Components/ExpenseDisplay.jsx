import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const ExpenseDisplay = ({ expenses }) => {
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  const thisMonthExpense = expenses
    .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="grid grid-cols-3 gap-6 mb-6">
      <div className="bg-gradient-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Total Expenses</span>
          <DollarSign size={24} />
        </div>
        <p className="text-3xl font-bold">₱{totalExpense.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">This Month</span>
          <TrendingUp size={24} />
        </div>
        <p className="text-3xl font-bold">₱{thisMonthExpense.toLocaleString()}</p>
      </div>

      <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm opacity-90">Total Items</span>
          <TrendingDown size={24} />
        </div>
        <p className="text-3xl font-bold">{expenses.length}</p>
      </div>
    </div>
  );
};

export default ExpenseDisplay;