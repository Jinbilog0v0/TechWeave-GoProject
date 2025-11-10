import React from 'react';
import { MoreVertical } from 'lucide-react';
import Status from './Status';
import EditBtn from './EditBtn';
import DeleteBtn from './DeleteBtn';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const [showMenu, setShowMenu] = React.useState(false);

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow relative">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 mb-2">{project.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{project.description}</p>
          <Status status={project.status} />
        </div>
        
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 hover:bg-gray-100 rounded"
          >
            <MoreVertical size={20} />
          </button>
          
          {showMenu && (
            <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-10">
              <EditBtn onClick={() => { onEdit(project); setShowMenu(false); }} />
              <DeleteBtn onClick={() => { onDelete(project.id); setShowMenu(false); }} />
            </div>
          )}
        </div>
      </div>
      
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{project.progress}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-green-700 h-2 rounded-full transition-all"
            style={{ width: `${project.progress}%` }}
          />
        </div>
      </div>
      
      <div className="flex justify-between text-sm text-gray-600">
        <span>Due: {project.dueDate}</span>
        <span>Team: {project.teamSize}</span>
      </div>
    </div>
  );
};

export default ProjectCard;