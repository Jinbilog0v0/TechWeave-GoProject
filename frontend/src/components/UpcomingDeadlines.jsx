import React from 'react';
import { Calendar, Clock, AlertCircle } from 'lucide-react';
import EmptyContainer from './EmptyContainer';

const UpcomingDeadlines = ({ items }) => {
  // Helper to format date
  const formatDate = (dateString) => {
    if (!dateString) return { day: '--', month: '--', isUrgent: false };
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleString('default', { month: 'short' }),
      // Urgent if due within 3 days
      isUrgent: (date - new Date()) / (1000 * 60 * 60 * 24) <= 3
    };
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-bold text-gray-800">Upcoming Deadlines</h3>
        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
          {items.length} Pending
        </span>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 space-y-4 relative">
        {items.length > 0 ? items.map((item) => {
          const { day, month, isUrgent } = formatDate(item.end_date);
          
          return (
            <div key={item.id} className="flex items-center group cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
              <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center border 
                ${isUrgent ? 'bg-red-50 border-red-100 text-red-600' : 'bg-white border-gray-200 text-gray-500'}`}>
                <span className="text-[10px] uppercase font-bold">{month}</span>
                <span className="text-lg font-bold leading-none">{day}</span>
              </div>

              <div className="ml-3 flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-800 truncate">
                  {item.title}
                </h4>
                <div className="flex items-center text-xs text-gray-400 mt-1">
                  <Clock className="w-3 h-3 mr-1" />
                  <span>{item.end_date}</span>
                  {isUrgent && (
                    <span className="ml-2 flex items-center text-red-500 font-medium">
                      <AlertCircle className="w-3 h-3 mr-1" /> Due Soon
                    </span>
                  )}
                </div>
              </div>
              
              {/* Status Badge */}
              <span className={`text-[10px] px-2 py-1 rounded-full ml-2 
                ${item.status === 'Done' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                {item.status}
              </span>
            </div>
          );
        }) : (
           <div>
            <EmptyContainer />
           </div>
        )}
        
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
      </div>
    </div>
  );
};

export default UpcomingDeadlines;