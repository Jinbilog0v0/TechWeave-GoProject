import React from 'react';
import { CalendarDays, Trash2, Edit2, Users } from 'lucide-react'; 
import { useNavigate } from 'react-router-dom';

const ProjectCard = ({ project, collaborative, onDelete, onViewMembers, onEdit }) => { 
  
  const navigate = useNavigate();

  const getProgressColor = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress > 50) return "bg-blue-500";
    return "bg-yellow-500";
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm borderl-5 border-green-700 hover:shadow-md transition-shadow flex flex-col h-full">
      
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <div 
          onClick={() => navigate(`/projects/${project.id}`)} 
          className="cursor-pointer group"
        >
          <span className={`text-xs font-semibold px-2 py-1 rounded-full 
            ${project.priority === 'High' ? 'bg-red-100 text-red-700' : 
              project.priority === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-blue-100 text-blue-700'}`}>
            {project.priority}
          </span>
          <h3 className="text-lg font-bold text-gray-800 mt-2 group-hover:text-green-700 transition-colors">
            {project.title}
          </h3>
        </div>
      </div>

      <p className="text-gray-500 text-sm mb-6 line-clamp-2 flex-1">
        {project.description || "No description provided."}
      </p>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
          <div 
            className={`h-full rounded-full transition-all duration-500 ${getProgressColor(project.progress)}`} 
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
        <div className="flex items-center text-gray-400 text-xs">
          <CalendarDays className="w-4 h-4 mr-1" />
          {project.end_date || "No deadline"}
        </div>

        <div className="flex gap-2">
          {/* View Members Button */}
          {collaborative && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onViewMembers(); 
              }} 
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="View Members"
            >
              <Users className="w-4 h-4" />
            </button>
          )}

          <button 
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
            title="Edit Project"
          >
            <Edit2 className="w-4 h-4" />
          </button>

          {/* Delete Button */}
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Project"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;