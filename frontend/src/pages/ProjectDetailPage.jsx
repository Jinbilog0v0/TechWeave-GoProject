import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useOutletContext } from "react-router-dom"; 
import api from "../api";
import { AddTaskDialog } from "../components/AddTaskDialog";
import TaskBoard from "../components/TaskBoard"; // Import your new TaskBoard
import { 
  ArrowLeft, Plus, Users, CheckCircle2, Circle, Calendar, DollarSign, PieChart, Trash2 
} from "lucide-react";
// Assuming you have this dialog from earlier, if not, remove this import
import ProjectMembersDialog from "../components/ProjectMemberDialog"; 

const ProjectDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // 1. Get current user from Layout context
  const { user: currentUser } = useOutletContext() || {}; 

  const [project, setProject] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState([]); 
  const [loading, setLoading] = useState(true);
  
  // Dialog States
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [isMembersOpen, setIsMembersOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false); // Keeping your existing state
  const [newExpense, setNewExpense] = useState({ description: '', amount: '', category: 'Other' }); // Keeping your existing state

  // --- DATA FETCHING ---
  const fetchProjectData = async () => {
    try {
      // 1. Project Details
      const projRes = await api.get(`/api/projects/${id}/`);
      setProject(projRes.data);

      // 2. Tasks
      const tasksRes = await api.get("/api/tasks/");
      // Filter client-side for now, better to filter server-side if possible (e.g. /api/tasks/?project=ID)
      const projectTasks = tasksRes.data.filter(t => t.project === parseInt(id));
      setTasks(projectTasks);

      // 3. Members (Only if Collaborative)
      if (projRes.data.project_type === 'Collaborative') {
          const memRes = await api.get(`/api/team-members/?project=${id}`);
          setMembers(memRes.data);
      }

    } catch (error) {
      console.error("Failed to load project", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
  }, [id]);

  // --- HANDLERS ---
  const handleTaskAdded = () => {
    fetchProjectData(); // Refresh data
  };

  // This handles the "Monday" style instant updates from TaskBoard
  const handleUpdateTask = async (taskId, updatedFields) => {
    try {
        // Optimistic UI Update
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, ...updatedFields } : t));

        // API Call
        await api.patch(`/api/tasks/${taskId}/`, updatedFields);
        
    } catch (error) {
        console.error("Failed to update task", error);
        fetchProjectData(); // Revert on failure
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8">Project not found</div>;

  const isCollaborative = project.project_type === 'Collaborative';

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10">
      
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
          {/* Member View Button (Exclusive to Collaborative) */}
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
            onClick={() => setIsTaskDialogOpen(true)}
            className="flex items-center px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 shadow-md transition"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* 2. Task Board (Replaces your old task list) */}
      <div>
         {tasks.length > 0 ? (
            <TaskBoard 
               tasks={tasks}
               members={members}
               isCollaborative={isCollaborative}
               currentUser={currentUser}
               onUpdateTask={handleUpdateTask}
            />
         ) : (
            <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
               <p className="text-gray-500">No tasks yet. Create one to get started!</p>
            </div>
         )}
      </div>

      {/* 3. Dialogs */}
      <AddTaskDialog 
        open={isTaskDialogOpen} 
        onOpenChange={setIsTaskDialogOpen} 
        projectId={project.id}
        onTaskAdded={handleTaskAdded}
      />
      
      {/* Collaborative Member Dialog */}
      {isCollaborative && (
          <ProjectMembersDialog 
             open={isMembersOpen}
             onOpenChange={setIsMembersOpen}
             members={members}
          />
      )}

    </div>
  );
};

export default ProjectDetailPage;