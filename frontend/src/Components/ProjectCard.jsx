import React from 'react';
import { Edit, Trash2, Users } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete, onViewMembers, collaborative }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-5 border-l-4 border-green-700 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            project.status === 'Completed'
              ? 'bg-green-100 text-green-800'
              : project.status === 'In Progress'
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-gray-200 text-gray-600'
          }`}
        >
          {project.status}
        </span>
      </div>

      <p className="text-sm text-gray-600 mb-2">{project.description}</p>
      <p className="text-xs text-gray-500 mb-1">Due: {project.dueDate}</p>

      {collaborative && (
        <>
          <p
            className="text-xs text-green-700 font-medium"
            // onClick={onViewMembers}
          >
            Members: {project.teamSize}
          </p>
          {/* <ul className="text-xs text-gray-600 ml-2 mt-1 list-disc">
            {project.members?.slice(0, 3).map((m, i) => (
              <li key={i}>{m}</li>
            ))}
            {project.members?.length > 3 && (
              <li>+{project.members.length - 3} more...</li>
            )}
          </ul> */}
        </>
      )}

      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-green-700 h-2 rounded-full"
          style={{ width: `${project.progress || 0}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{project.progress}% complete</p>

      <div className="flex justify-end space-x-3 mt-4">
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-800 transition"
        >
          <Edit size={18} />
        </button>
        <button
          onClick={onDelete}
          className="text-red-600 hover:text-red-800 transition"
        >
          <Trash2 size={18} />
        </button>
        {collaborative && (
          <button
            onClick={onViewMembers}
            className="text-green-700 hover:text-green-900 transition"
          >
            <Users size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;