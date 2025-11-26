import React from 'react';
import { DollarSign, TrendingUp, Receipt, PhilippinePesoIcon } from 'lucide-react';

const ExpenseDisplay = ({ expenses }) => {
  const totalExpense = expenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  const thisMonthExpense = expenses
    .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((sum, exp) => sum + exp.amount, 0);

  // Calculate average expense
  const averageExpense = expenses.length > 0 ? totalExpense / expenses.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
      {/* Total Expenses Card */}
      <div className="bg-linear-to-br from-green-500 to-green-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Total Expenses</span>
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <PhilippinePesoIcon size={24} />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1">₱{totalExpense.toLocaleString()}</p>
        <p className="text-xs opacity-75">All time</p>
      </div>

      {/* This Month Card */}
      <div className="bg-linear-to-br from-blue-500 to-blue-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">This Month</span>
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <TrendingUp size={24} />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1">₱{thisMonthExpense.toLocaleString()}</p>
        <p className="text-xs opacity-75">
          {expenses.filter(exp => new Date(exp.date).getMonth() === new Date().getMonth()).length} items
        </p>
      </div>

      {/* Average Expense Card */}
      <div className="bg-gradient-to-br from-purple-500 to-purple-700 text-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium opacity-90">Average Expense</span>
          <div className="p-2 bg-white bg-opacity-20 rounded-lg">
            <Receipt size={24} />
          </div>
        </div>
        <p className="text-3xl font-bold mb-1">₱{averageExpense.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
        <p className="text-xs opacity-75">{expenses.length} total items</p>
      </div>
    </div>
  );
};

export default ExpenseDisplay;