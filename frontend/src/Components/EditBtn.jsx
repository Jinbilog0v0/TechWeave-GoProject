import React from 'react';
import { Edit2 } from 'lucide-react';

const EditBtn = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center space-x-2 px-4 py-2 hover:bg-gray-50 text-sm text-gray-700"
    >
      <Edit2 size={16} />
      <span>Edit</span>
    </button>
  );
};

export default EditBtn;