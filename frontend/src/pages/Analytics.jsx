import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';
import api from '../api';
import EmptyContainer from '../components/EmptyContainer';

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- COLORS FOR CHARTS ---
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, logRes, taskRes] = await Promise.all([
          api.get('/api/expenses/'),
          api.get('/api/activity-logs/'),
          api.get('/api/tasks/')
        ]);
        setExpenses(expRes.data);
        setLogs(logRes.data);
        setTasks(taskRes.data);
      } catch (error) {
        console.error("Error fetching analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // --- 1. PREPARE EXPENSE DATA (Group by Category) ---
  const expenseData = expenses.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) {
      found.value += parseFloat(curr.amount);
    } else {
      acc.push({ name: curr.category, value: parseFloat(curr.amount) });
    }
    return acc;
  }, []);

  // --- 2. PREPARE ACTIVITY DATA (Last 7 Days) ---
  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(subDays(new Date(), i));
    }
    return days;
  };

  const activityData = getLast7Days().map(day => {
    // Count "completed" actions for this specific day
    const count = logs.filter(log => {
        const logDate = parseISO(log.timestamp);
        return isSameDay(logDate, day) && log.action.toLowerCase().includes('completed');
    }).length;

    return {
      date: format(day, 'MMM dd'), // e.g., "Nov 23"
      completed: count
    };
  });

  // --- 3. QUICK STATS ---
  const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const completedTaskCount = tasks.filter(t => t.status === 'Done').length;
  const pendingTaskCount = tasks.filter(t => t.status !== 'Done').length;

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-500 mt-1">Visual insights into your projects and spending.</p>
      </div>

      {/* KPI Cards */}
      <div className="flex justify-around gap-4">
        <div className="bg-purple-600 p-6 rounded-xl justify-between w-full shadow-sm border border-green-100 flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-50 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-green-100 rounded-full text-green-600">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-green-600 p-6 rounded-xl justify-between w-full shadow-sm border border-blue-100 flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-50 font-medium">Tasks Completed</p>
            <p className="text-2xl font-bold text-gray-900">{completedTaskCount}</p>
          </div>
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-amber-600 p-6 rounded-xl justify-between w-full shadow-sm border border-orange-100 flex items-center gap-4">
          <div>
            <p className="text-sm text-gray-50 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-gray-900">{pendingTaskCount}</p>
          </div>
                    <div className="p-3 bg-orange-100 rounded-full text-orange-600">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Chart 1: Expense Breakdown */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <DollarSign size={18} className="text-gray-400"/> Expense Breakdown
            </h3>
          </div>
          
          {expenseData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                  label
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <EmptyContainer title="No Expenses Yet" description="Add expenses to see the breakdown." />
          )}
        </div>

        {/* Chart 2: Productivity Trends */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 h-96">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-gray-400"/> Productivity (Last 7 Days)
            </h3>
          </div>

          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={activityData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{fontSize: 12}} />
              <YAxis allowDecimals={false} />
              <Tooltip 
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="completed" name="Tasks Done" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
};

export default Analytics;