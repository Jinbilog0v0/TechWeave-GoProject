import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ProjectCard from '../Components/ProjectCard';
import { Plus, X, Users } from 'lucide-react';

const CollaborativeWorkspace = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      status: 'In Progress',
      progress: 55,
      dueDate: '2025-01-20',
      teamSize: 3,
      members: ['Alice', 'Bob', 'Charlie'],
    },
    {
      id: 2,
      name: 'Company Website Redesign',
      description: 'Modern redesign of company website with new branding',
      status: 'Completed',
      progress: 100,
      dueDate: '2025-02-15',
      teamSize: 2,
      members: ['David', 'Eva'],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showMembers, setShowMembers] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    teamMembers: '',
    progress: 0,
  });

  const openForm = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        ...project,
        teamMembers: project.members ? project.members.join(', ') : '',
        progress: project.progress || 0,
      });
    } else {
      setEditingProject(null);
      setFormData({
        name: '',
        description: '',
        dueDate: '',
        status: 'Pending',
        teamMembers: '',
        progress: 0,
      });
    }
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const members = formData.teamMembers
      ? formData.teamMembers.split(',').map((m) => m.trim())
      : [];

    const projectData = {
      id: editingProject ? editingProject.id : Date.now(),
      name: formData.name,
      description: formData.description,
      dueDate: formData.dueDate,
      status: formData.status,
      members,
      teamSize: members.length,
      progress: Number(formData.progress),
    };

    if (editingProject) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingProject.id ? projectData : p))
      );
    } else {
      setProjects([...projects, projectData]);
    }

    setShowForm(false);
    setEditingProject(null);
    setFormData({
      name: '',
      description: '',
      dueDate: '',
      status: 'Pending',
      teamMembers: '',
      progress: 0,
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />
      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Collaborative Workspace</h2>
              <p className="text-gray-600">Team projects and shared tasks</p>
            </div>
            <button
              onClick={() => openForm()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              <Plus size={20} />
              <span>New Team Project</span>
            </button>
          </div>

          {/* Add/Edit Project Modal */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative">
                <button
                  onClick={() => setShowForm(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>

                <h3 className="text-xl font-bold text-gray-800 mb-4">
                  {editingProject ? 'Edit Team Project' : 'Add New Team Project'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Project Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <textarea
                    name="description"
                    placeholder="Description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />
                  <input
                    type="text"
                    name="teamMembers"
                    placeholder="Team Members (comma separated)"
                    value={formData.teamMembers}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  />

                  {/* Collapsible Progress Slider */}
                  {formData.status === 'In Progress' && (
                    <div className="mt-2">
                      <label className="block mb-1 font-semibold text-gray-700">
                        Progress: {formData.progress}%
                      </label>
                      <input
                        type="range"
                        name="progress"
                        min="0"
                        max="100"
                        value={formData.progress}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  )}

                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                  >
                    {editingProject ? 'Save Changes' : 'Add Project'}
                  </button>
                </form>
              </div>
            </div>
          )}

          {/* Members Modal */}
          {showMembers && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-xl shadow-xl w-80 relative">
                <button
                  onClick={() => setShowMembers(null)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>
                <h3 className="text-xl font-bold mb-4 flex items-center space-x-2">
                  <Users className="text-green-700" /> <span>Team Members</span>
                </h3>
                <ul className="space-y-2">
                  {showMembers.members.map((m, i) => (
                    <li key={i} className="border-b pb-2 text-gray-700">
                      👤 {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Project List */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => openForm(project)}
                onDelete={handleDelete}
                onViewMembers={() => setShowMembers(project)}
                collaborative
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollaborativeWorkspace;