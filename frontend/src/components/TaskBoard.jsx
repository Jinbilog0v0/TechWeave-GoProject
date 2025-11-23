import React, { useRef } from "react";
import { User, Calendar, CheckCircle2, Circle, Clock, Paperclip, Upload } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "../api"; // Import API for file upload

const TaskBoard = ({ tasks, members, isCollaborative, currentUser, onUpdateTask }) => {
  
  // --- 1. STATUS LOGIC ---
  const getStatusColor = (status) => {
    const normalized = status === "To Do" ? "Pending" : status;
    switch (normalized) {
      case "Done": return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      default: return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    const normalized = status === "To Do" ? "Pending" : status;
    switch (normalized) {
      case "Done": return <CheckCircle2 className="w-4 h-4 mr-2" />;
      case "In Progress": return <Clock className="w-4 h-4 mr-2" />;
      default: return <Circle className="w-4 h-4 mr-2" />;
    }
  };

  const handleStatusClick = (task) => {
    const currentStatus = task.status === "To Do" ? "Pending" : task.status;
    const cycle = ["Pending", "In Progress", "Done"];
    const nextIndex = (cycle.indexOf(currentStatus) + 1) % cycle.length;
    onUpdateTask(task.id, { status: cycle[nextIndex] });
  };

  const handleAssignClick = (task) => {
    if (!isCollaborative || !currentUser) return;
    const isAssignedToMe = task.assigned_to === currentUser.id;
    const newAssignee = isAssignedToMe ? null : currentUser.id;
    onUpdateTask(task.id, { assigned_to: newAssignee });
  };

  const handleFileChange = async (e, task) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', task.id);

    try {
      await api.post('/api/attachments/', formData);

      onUpdateTask(task.id, { status: 'Done' });
      
      alert(`File uploaded for "${task.title}" and marked as Done!`);
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file.");
    }
  };
  const getAssigneeDetails = (userId) => {
    if (!userId) return null;
    const member = members?.find(m => m.user.id === userId);
    return member ? member.user : null;
  };

  return (
    <div className="rounded-md border shadow-sm bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[35%]">Task</TableHead>
            <TableHead className="text-center w-[140px]">Status</TableHead>
            {isCollaborative && (
              <TableHead className="text-center w-[80px]">Person</TableHead>
            )}
            <TableHead className="text-center">Due Date</TableHead>
            <TableHead className="text-center">Priority</TableHead>
            <TableHead className="text-center w-[50px]">File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            const assignee = getAssigneeDetails(task.assigned_to);

            return (
              <TableRow key={task.id} className="hover:bg-muted/50 group">
                
                {/* Task Name */}
                <TableCell className="font-medium">
                   <div className="flex items-center">
                      <div className={`w-1 h-8 rounded-r mr-3 ${task.priority === 'High' ? 'bg-red-500' : task.priority === 'Medium' ? 'bg-yellow-500' : 'bg-blue-500'}`} />
                      <span className="text-gray-700">{task.title}</span>
                   </div>
                </TableCell>

                {/* Status */}
                <TableCell className="text-center">
                  <button 
                    onClick={() => handleStatusClick(task)}
                    className={`w-full py-1.5 px-3 rounded-full text-xs font-semibold flex items-center justify-center transition-all ${getStatusColor(task.status)}`}
                  >
                    {getStatusIcon(task.status)}
                    {task.status === 'To Do' ? 'Pending' : task.status}
                  </button>
                </TableCell>

                {/* Assignee */}
                {isCollaborative && (
                  <TableCell className="text-center">
                    <div 
                      onClick={() => handleAssignClick(task)}
                      className="flex justify-center cursor-pointer hover:scale-110 transition-transform"
                      title={assignee ? `Assigned to ${assignee.username}` : "Click to assign yourself"}
                    >
                      {assignee ? (
                        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-xs font-bold ring-2 ring-white shadow-sm">
                           {assignee.profile?.profile_picture ? (
                              <img src={assignee.profile.profile_picture} className="w-full h-full rounded-full object-cover" alt="Avatar" />
                           ) : (
                              assignee.username.substring(0, 2).toUpperCase()
                           )}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 border border-gray-300 border-dashed">
                          <User className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </TableCell>
                )}

                {/* Due Date */}
                <TableCell className="text-center">
                   <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
                      <Calendar className="w-3 h-3 text-gray-400" />
                      {task.due_date || "-"}
                   </div>
                </TableCell>

                 {/* Priority */}
                 <TableCell className="text-center">
                   <span className={`text-xs uppercase font-bold ${
                      task.priority === 'High' ? 'text-red-600' : 
                      task.priority === 'Medium' ? 'text-yellow-600' : 'text-blue-600'
                   }`}>
                      {task.priority}
                   </span>
                </TableCell>

                {/* File Upload Column */}
                <TableCell className="text-center">
                  <div className="flex justify-center">
                    <label className="cursor-pointer hover:bg-gray-100 p-2 rounded-full transition-colors relative group">
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => handleFileChange(e, task)}
                      />
                      {task.attachments && task.attachments.length > 0 ? (
                         <Paperclip className="w-4 h-4 text-blue-600" />
                      ) : (
                         <Upload className="w-4 h-4 text-gray-400 group-hover:text-green-600" />
                      )}
                    </label>
                  </div>
                </TableCell>

              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default TaskBoard;