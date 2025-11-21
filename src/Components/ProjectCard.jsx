import React, { useState } from 'react'; 
import { Edit, Trash2, Download, Eye, X } from 'lucide-react';

const ProjectCard = ({ project, onEdit, onDelete, collaborative, user, updateSubtaskFiles }) => {
  const [viewingTask, setViewingTask] = useState(null);

  const nextId = () => Date.now() + Math.floor(Math.random() * 1000);

  const calculateProgress = (subtasks) => {
    if (!subtasks?.length) return 0;
    const completed = subtasks.filter(st => (st.deliverables?.length || 0) > 0).length;
    return Math.round((completed / subtasks.length) * 100);
  };

  const handleOpenView = () => {
    setViewingTask({ ...project, subtasks: project.subtasks.map(st => ({ ...st })) });
  };

  const handleCloseView = () => setViewingTask(null);

  const handleDeliverableUpload = (subtaskId, files) => {
    if (!files || files.length === 0) return;
    const newFiles = Array.from(files).map(f => ({
      id: nextId(),
      file: f,
      name: f.name,
      url: URL.createObjectURL(f),
    }));

    setViewingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, deliverables: [...(st.deliverables || []), ...newFiles] } : st
      )
    }));
  };

  const handleRemoveFile = (subtaskId, fileId) => {
    setViewingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st => {
        if (st.id !== subtaskId) return st;
        const removed = st.deliverables.find(f => f.id === fileId);
        if (removed?.url) URL.revokeObjectURL(removed.url);
        return { ...st, deliverables: st.deliverables.filter(f => f.id !== fileId) };
      })
    }));
  };

  const updateSubtaskMembers = (subtaskId, members) => {
    setViewingTask(prev => ({
      ...prev,
      subtasks: prev.subtasks.map(st =>
        st.id === subtaskId ? { ...st, members } : st
      )
    }));
  };

  const saveChanges = () => {
    if (updateSubtaskFiles) {
      viewingTask.subtasks.forEach(st => {
        updateSubtaskFiles(project.id, st.id, st.deliverables || [], st.members || []);
      });
    }
    handleCloseView();
  };

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

      <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
        <div
          className="bg-green-700 h-2 rounded-full"
          style={{ width: `${calculateProgress(project.subtasks)}%` }}
        />
      </div>
      <p className="text-xs text-gray-600 mt-1">{calculateProgress(project.subtasks)}% complete</p>

      <div className="flex justify-end space-x-3 mt-4">
        <button onClick={onEdit} className="text-blue-600 hover:text-blue-800 transition">
          <Edit size={18} />
        </button>
        <button onClick={onDelete} className="text-red-600 hover:text-red-800 transition">
          <Trash2 size={18} />
        </button>
        <button onClick={handleOpenView} className="text-gray-700 hover:text-gray-900 transition flex items-center space-x-1">
          <Eye size={18} /> <span className="text-xs">View Details</span>
        </button>
      </div>

      {/* View Modal */}
      {viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-11/12 md:w-3/4 lg:w-1/2 max-h-[90vh] overflow-auto relative">
            <button onClick={handleCloseView} className="absolute top-3 right-3 text-gray-500 hover:text-gray-800">
              <X size={20} />
            </button>

            <h3 className="text-xl font-bold mb-2">{viewingTask.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{viewingTask.description}</p>
            <div className="text-xs text-gray-500 mb-3">Due: {viewingTask.dueDate}</div>

            <div className="space-y-3">
              {viewingTask.subtasks.map(st => (
                <div key={st.id} className={collaborative ? 'p-3 border rounded' : ''}>
                  <div className="flex justify-between items-center">
                    <span className="flex-1 font-medium">{st.title || st.name}</span>
                    {collaborative && <span className="text-xs text-gray-500">{(st.deliverables?.length || 0) > 0 ? 'Submitted' : 'Pending'}</span>}
                  </div>

                  {/* Show only assigned members for this subtask */}
                  {collaborative && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {st.members && st.members.length > 0
                        ? st.members.map(m => (
                            <span key={m} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">{m}</span>
                          ))
                        : <span className="text-gray-400 text-xs">No members assigned</span>
                      }
                    </div>
                  )}

                  {/* Upload section for collaborative only */}
                  {collaborative && (
                    <div className="mt-2 flex items-center space-x-2">
                      <label className="inline-flex items-center px-3 py-1 border rounded cursor-pointer hover:bg-gray-50">
                        Upload
                        <input type="file" multiple onChange={e => handleDeliverableUpload(st.id, e.target.files)} className="hidden" />
                      </label>
                      <div className="text-xs text-gray-500">{st.deliverables?.length || 0} file(s)</div>
                    </div>
                  )}

                  {st.deliverables?.length > 0 && (
                    <ul className="mt-1 text-sm space-y-1">
                      {st.deliverables.map(f => (
                        <li key={f.id} className="flex justify-between items-center">
                          <span className="truncate">{f.name}</span>
                          {collaborative && (
                            <div className="flex items-center space-x-2">
                              <a href={f.url} download className="text-blue-600 underline text-xs">Download</a>
                              <button onClick={() => handleRemoveFile(st.id, f.id)} className="text-red-600 text-xs">Remove</button>
                            </div>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 flex justify-end gap-2">
              {collaborative && (
                <button onClick={saveChanges} className="px-4 py-2 bg-green-700 text-white rounded">Save</button>
              )}
              <button onClick={handleCloseView} className="px-4 py-2 bg-gray-100 rounded">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;