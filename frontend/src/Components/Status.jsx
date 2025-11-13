import React from 'react';

const Status = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'all done':
        return 'bg-green-100 text-green-700';
      case 'in progress':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      case 'overdue':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
      {status}
    </span>
  );
};

export default Status;