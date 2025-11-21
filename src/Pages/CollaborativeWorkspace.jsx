import React, { useState, useEffect } from 'react';
import Sidebar from '../Components/Sidebar';
import ProjectCard from '../Components/ProjectCard';
import { Plus, X, Users, UploadCloud, Trash2, Download } from 'lucide-react';
import Analytics from './Analytics';


const CollaborativeWorkspace = ({ user, onLogout }) => {
  const [projects, setProjects] = useState([
    {
      id: 1,
      name: 'E-Commerce Platform',
      description: 'Full-stack e-commerce solution with payment integration',
      status: 'In Progress',
      progress: 55,
      dueDate: '2025-01-20',
      members: ['Alice', 'Bob', 'Charlie'],
      subtasks: [
        { id: 101, name: 'Backend API', members: ['Alice'], files: [], progress: 0 },
        { id: 102, name: 'Frontend UI', members: ['Bob', 'Charlie'], files: [], progress: 0 },
      ],
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [showMembers, setShowMembers] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [viewingProject, setViewingProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    teamMembers: '',
    progress: 0,
    subtasks: [],
  });

  const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

  const openForm = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        name: project.name || '',
        description: project.description || '',
        dueDate: project.dueDate || '',
        status: project.status || 'Pending',
        progress: project.progress || 0,
        teamMembers: project.members ? project.members.join(', ') : '',
        subtasks: project.subtasks ? project.subtasks.map((st) => ({ ...st })) : [],
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
        subtasks: [],
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
    if (!formData.name || !formData.dueDate) return alert('Project name and due date required.');

    const members = formData.teamMembers
      ? formData.teamMembers.split(',').map((m) => m.trim())
      : [];

    const projectData = {
      id: editingProject ? editingProject.id : nextId(),
      name: formData.name,
      description: formData.description,
      dueDate: formData.dueDate,
      status: formData.status,
      members,
      progress: Number(formData.progress),
      subtasks: formData.subtasks.map((st) => ({
        id: st.id || nextId(),
        name: st.name,
        members: st.members || [],
        files: st.files || [],
        progress: st.progress || 0,
      })),
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
      subtasks: [],
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project?')) {
      setProjects(projects.filter((p) => p.id !== id));
    }
  };

  const openViewModal = (project) => {
    setViewingProject({ ...project, subtasks: project.subtasks.map((st) => ({ ...st })) });
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setViewingProject(null);
    setShowViewModal(false);
  };

  const addSubtaskInView = () => {
    setViewingProject((prev) => ({
      ...prev,
      subtasks: [...prev.subtasks, { id: nextId(), name: '', members: [], files: [], progress: 0 }],
    }));
  };

  const updateSubtaskInView = (id, key, value) => {
    setViewingProject((prev) => ({
      ...prev,
      subtasks: prev.subtasks.map((st) => (st.id === id ? { ...st, [key]: value } : st)),
    }));
  };

  const removeSubtaskInView = (id) => {
    setViewingProject((prev) => ({
      ...prev,
      subtasks: prev.subtasks.filter((st) => st.id !== id),
    }));
  };

  const handleFileUploadInView = (subtaskId, files) => {
    const filesArr = Array.from(files).map((f) => ({
      id: nextId(),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f),
    }));

    updateSubtaskInView(subtaskId, 'files', [
      ...(viewingProject.subtasks.find((st) => st.id === subtaskId)?.files || []),
      ...filesArr,
    ]);
  };

  const removeFileInView = (subtaskId, fileId) => {
    const subtask = viewingProject.subtasks.find((st) => st.id === subtaskId);
    const file = subtask.files.find((f) => f.id === fileId);
    if (file?.url) URL.revokeObjectURL(file.url);
    updateSubtaskInView(
      subtaskId,
      'files',
      subtask.files.filter((f) => f.id !== fileId)
    );
  };

  const saveViewChanges = () => {
    setProjects((prev) =>
      prev.map((p) => (p.id === viewingProject.id ? { ...viewingProject } : p))
    );
    closeViewModal();
  };

  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter((st) => st.files.length > 0).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  useEffect(() => {
    return () => {
      projects.forEach((p) =>
        p.subtasks?.forEach((st) =>
          st.files?.forEach((f) => f.url && URL.revokeObjectURL(f.url))
        )
      );
      if (viewingProject)
        viewingProject.subtasks?.forEach((st) =>
          st.files?.forEach((f) => f.url && URL.revokeObjectURL(f.url))
        );
    };
  }, [projects, viewingProject]);

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
              <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative max-h-[90vh] overflow-auto">
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

                  {/* Subtasks */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Subtasks</h4>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            subtasks: [...prev.subtasks, { id: nextId(), name: '', members: [] }],
                          }))
                        }
                        className="inline-flex items-center px-3 py-1 bg-gray-100 rounded"
                      >
                        <Plus size={14} /> <span className="ml-2 text-sm">Add Subtask</span>
                      </button>
                    </div>

                    {formData.subtasks.map((st, idx) => (
                      <div key={st.id} className="mb-2 space-y-1">
                        <input
                          type="text"
                          placeholder="Subtask title"
                          value={st.name}
                          onChange={(e) => {
                            const updated = [...formData.subtasks];
                            updated[idx].name = e.target.value;
                            setFormData({ ...formData, subtasks: updated });
                          }}
                          className="w-full p-2 border rounded"
                        />
                        <select
                          multiple
                          value={st.members}
                          onChange={(e) => {
                            const options = Array.from(e.target.selectedOptions).map(
                              (opt) => opt.value
                            );
                            const updated = [...formData.subtasks];
                            updated[idx].members = options;
                            setFormData({ ...formData, subtasks: updated });
                          }}
                          className="w-full p-2 border rounded"
                        >
                          {formData.teamMembers.split(',').map((m) => (
                            <option key={m.trim()} value={m.trim()}>
                              {m.trim()}
                            </option>
                          ))}
                        </select>
                      </div>
                    ))}
                  </div>

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
                onDelete={() => handleDelete(project.id)}
                onViewMembers={() => setShowMembers(project)}
                collaborative
                subtasks={project.subtasks}
                user={user}
                onClick={() => openViewModal(project)}
              />
            ))}
          </div>

          {/* View Project Modal */}
          {showViewModal && viewingProject && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 md:w-3/4 lg:w-1/2 relative max-h-[90vh] overflow-auto">
                <button
                  onClick={closeViewModal}
                  className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
                >
                  <X size={20} />
                </button>

                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{viewingProject.name}</h3>
                    <p className="text-sm text-gray-600">{viewingProject.description}</p>
                    <div className="text-xs text-gray-500 mt-1">Due: {viewingProject.dueDate}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{viewingProject.status}</div>
                    <div className="text-2xl font-bold">
                      {calculateProgress(viewingProject.subtasks)}%
                    </div>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
                  <div
                    className="h-3 rounded-full bg-green-600"
                    style={{ width: `${calculateProgress(viewingProject.subtasks)}%` }}
                  />
                </div>

                {/* Subtasks */}
                <div className="mt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">Subtasks</h4>
                    <button
                      type="button"
                      onClick={addSubtaskInView}
                      className="inline-flex items-center px-3 py-1 bg-gray-100 rounded"
                    >
                      <Plus size={14} /> <span className="ml-2 text-sm">Add Subtask</span>
                    </button>
                  </div>

                  {viewingProject.subtasks.map((st) => (
                    <div key={st.id} className="p-3 border rounded">
                      <div className="flex justify-between items-center">
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => updateSubtaskInView(st.id, 'name', e.target.value)}
                          placeholder="Subtask title"
                          className="flex-1 p-1 border rounded mr-3"
                        />
                        <div className="text-sm text-gray-500">
                          {(st.files?.length || 0) > 0 ? 'Submitted' : 'Pending'}
                        </div>
                        <button
                          onClick={() => removeSubtaskInView(st.id)}
                          className="ml-3 text-red-600"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {/* Assigned Members Display */}
                      <div className="flex flex-wrap mt-2 gap-1">
                        {st.members.length > 0 ? (
                          st.members.map((m) => (
                            <span
                              key={m}
                              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full"
                            >
                              {m}
                            </span>
                          ))
                        ) : (
                          <span className="text-gray-400 text-xs">No members assigned</span>
                        )}
                      </div>

                      {/* Select Members */}
                      <select
                        multiple
                        value={st.members}
                        onChange={(e) =>
                          updateSubtaskInView(
                            st.id,
                            'members',
                            Array.from(e.target.selectedOptions).map((opt) => opt.value)
                          )
                        }
                        className="w-full mt-2 p-2 border rounded"
                      >
                        {viewingProject.members.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      </select>

                      {/* Upload Files */}
                      <div className="mt-3 flex items-center space-x-2">
                        <label className="inline-flex items-center px-3 py-2 border rounded cursor-pointer hover:bg-gray-50">
                          <UploadCloud size={16} className="mr-2" />
                          <span className="text-sm">Upload</span>
                          <input
                            type="file"
                            multiple
                            onChange={(e) => handleFileUploadInView(st.id, e.target.files)}
                            className="hidden"
                          />
                        </label>
                        {st.files?.map((f) => (
                          <div
                            key={f.id}
                            className="flex items-center space-x-1 bg-gray-100 px-2 py-1 rounded"
                          >
                            <a
                              href={f.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs truncate max-w-[80px]"
                            >
                              {f.name}
                            </a>
                            <button
                              onClick={() => removeFileInView(st.id, f.id)}
                              className="text-red-500"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={saveViewChanges}
                  className="mt-4 w-full bg-green-700 text-white py-2 rounded hover:bg-green-800 transition"
                >
                  Save Changes
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaborativeWorkspace;