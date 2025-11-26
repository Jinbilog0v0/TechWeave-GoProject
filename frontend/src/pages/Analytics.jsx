import React, { useState, useEffect } from 'react';
import { 
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, Legend, ResponsiveContainer 
} from 'recharts';
import { TrendingUp, DollarSign, CheckCircle2, AlertCircle } from 'lucide-react';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

// --- MOCKS FOR MISSING DEPENDENCIES ---

const api = {
  get: async (url) => {
    await new Promise(resolve => setTimeout(resolve, 800));
    if (url.includes('expenses')) {
        return { data: [
            { id: 1, amount: "150.00", category: "Software" },
            { id: 2, amount: "85.50", category: "Food" },
            { id: 3, amount: "32.00", category: "Travel" },
            { id: 4, amount: "120.00", category: "Software" },
            { id: 5, amount: "45.00", category: "Supplies" },
        ] };
    }
    if (url.includes('activity-logs')) {
        // Generate some fake logs for the last 7 days
        const logs = [];
        for(let i=0; i<7; i++) {
            const date = subDays(new Date(), i);
            const count = Math.floor(Math.random() * 5); // 0-4 tasks per day
            for(let j=0; j<count; j++) {
                logs.push({ timestamp: date.toISOString(), action: "Task Completed" });
            }
        }
        return { data: logs };
    }
    if (url.includes('tasks')) {
        return { data: [
            { id: 1, status: 'Done' },
            { id: 2, status: 'Done' },
            { id: 3, status: 'In Progress' },
            { id: 4, status: 'Todo' },
            { id: 5, status: 'Done' },
        ] };
    }
    return { data: [] };
  },
};

const EmptyContainer = ({ title, description }) => (
  <div className="flex flex-col items-center justify-center h-full p-8 text-center">
    <div className="bg-gray-100 p-3 rounded-full mb-3">
        <TrendingUp className="text-gray-400" size={24} />
    </div>
    <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
    <p className="text-gray-500 text-sm">{description}</p>
  </div>
);

// --- END MOCKS ---

const Analytics = () => {
  const [expenses, setExpenses] = useState([]);
  const [logs, setLogs] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const expenseData = expenses.reduce((acc, curr) => {
    const found = acc.find(item => item.name === curr.category);
    if (found) {
      found.value += parseFloat(curr.amount);
    } else {
      acc.push({ name: curr.category, value: parseFloat(curr.amount) });
    }
    return acc;
  }, []);

  const getLast7Days = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      days.push(subDays(new Date(), i));
    }
    return days;
  };

  const activityData = getLast7Days().map(day => {
    const count = logs.filter(log => {
        const logDate = parseISO(log.timestamp);
        return isSameDay(logDate, day) && log.action.toLowerCase().includes('completed');
    }).length;

    return {
      date: format(day, 'MMM dd'), 
      completed: count
    };
  });

  // --- 3. QUICK STATS ---
  const totalSpent = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);
  const completedTaskCount = tasks.filter(t => t.status === 'Done').length;
  const pendingTaskCount = tasks.filter(t => t.status !== 'Done').length;

  if (loading) return <div className="p-10 text-center text-gray-500">Loading Analytics...</div>;

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-sm md:text-base text-gray-500 mt-1">Visual insights into your projects and spending.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-600 p-6 rounded-xl shadow-sm border border-purple-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-purple-100 font-medium">Total Expenses</p>
            <p className="text-2xl font-bold text-white">${totalSpent.toFixed(2)}</p>
          </div>
          <div className="p-3 bg-purple-500/30 rounded-full text-white">
            <DollarSign size={24} />
          </div>
        </div>

        <div className="bg-green-600 p-6 rounded-xl shadow-sm border border-green-500 flex items-center justify-between">
          <div>
            <p className="text-sm text-green-100 font-medium">Tasks Completed</p>
            <p className="text-2xl font-bold text-white">{completedTaskCount}</p>
          </div>
          <div className="p-3 bg-green-500/30 rounded-full text-white">
            <CheckCircle2 size={24} />
          </div>
        </div>

        <div className="bg-amber-500 p-6 rounded-xl shadow-sm border border-amber-400 flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-100 font-medium">Pending Tasks</p>
            <p className="text-2xl font-bold text-white">{pendingTaskCount}</p>
          </div>
          <div className="p-3 bg-amber-400/30 rounded-full text-white">
            <AlertCircle size={24} />
          </div>
        </div>
      </div>

      {/* CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        
        {/* Chart 1: Expense Breakdown */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 h-80 md:h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <DollarSign size={18} className="text-gray-400"/> Expense Breakdown
            </h3>
          </div>
          
          <div className="flex-1 min-h-0">
            {expenseData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                    label={({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        return percent > 0.05 ? (
                            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12}>
                                {`${(percent * 100).toFixed(0)}%`}
                            </text>
                        ) : null;
                    }}
                    >
                    {expenseData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                    </Pie>
                    <Tooltip />
                    <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                </PieChart>
                </ResponsiveContainer>
            ) : (
                <EmptyContainer title="No Expenses Yet" description="Add expenses to see the breakdown." />
            )}
          </div>
        </div>

        {/* Chart 2: Productivity Trends */}
        <div className="bg-white p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 h-80 md:h-96 flex flex-col">
          <div className="flex items-center justify-between mb-4 md:mb-6 shrink-0">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={18} className="text-gray-400"/> Productivity (Last 7 Days)
            </h3>
          </div>

          <div className="flex-1 min-h-0 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{fontSize: 12}} />
                <YAxis allowDecimals={false} tick={{fontSize: 12}} />
                <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="completed" name="Tasks Done" fill="#16a34a" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Analytics;