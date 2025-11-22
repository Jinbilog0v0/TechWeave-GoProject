import React from 'react';
import { Pencil, Trash, Users } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete, onViewMembers, collaborative }) => {
  // Format date
  const dueDate = project.end_date
    ? new Date(project.end_date).toLocaleDateString()
    : "No due date";

  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-700 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
      
      {/* Project Header */}
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800 truncate">{project.title}</h3>
        {project.status && (
          <span
            className={`px-2 py-1 rounded text-xs font-medium ${
              project.status === 'Complete'
                ? 'bg-green-100 text-green-800'
                : project.status === 'In Progress'
                ? 'bg-yellow-100 text-yellow-700'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {project.status}
          </span>
        )}
      </div>

      {/* Project Details */}
      {project.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{project.description}</p>
      )}
      
      <div className="flex justify-between items-end mt-2">
        <p className="text-xs text-gray-500">Due: {dueDate}</p>
        
        {/* Small Member Count Badge */}
        {collaborative && (
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
             Team Project
          </span>
        )}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-green-700 h-2 rounded-full transition-all duration-500"
          style={{ width: `${project.progress || 0}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1 text-right">{project.progress || 0}% complete</p>

      {/* Action Buttons */}
      <div className="flex justify-end items-center space-x-3 mt-4 pt-3 border-t border-gray-100">
        {/* Edit Button */}
        <button
          onClick={onEdit}
          title="Edit Project"
          className="text-blue-600 hover:text-blue-800 transition p-1 rounded hover:bg-blue-50"
        >
          <Pencil size={18} />
        </button>

        {/* Delete Button */}
        <button
          onClick={onDelete}
          title="Delete Project"
          className="text-red-600 hover:text-red-800 transition p-1 rounded hover:bg-red-50"
        >
          <Trash size={18} />
        </button>

        {/* View Members Button (Only shows if collaborative) */}
        {collaborative && onViewMembers && (
          <button
            onClick={onViewMembers}
            title="View Team Members"
            className="text-green-700 hover:text-green-900 transition p-1 rounded hover:bg-green-50"
          >
            <Users size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;