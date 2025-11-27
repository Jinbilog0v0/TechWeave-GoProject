import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom"; 
import api from "../api";

import { AddTaskDialog } from "../components/AddTaskDialog";
import { DeleteTaskDialog } from "../components/DeleteTaskDialog"; 
import TaskBoard from "../components/TaskBoard"; 
import ProjectMembersDialog from "../components/ProjectMemberDialog"; 
import EmptyContainer from "../components/EmptyContainer"; 

import { 
  ArrowLeft, Plus, Users, PieChart, Trash2, CheckCircle2, PhilippinePeso, Calendar 
} from "lucide-react";
import { Alert, AlertTitle } from "@/components/ui/alert";
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

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const { user: currentUser } = useOutletContext() || {}; 

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]); 
  const [expenses, setExpenses] = useState([]); 
  const [loading, setLoading] = useState(true);

  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [taskToDeleteId, setTaskToDeleteId] = useState(null);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [showSuccessAlert, setShowSuccessAlert] = useState(false); 
  const [successMessage, setSuccessMessage] = useState("");
  
  const [showExpenseAlert, setShowExpenseAlert] = useState(false);
  const [expenseAlertMessage, setExpenseAlertMessage] = useState("");

  const [isMembersOpen, setIsMembersOpen] = useState(false);

  const [showExpenseForm, setShowExpenseForm] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState(null);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Other',
    date: new Date().toISOString().split('T')[0],
  });

  const fetchProjectData = useCallback(async () => {
    try {
      const projRes = await api.get(`/api/projects/${id}/`);
      setProject(projRes.data);

      const tasksRes = await api.get(`/api/tasks/?project=${id}`); 
      setTasks(tasksRes.data);

      if (projRes.data.project_type === 'Collaborative') {
          const memRes = await api.get(`/api/team-members/?project=${id}`);
          setMembers(memRes.data);
      }

      const expRes = await api.get('/api/expenses/');
      const projectExpenses = expRes.data.filter(e => e.project === parseInt(id));
      setExpenses(projectExpenses);

    } catch (error) {
      console.error("Failed to load project data", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProjectData();
  }, [id, fetchProjectData]);


  const triggerSuccessAlert = (msg) => {
    setSuccessMessage(msg);
    setShowSuccessAlert(true); 
    setTimeout(() => setShowSuccessAlert(false), 3000);
  };

  const handleAddTaskClick = () => {
    setTaskToEdit(null);     
    setIsTaskDialogOpen(true);
  };

  const handleEditTaskClick = (task) => {
    setTaskToEdit(task);     
    setIsTaskDialogOpen(true); 
  };

  const handleDialogChange = (isOpen) => {
    setIsTaskDialogOpen(isOpen);
    if (!isOpen) {
      setTaskToEdit(null); 
    }
  };

  const handleTaskSaved = (savedTask, isEdit) => {
    if (isEdit) {
      setTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
      triggerSuccessAlert("Task updated successfully!"); 
    } else {
      setTasks(prev => [savedTask, ...prev]);
      triggerSuccessAlert("New task created successfully!"); 
    }
  };

  const handleUpdateTask = async (taskId, updatedFields) => {
    try {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedFields } : t));
        await api.patch(`/api/tasks/${taskId}/`, updatedFields);
        fetchProjectData(); 
    } catch (error) {
        console.error("Failed to update task", error);
        fetchProjectData(); 
    }
  };

  const initiateDelete = (taskId) => {
    setTaskToDeleteId(taskId); 
  };

  const confirmDelete = async () => {
    if (!taskToDeleteId) return;
    setIsDeleteLoading(true);
    try {
        await api.delete(`/api/tasks/${taskToDeleteId}/`);
        setTasks(prev => prev.filter(t => t.id !== taskToDeleteId));
        triggerSuccessAlert("Task deleted successfully."); // Updated call
        setTaskToDeleteId(null); 
    } catch (error) {
        console.error("Delete failed", error);
        alert("Failed to delete task");
    } finally {
        setIsDeleteLoading(false);
    }
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (!newExpense.description || !newExpense.amount) {
      alert('Please fill in Description and Amount.');
      return;
    }

    try {
      const res = await api.post('/api/expenses/', {
        ...newExpense,
        project: parseInt(id), 
        amount: parseFloat(newExpense.amount)
      });
      
      setExpenses([res.data, ...expenses]);
      setShowExpenseForm(false);
      setNewExpense({
        description: '',
        amount: '',
        category: 'Other',
        date: new Date().toISOString().split('T')[0],
      });
      setExpenseAlertMessage("Expense Added Successfully");
      setShowExpenseAlert(true);
      setTimeout(() => setShowExpenseAlert(false), 3000);
    } catch (error) {
      console.error("Failed to add expense", error);
    }
  };

  const initiateDeleteExpense = (expenseId) => {
    setExpenseToDelete(expenseId);
  };

  const confirmDeleteExpense = async () => {
    if (!expenseToDelete) return;

    try {
      await api.delete(`/api/expenses/${expenseToDelete}/`);
      setExpenses(expenses.filter(e => e.id !== expenseToDelete));
      
      setExpenseAlertMessage("Deleted Successfully");
      setShowExpenseAlert(true);
      setTimeout(() => setShowExpenseAlert(false), 3000); 
    } catch (error) {
      console.error("Failed to delete expense", error);
    } finally {
      setExpenseToDelete(null); 
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  const isCollaborative = project.project_type === 'Collaborative';
  const totalExpenseAmount = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress > 50) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 relative">
      
      {showSuccessAlert && (
        <Alert className="fixed w-fit top-5 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-green-100 border border-green-200 shadow-lg px-6 py-4 rounded-lg pointer-events-auto">
          <CheckCircle2 className="text-green-700 w-6 h-6 shrink-0" />
          <AlertTitle className="text-green-800 font-medium">
            {successMessage}
          </AlertTitle>
        </Alert>
      )}

      {/* Success Alert (Expense) */}
      {showExpenseAlert && (
        <Alert className="fixed top-16 left-1/2 transform -translate-x-1/2 w-fit z-50 bg-green-100 border-green-200 text-green-800 shadow-lg animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-green-600 mr-2 inline" />
          <AlertTitle className="inline font-medium">{expenseAlertMessage}</AlertTitle>
        </Alert>
      )}

      {/* Expense Delete Confirmation */}
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
            <AlertDialogAction onClick={confirmDeleteExpense} className="bg-red-600 hover:bg-red-700 text-white">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 1. Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <button 
            onClick={() => navigate(-1)} 
            className="flex items-center text-gray-500 hover:text-green-700 mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-1" /> Back to Workspace
          </button>
          <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold text-gray-800">{project.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                isCollaborative ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'
              }`}>
                {project.project_type}
              </span>
          </div>
          <p className="text-gray-500 mt-2 max-w-2xl">{project.description}</p>
        </div>

        <div className="flex gap-3">
          {isCollaborative && (
              <button 
                onClick={() => setIsMembersOpen(true)}
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 text-gray-700 shadow-sm transition"
              >
                <Users className="w-4 h-4 mr-2" />
                Team ({members.length})
              </button>
          )}

          <button 
            onClick={handleAddTaskClick} 
            className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 shadow-md transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* 2. Project Details with Progress Bar */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 mb-4 text-gray-700">
            <PieChart className="w-6 h-6 text-green-600" />
            <h2 className="text-lg font-semibold">Project Overview</h2>
        </div>
        <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Overall Progress</span>
                <span>{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div 
                    className={`h-full rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`} 
                    style={{ width: `${project.progress}%` }}
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-600">
            <div><strong>Status:</strong> <span className="font-medium">{project.status}</span></div>
            <div><strong>Priority:</strong> <span className="font-medium">{project.priority}</span></div>
            <div><strong>Type:</strong> <span className="font-medium">{project.project_type}</span></div>
            <div><strong>Start Date:</strong> {project.start_date || 'N/A'}</div>
            <div><strong>End Date:</strong> {project.end_date || 'N/A'}</div>
            <div><strong>Owner:</strong> {project.owner_username}</div>
        </div>
      </div>

      {/* 3. Task Board */}
      <div>
          {tasks.length > 0 ? (
            <TaskBoard 
                tasks={tasks} 
                onUpdateTask={handleUpdateTask} 
                onDeleteTask={initiateDelete} 
                onEditTask={handleEditTaskClick} 
                onSuccess={triggerSuccessAlert}
            />
          ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                <p className="text-gray-500">No tasks yet. Create one to get started!</p>
            </div>
          )}
      </div>

      {/* 4. EXPENSE SECTION */}
      <div className="space-y-6 pt-6 border-t border-gray-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
             <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
               <PhilippinePeso className="w-6 h-6 text-green-700" /> Project Expenses
             </h2>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-green-50 px-4 py-2 rounded-lg border border-green-100">
               <span className="text-xs text-green-600 font-bold uppercase tracking-wider block">Total Spent</span>
               <span className="text-xl font-bold text-green-800 flex items-center"> <PhilippinePeso size={16}/> {totalExpenseAmount.toFixed(2)}</span>
            </div>
            {!showExpenseForm && (
              <button
                onClick={() => setShowExpenseForm(true)}
                className="flex items-center gap-2 bg-white border border-green-700 text-green-700 px-4 py-2 rounded-lg font-medium hover:bg-green-50 transition shadow-sm"
              >
                <Plus size={18} /> Add Expense
              </button>
            )}
          </div>
        </div>

        {/* Expense Form */}
        {showExpenseForm && (
          <div className="bg-white p-6 rounded-xl shadow-lg border border-green-100 animate-in fade-in slide-in-from-top-4">
            <h3 className="font-bold text-gray-800 mb-4">New Expense Entry</h3>
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
                  <PhilippinePeso size={14} className="absolute left-2.5 top-3 text-gray-400" />
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
                  <option value="Other">Other</option>
                  <option value="Food">Food</option>
                  <option value="Travel">Travel</option>
                  <option value="Software">Software</option>
                  <option value="Supplies">Supplies</option>
                </select>
              </div>
              <div className="lg:col-span-1 flex items-end gap-2">
                 <button 
                   type="button" 
                   onClick={() => setShowExpenseForm(false)}
                   className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg text-sm font-medium flex-1"
                 >
                   Cancel
                 </button>
                 <button 
                   type="submit" 
                   className="px-4 py-2 bg-green-700 text-white rounded-lg text-sm font-medium hover:bg-green-800 shadow-sm flex-1"
                 >
                   Save
                 </button>
              </div>
            </form>
          </div>
        )}

        {/* Expense List */}
        <div className="space-y-3">
          {expenses.length > 0 ? (
            expenses.map((expense) => (
              <div key={expense.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition flex justify-between items-center">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full ${expense.category === 'Food' ? 'bg-orange-100 text-orange-600' : expense.category === 'Travel' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>
                      <PhilippinePeso size={20} />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">{expense.description}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{expense.category}</span>
                      <span>•</span>
                      <span className="flex items-center gap-1"><Calendar size={10} /> {expense.date}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className="text-lg font-bold text-gray-900 flex items-center">- <PhilippinePeso size={14}/> {parseFloat(expense.amount).toFixed(2)}</span>
                  <button 
                    onClick={() => initiateDeleteExpense(expense.id)}
                    className="text-gray-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-full"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          ) : (
             !loading && <EmptyContainer title="No Expenses" description="No expenses recorded for this project yet." />
          )}
        </div>
      </div>

      {/* 5. Dialogs */}
      <AddTaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={handleDialogChange} 
        projectId={project.id}
        onTaskSaved={handleTaskSaved} 
        taskToEdit={taskToEdit} 
      />
      
      <DeleteTaskDialog 
        open={!!taskToDeleteId} 
        onOpenChange={(open) => !open && setTaskToDeleteId(null)}
        onConfirm={confirmDelete}
        loading={isDeleteLoading}
      />

      {isCollaborative && (
          <ProjectMembersDialog 
              open={isMembersOpen}
              onOpenChange={setIsMembersOpen}
              members={members}
              projectId={project.id}
              fetchProjectData={fetchProjectData}
          />
      )}

    </div>
  );
};

export default ProjectDetailPage;