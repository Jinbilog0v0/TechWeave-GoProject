import React, { useEffect, useState } from 'react';
import Sidebar from '../Components/Sidebar';
import ProjectCard from '../Components/ProjectCard';
import { Plus, X, UploadCloud, Trash2, Download } from 'lucide-react';

const PersonalWorkspace = ({ user, onLogout }) => {
  // initial projects - now include subtasks and progress
  const [projects, setProjects] = useState([]);


  // modal states
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Pending',
    progress: 0,
    subtasks: []
  });

  // view-task modal
  const [viewingTask, setViewingTask] = useState(null); // project object being viewed
  const [showViewModal, setShowViewModal] = useState(false);

  // id helper
  const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

  // calculate progress: subtask completed if deliverables.length > 0
  const calculateProgress = (subtasks) => {
    if (!subtasks || subtasks.length === 0) return 0;
    const completed = subtasks.filter(st => (st.deliverables && st.deliverables.length > 0)).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  // open form for add/edit
  const openForm = (task = null) => {
    if (task) {
      setEditingTask(task);
      setFormData({
        name: task.name || '',
        description: task.description || '',
        dueDate: task.dueDate || '',
        status: task.status || 'Pending',
        progress: task.progress || 0,
        subtasks: task.subtasks ? task.subtasks.map(st => ({ ...st })) : []
      });
    } else {
      setEditingTask(null);
      setFormData({ name: '', description: '', dueDate: '', status: 'Pending', progress: 0, subtasks: [] });
    }
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingTask(null);
    setFormData({ name: '', description: '', dueDate: '', status: 'Pending', progress: 0, subtasks: [] });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: name === 'progress' ? Number(value) : value }));
  };

  // Subtask management inside Add/Edit modal
  const addSubtaskToForm = (title = '') => {
    setFormData(prev => ({ ...prev, subtasks: [...prev.subtasks, { id: nextId(), title, deliverables: [] }] }));
  };
  const updateSubtaskTitle = (id, title) => {
    setFormData(prev => ({ ...prev, subtasks: prev.subtasks.map(st => st.id === id ? { ...st, title } : st) }));
  };
  const removeSubtaskFromForm = (id) => {
    setFormData(prev => ({ ...prev, subtasks: prev.subtasks.filter(st => st.id !== id) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.dueDate) return alert('Please fill in all required fields.');

    if (editingTask) {
      setProjects(prev => prev.map(p => p.id === editingTask.id ? {
        ...p,
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status,
        subtasks: formData.subtasks.map(st => ({ ...st })),
        progress: calculateProgress(formData.subtasks)
      } : p));
    } else {
      const newProject = {
        id: nextId(),
        name: formData.name,
        description: formData.description,
        dueDate: formData.dueDate,
        status: formData.status,
        teamSize: 1,
        subtasks: formData.subtasks.map(st => ({ ...st })),
        progress: calculateProgress(formData.subtasks)
      };
      setProjects(prev => [newProject, ...prev]);
    }

    closeForm();
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setProjects(prev => prev.filter(p => p.id !== id));
    }
  };

  // OPEN view modal when clicking a card (Trigger A)
  const handleOpenViewModal = (project) => {
    // deep copy to avoid mutating source while editing inside modal
    setViewingTask({ ...project, subtasks: (project.subtasks || []).map(st => ({ ...st })) });
    setShowViewModal(true);
  };

  const closeViewModal = () => {
    setViewingTask(null);
    setShowViewModal(false);
  };

  // Upload deliverables for a subtask within viewingTask (multiple files allowed)
  const handleDeliverableUploadInView = (subtaskId, fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArr = Array.from(fileList).map(f => ({
      id: nextId(),
      file: f,
      name: f.name,
      size: f.size,
      type: f.type,
      url: URL.createObjectURL(f)
    }));

    setViewingTask(prev => {
      const updatedSubtasks = prev.subtasks.map(st => st.id === subtaskId ? {
        ...st,
        deliverables: [...(st.deliverables || []), ...filesArr]
      } : st);
      return { ...prev, subtasks: updatedSubtasks };
    });
  };

  // Remove file inside view modal
  const handleRemoveFileInView = (subtaskId, fileId) => {
    setViewingTask(prev => {
      const updatedSubtasks = prev.subtasks.map(st => {
        if (st.id !== subtaskId) return st;
        const removed = (st.deliverables || []).find(f => f.id === fileId);
        if (removed && removed.url) URL.revokeObjectURL(removed.url);
        return { ...st, deliverables: (st.deliverables || []).filter(f => f.id !== fileId) };
      });
      return { ...prev, subtasks: updatedSubtasks };
    });
  };

  // Save changes made in view modal back to main projects state (updates progress)
  const saveViewChanges = () => {
    if (!viewingTask) return;
    setProjects(prev => prev.map(p => p.id === viewingTask.id ? {
      ...p,
      subtasks: viewingTask.subtasks.map(st => ({ ...st })),
      progress: calculateProgress(viewingTask.subtasks)
    } : p));
    closeViewModal();
  };

  // Add subtask inside view modal
  const addSubtaskInView = (title = '') => {
    setViewingTask(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), { id: nextId(), title, deliverables: [] }]
    }));
  };

  // remove subtask inside view
  const removeSubtaskInView = (subtaskId) => {
    setViewingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.filter(st => st.id !== subtaskId)
    }));
  };

  // update subtask title inside view
  const updateSubtaskTitleInView = (subtaskId, title) => {
    setViewingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => st.id === subtaskId ? { ...st, title } : st)
    }));
  };

  // cleanup created objectURLs when unmounting
  useEffect(() => {
    return () => {
      projects.forEach(p => p.subtasks?.forEach(st => st.deliverables?.forEach(f => f.url && URL.revokeObjectURL(f.url))));
      if (viewingTask) viewingTask.subtasks?.forEach(st => st.deliverables?.forEach(f => f.url && URL.revokeObjectURL(f.url)));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

          {/* Add/Edit Form Modal (unchanged design, now supports subtasks) */}
          {showForm && (
            <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-xl p-6 w-96 relative max-h-[90vh] overflow-auto">
                <button
                  onClick={() => closeForm()}
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

                  {/* Collapsible Progress Slider (kept) */}
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

                  {/* Subtasks input inside Add/Edit modal (Option A) */}
                  <div className="border-t pt-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">Subtasks</h4>
                      <button type="button" onClick={() => addSubtaskToForm('')} className="inline-flex items-center px-3 py-1 bg-gray-100 rounded">
                        <Plus size={14} /> <span className="ml-2 text-sm">Add Subtask</span>
                      </button>
                    </div>

                    {formData.subtasks.length === 0 && <div className="text-sm text-gray-500">No subtasks added yet — click "Add Subtask" to create one.</div>}

                    <div className="space-y-2 mt-2">
                      {formData.subtasks.map(st => (
                        <div key={st.id} className="flex gap-2 items-start">
                          <input
                            type="text"
                            value={st.title}
                            onChange={(e) => updateSubtaskTitle(st.id, e.target.value)}
                            placeholder="Subtask title"
                            className="flex-1 p-2 border rounded"
                          />
                          <button type="button" onClick={() => removeSubtaskFromForm(st.id)} className="px-3 py-2 bg-red-100 text-red-700 rounded">
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

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

          {/* Projects grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => handleOpenViewModal(project)} // Trigger A: clicking the whole card opens view modal
                className="cursor-pointer"
              >
                <ProjectCard
                  project={project}
                  onEdit={(e) => { e.stopPropagation(); openForm(project); }} // stopPropagation so clicking edit doesn't open view modal
                  onDelete={(e) => { e.stopPropagation(); handleDelete(project.id); }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* View Task Modal */}
      {showViewModal && viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 w-11/12 md:w-3/4 lg:w-1/2 relative max-h-[90vh] overflow-auto">
            <button onClick={() => closeViewModal()} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>

            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">{viewingTask.name}</h3>
                <p className="text-sm text-gray-600">{viewingTask.description}</p>
                <div className="text-xs text-gray-500 mt-1">Due: {viewingTask.dueDate}</div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium">{viewingTask.status}</div>
                <div className="text-2xl font-bold">{calculateProgress(viewingTask.subtasks)}%</div>
              </div>
            </div>

            <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
              <div className="h-3 rounded-full bg-green-600" style={{ width: `${calculateProgress(viewingTask.subtasks)}%` }} />
            </div>

            {/* Subtasks list */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">Subtasks</h4>
                <button type="button" onClick={() => addSubtaskInView('')} className="inline-flex items-center px-3 py-1 bg-gray-100 rounded">
                  <Plus size={14} /> <span className="ml-2 text-sm">Add Subtask</span>
                </button>
              </div>

              {viewingTask.subtasks.length === 0 && <div className="text-sm text-gray-500">No subtasks yet — add one to start receiving deliverables.</div>}

              {viewingTask.subtasks.map(st => (
                <div key={st.id} className="p-3 border rounded">
                  <div className="flex justify-between items-center">
                    <input
                      type="text"
                      value={st.title}
                      onChange={(e) => updateSubtaskTitleInView(st.id, e.target.value)}
                      placeholder="Subtask Title"
                      className="flex-1 p-1 border rounded mr-3"
                    />
                    <div className="text-sm text-gray-500">{(st.deliverables?.length || 0) > 0 ? 'Submitted' : 'Pending'}</div>
                    <button onClick={() => removeSubtaskInView(st.id)} className="ml-3 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>

                  {/* Upload */}
                  <div className="mt-3 flex items-center space-x-2">
                    <label className="inline-flex items-center px-3 py-2 border rounded cursor-pointer hover:bg-gray-50">
                      <UploadCloud size={16} className="mr-2" />
                      <span className="text-sm">Upload</span>
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleDeliverableUploadInView(st.id, e.target.files)}
                        className="hidden"
                      />
                    </label>
                    <div className="text-xs text-gray-500">{st.deliverables?.length || 0} file(s)</div>
                  </div>

                  {/* Files list */}
                  {st.deliverables?.length > 0 && (
                    <ul className="mt-2 space-y-1 text-sm">
                      {st.deliverables.map(f => (
                        <li key={f.id} className="flex items-center justify-between">
                          <div className="truncate pr-2">{f.name}</div>
                          <div className="flex items-center space-x-2">
                            <a href={f.url} download={f.name} className="text-blue-600 underline text-xs inline-flex items-center">
                              <Download size={12} className="mr-1" />Download
                            </a>
                            <button onClick={() => handleRemoveFileInView(st.id, f.id)} className="text-red-600 text-xs inline-flex items-center">
                              <Trash2 size={12} className="mr-1" />Remove
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              <button onClick={() => { saveViewChanges(); }} className="px-4 py-2 bg-green-700 text-white rounded">Save</button>
              <button onClick={() => closeViewModal()} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonalWorkspace;