import React from 'react';
import { Trash2 } from 'lucide-react';

const DeleteBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-sm text-red-600"
    >
      <Trash2 size={16} />
      <span>Delete</span>
    </button>
  );
};

export default DeleteBtn;