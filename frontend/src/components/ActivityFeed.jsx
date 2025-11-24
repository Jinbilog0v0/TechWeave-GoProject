import React from 'react';
import { CheckCircle, PlusCircle, FileText, Activity } from 'lucide-react';

const ActivityFeed = ({ logs = [] }) => { // Added default value to prevent errors
  
  const getIcon = (action) => {
    if (action.includes('completed')) return <CheckCircle className="w-4 h-4 text-white" />;
    if (action.includes('added')) return <PlusCircle className="w-4 h-4 text-white" />;
    return <FileText className="w-4 h-4 text-white" />;
  };

  const getColor = (action) => {
    if (action.includes('completed')) return 'bg-green-500';
    if (action.includes('added')) return 'bg-blue-500';
    return 'bg-gray-400';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-96 flex flex-col">
      <div className="p-5 border-b border-gray-100">
        <h3 className="font-bold text-gray-800">Recent Activity</h3>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar p-5 relative">
        {logs.length > 0 ? (
          /* --- LIST CONTENT --- */
          <div className="space-y-6 relative">
            <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-gray-100" />
            {logs.map((log) => (
              <div key={log.id} className="relative flex items-start z-10 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-4 border-white ${getColor(log.action)}`}>
                  {getIcon(log.action)}
                </div>
                <div className="ml-4 pt-1">
                  <p className="text-sm text-gray-800">
                    <span className="font-semibold">{log.user_name}</span>{" "}
                    {log.action}{" "}
                    <span className="text-gray-500">in</span>{" "}
                    <span className="font-medium text-blue-600">{log.project_title}</span>
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(log.timestamp).toLocaleDateString()} • {new Date(log.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </p>
                </div>
              </div>
            ))}
             {/* Gradient Fade only shows when there is content */}
             <div className="fixed bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-white to-transparent pointer-events-none" />
          </div>
        ) : (
          /* --- EMPTY STATE WITH ANIMATION --- */
          <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
            <div className="relative flex items-center justify-center">
              {/* Pulsing Background Circle */}
              <div className="absolute w-12 h-12 bg-blue-100 rounded-full animate-ping opacity-75"></div>
              {/* Static Icon Container */}
              <div className="relative bg-blue-50 p-4 rounded-full border border-blue-100">
                <Activity className="w-6 h-6 text-blue-500" />
              </div>
            </div>
            
            <div className="animate-in fade-in zoom-in duration-700">
              <h4 className="text-sm font-semibold text-gray-900">No tasks yet</h4>
              <p className="text-xs text-gray-500 max-w-[200px] mt-1">
                Actions taken by you and your team will appear here.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;