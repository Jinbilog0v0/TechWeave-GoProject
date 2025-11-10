import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ProjectCard from '../Components/ProjectCard';
import { Plus, Users } from 'lucide-react';

const CollaborativeWorkspace = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      status: 'In Progress',
      progress: 55,
      dueDate: '2025-01-20',
      teamSize: 5
    },
    {
      id: 2,
      name: 'Mobile App Development',
      description: 'Cross-platform mobile app using React Native',
      status: 'In Progress',
      progress: 30,
      dueDate: '2025-02-15',
      teamSize: 4
    },
    {
      id: 3,
      name: 'Company Website Redesign',
      description: 'Modern redesign of company website with new branding',
      status: 'Completed',
      progress: 100,
      dueDate: '2025-11-30',
      teamSize: 3
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
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Collaborative Workspace</h2>
            <p className="text-gray-600">Team projects and shared tasks</p>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
            <Plus size={20} />
            <span>New Team Project</span>
          </button>
        </div>

        {/* Team Stats */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <Users className="text-green-700" size={32} />
              <div>
                <p className="text-2xl font-bold">{projects.reduce((sum, p) => sum + p.teamSize, 0)}</p>
                <p className="text-sm text-gray-600">Total Team Members</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="text-green-700 text-3xl">📊</div>
              <div>
                <p className="text-2xl font-bold">{projects.length}</p>
                <p className="text-sm text-gray-600">Active Projects</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <div className="text-green-700 text-3xl">✅</div>
              <div>
                <p className="text-2xl font-bold">
                  {projects.filter(p => p.status === 'Completed').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </div>
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
  );
};

export default CollaborativeWorkspace;