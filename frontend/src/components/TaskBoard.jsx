import React from "react";
import { Calendar, CheckCircle2, Circle, Clock, Paperclip, Upload, AlertCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import api from "../api"; 

const TaskBoard = ({ tasks, onUpdateTask }) => {
  
  const getStatusColor = (status) => {
    switch (status) {
      case "Done": return "bg-green-100 text-green-700 hover:bg-green-200 border-green-200";
      case "In Progress": return "bg-blue-100 text-blue-700 hover:bg-blue-200 border-blue-200";
      case "Missed": return "bg-red-100 text-red-700 border-red-200 cursor-pointer hover:bg-red-200";
      default: return "bg-gray-100 text-gray-600 hover:bg-gray-200 border-gray-200"; 
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Done": return <CheckCircle2 className="w-3 h-3 mr-1" />;
      case "In Progress": return <Clock className="w-3 h-3 mr-1" />;
      case "Missed": return <AlertCircle className="w-3 h-3 mr-1" />;
      default: return <Circle className="w-3 h-3 mr-1" />; 
    }
  };

  const handleStatusClick = (task) => {
    const currentStatus = task.status;
    const manualCycle = ["To Do", "In Progress", "Done"];

    if (currentStatus === "Missed") {
        onUpdateTask(task.id, { status: "In Progress" });
        return;
    }

    const nextIndex = (manualCycle.indexOf(currentStatus) + 1) % manualCycle.length;
    onUpdateTask(task.id, { status: manualCycle[nextIndex] });
  };

  const handleFileChange = async (e, task) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('task', task.id);

    try {
      await api.post('/api/attachments/', formData);
      // Update the task status to 'Done'
      onUpdateTask(task.id, { status: 'Done' });
      // Show the specific alert message
      alert('File successfully uploaded: Task Done');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload file.");
    }
  };

  return (
    <div className="rounded-md border shadow-sm bg-white overflow-visible min-h-[400px]">
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-[40%] pl-4">Task</TableHead>
            <TableHead className="text-center w-[150px]">Due Date</TableHead>
            <TableHead className="text-center w-[100px]">Priority</TableHead>
            <TableHead className="text-center w-[60px]">File</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map((task) => {
            return (
              <TableRow key={task.id} className="hover:bg-muted/50 group">
                
                {/* 1. Task */}
                <TableCell className="font-medium pl-4">
                   <div className="flex flex-col gap-1.5">
                      <span className={`${task.status === 'Done' ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                        {task.title}
                      </span>
                      <button 
                        onClick={() => handleStatusClick(task)}
                        className={`w-fit px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide flex items-center border ${getStatusColor(task.status)}`}
                      >
                        {getStatusIcon(task.status)}
                        {task.status} 
                      </button>
                   </div>
                </TableCell>

                {/* 2. Due Date */}
                <TableCell className="text-center">
                   <input 
                      type="date" 
                      value={task.due_date || ""} 
                      onChange={(e) => onUpdateTask(task.id, { due_date: e.target.value })}
                      className={`block text-sm p-1 rounded border shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mx-auto
                        ${task.status === 'Missed' ? 'border-red-300 bg-red-50 text-red-600' : 'border-gray-200 text-gray-600'}`}
                   />
                </TableCell>

                {/* 3. Priority */}
                <TableCell className="text-center">
                   <span className={`text-xs uppercase font-bold px-2 py-1 rounded ${
                       task.priority === 'High' ? 'text-red-600 bg-red-50' : 
                       task.priority === 'Medium' ? 'text-yellow-600 bg-yellow-50' : 'text-blue-600 bg-blue-50'
                    }`}>
                      {task.priority}
                   </span>
                </TableCell>

                {/* 4. File Upload */}
                <TableCell className="text-center">
                   <label className="cursor-pointer p-2 rounded-full hover:bg-gray-100 transition-colors inline-block">
                     <input type="file" className="hidden" onChange={(e) => handleFileChange(e, task)} />
                     {task.attachments && task.attachments.length > 0 ? (
                         <Paperclip className="w-4 h-4 text-blue-600" />
                     ) : (
                         <Upload className="w-4 h-4 text-gray-400 hover:text-green-600" />
                     )}
                   </label>
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