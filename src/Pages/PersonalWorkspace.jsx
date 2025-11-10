import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ProjectCard from '../Components/ProjectCard';
import { Plus } from 'lucide-react';

const PersonalWorkspace = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Personal Portfolio Website',
      description: 'Build a modern portfolio to showcase my work',
      status: 'In Progress',
      progress: 65,
      dueDate: '2024-12-15',
      teamSize: 1
    },
    {
      id: 2,
      name: 'Learning React Advanced',
      description: 'Complete advanced React course and build projects',
      status: 'In Progress',
      progress: 40,
      dueDate: '2024-12-30',
      teamSize: 1
    }
  ]);

  const handleEdit = (project) => {
    console.log('Edit project:', project);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      setProjects(projects.filter(p => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Fixed Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Personal Workspace</h2>
              <p className="text-gray-600">Your personal projects and tasks</p>
            </div>
            <button className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              <Plus size={20} />
              <span>New Project</span>
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalWorkspace;