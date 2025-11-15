import React, { useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ProjectCard from '../Components/ProjectCard';
import { Plus, X } from 'lucide-react';

const PersonalWorkspace = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'Personal Portfolio Website',
      description: 'Build a modern portfolio to showcase my work',
      status: 'In Progress',
      progress: 65,
      dueDate: '2025-12-15',
      teamSize: 1
    },
    {
      id: 2,
      name: 'Learning React Advanced',
      description: 'Complete advanced React course and build projects',
      status: 'In Progress',
      progress: 40,
      dueDate: '2025-12-30',
      teamSize: 1
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    progress: 0,
  });

  const openForm = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData(task);
    } else {
      setEditingTask(null);
      setFormData({ name: '', description: '', dueDate: '', status: 'Pending', progress: 0 });
    }
    setShowForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name || !formData.dueDate)
      return alert('Please fill in all required fields.');

    if (editingTask) {
      // Update existing
      setProjects((prev) =>
        prev.map((p) => (p.id === editingTask.id ? { ...p, ...formData } : p))
      );
    } else {
      // Add new
      setProjects([
        ...projects,
        { id: Date.now(), ...formData, teamSize: 1 },
      ]);
    }

    setShowForm(false);
    setEditingTask(null);
    setFormData({ name: '', description: '', dueDate: '', status: 'Pending', progress: 0 });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Personal Workspace</h2>
              <p className="text-gray-600">Your personal projects and tasks</p>
            </div>
            <button
              onClick={() => openForm()}
              className="flex items-center space-x-2 px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
            >
              <Plus size={20} />
              <span>New Task</span>
            </button>
          </div>

          {/* Form Modal */}
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
                  {editingTask ? 'Edit Task' : 'Add New Task'}
                </h3>

                <form onSubmit={handleSubmit} className="space-y-3">
                  <input
                    type="text"
                    name="name"
                    placeholder="Task Name"
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

                  <button
                    type="submit"
                    className="w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                  >
                    {editingTask ? 'Save Changes' : 'Add Task'}
                  </button>
                </form>
              </div>
            </div>
          )}

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onEdit={() => openForm(project)}
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