import React, { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Calendar, CheckCircle2 } from 'lucide-react';
import api from '../api';
import EmptyContainer from '../components/EmptyContainer';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertTitle } from "@/components/ui/alert";

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [expenseToDelete, setExpenseToDelete] = useState(null); 
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Other',
    project: '',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, projRes] = await Promise.all([
          api.get('/api/expenses/'),
          api.get('/api/projects/')
        ]);
        setExpenses(expRes.data);
        setProjects(projRes.data);
        
        if (projRes.data.length > 0) {
            setNewExpense(prev => ({ ...prev, project: projRes.data[0].id }));
        }
      } catch (error) {
        console.error("Error loading expenses:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount || !newExpense.project) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const res = await api.post('/api/expenses/', {
        ...newExpense,
        project: parseInt(newExpense.project),
        amount: parseFloat(newExpense.amount)
      });
      
      setExpenses([res.data, ...expenses]);
      setShowForm(false);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Other',
        project: projects.length > 0 ? projects[0].id : '',
        date: new Date().toISOString().split('T')[0],
      });
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  const initiateDelete = (id) => {
    setExpenseToDelete(id);
  };

  const confirmDelete = async () => {
    if (!expenseToDelete) return;

    try {
      await api.delete(`/api/expenses/${expenseToDelete}/`);
      setExpenses(expenses.filter(e => e.id !== expenseToDelete));
      
      setShowSuccessAlert(true);
      setTimeout(() => setShowSuccessAlert(false), 3000); 
    } catch (error) {
      console.error("Failed to delete expense", error);
    } finally {
      setExpenseToDelete(null); // Close Dialog
    }
  };

  const getProjectName = (id) => {
    const p = projects.find(p => p.id === id);
    return p ? p.title : 'Unknown Project';
  };

  const totalAmount = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  if (loading) return <div className="p-8 text-center">Loading Expenses...</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 relative">
      
      {showSuccessAlert && (
        <Alert className="fixed top-6 left-1/2 transform -translate-x-1/2 w-fit z-50 bg-green-100 border-green-200 text-green-800 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 inline" />
          <AlertTitle className="inline font-medium">Deleted Successfully</AlertTitle>
        </Alert>
      )}

      <AlertDialog open={!!expenseToDelete} onOpenChange={() => setExpenseToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently remove this expense record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
          <p className="text-gray-500 mt-1">Monitor spending across all your projects.</p>
        </div>
        <div className="bg-green-50 px-6 py-3 rounded-xl border border-green-100 flex items-center gap-3">
           <div className="bg-green-200 p-2 rounded-full">
             <DollarSign className="text-green-800" size={20}/>
           </div>
           <div>
             <p className="text-xs text-green-600 font-bold uppercase tracking-wider">Total Spent</p>
             <p className="text-2xl font-bold text-green-800">${totalAmount.toFixed(2)}</p>
           </div>
        </div>
      </div>

      {/* Add Button */}
      {!showForm && (
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-green-700 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-green-800 transition shadow-sm"
        >
          <Plus size={18} /> Record New Expense
        </button>
      )}

      {/* Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 animate-in fade-in slide-in-from-top-4">
          <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-gray-800">New Expense Entry</h3>
          </div>
          
          <form onSubmit={handleAddExpense} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="lg:col-span-2">
              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
              <input
                type="text"
                placeholder="e.g., Server Costs"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Amount</label>
              <div className="relative">
                <DollarSign size={14} className="absolute left-2.5 top-3 text-gray-400" />
                <input
                  type="number"
                  placeholder="0.00"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                  className="w-full p-2 pl-8 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Category</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                className="w-full p-2 border rounded-lg bg-white"
              >
                <option value="Food">Food</option>
                <option value="Travel">Travel</option>
                <option value="Software">Software</option>
                <option value="Supplies">Supplies</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
               <label className="block text-xs font-bold text-gray-500 mb-1">Project</label>
               <select
                 value={newExpense.project}
                 onChange={(e) => setNewExpense({ ...newExpense, project: e.target.value })}
                 className="w-full p-2 border rounded-lg bg-white"
               >
                 {projects.map(p => (
                   <option key={p.id} value={p.id}>{p.title}</option>
                 ))}
               </select>
            </div>

            <div className="lg:col-span-5 flex justify-end gap-3 mt-2">
               <button 
                 type="button" 
                 onClick={() => setShowForm(false)}
                 className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium"
               >
                 Cancel
               </button>
               <button 
                 type="submit" 
                 className="px-6 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 shadow-sm"
               >
                 Save Entry
               </button>
            </div>
          </form>
        </div>
      )}

      <div className="space-y-4">
        {expenses.length > 0 ? (
          expenses.map((expense) => (
            <div key={expense.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex justify-between items-center">
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full ${expense.category === 'Food' ? 'bg-orange-100 text-orange-600' : expense.category === 'Travel' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                   <DollarSign size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{expense.description}</h3>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{expense.category}</span>
                    <span>•</span>
                    <span>{getProjectName(expense.project)}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Calendar size={10} /> {expense.date}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-6">
                <span className="text-lg font-bold text-gray-900">-${parseFloat(expense.amount).toFixed(2)}</span>
                <button 
                  onClick={() => initiateDelete(expense.id)}
                  className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <EmptyContainer title="No Expenses Recorded" description="Add expenses to track project costs." />
        )}
      </div>
    </div>
  );
};

export default Expenses;