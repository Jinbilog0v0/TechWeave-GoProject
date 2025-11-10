import React from 'react';
import Sidebar from '../Components/Sidebar.jsx';
import { Bell } from 'lucide-react';
import mockData from '../mockData.js';

const Home = ({ user = {}, onLogout = () => {} }) => {
  const { statsData, recentProjects, recentActivity, upcomingDeadlines } = mockData;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <Sidebar user={user} onLogout={onLogout} />

      {/* Main Content */}
      <div className="flex-1 p-8 ml-64 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600">Welcome back, {user?.name || 'NJ'}</p>
          </div>
          <Bell size={24} className="text-gray-600" />
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          {statsData.map((stat, index) => (
            <div key={index} className="bg-green-700 text-white p-6 rounded-xl shadow-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm opacity-90">{stat.label}</span>
                <span className="text-2xl">{stat.icon}</span>
              </div>
              <p className="text-4xl font-bold">{stat.value}</p>
              <p className="text-sm mt-2 opacity-90">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Recent Projects */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-4 border-green-700">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Projects</h3>
          <div className="space-y-4">
            {recentProjects.map(project => (
              <div key={project.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <p className="font-medium text-gray-800">{project.name}</p>
                    <p className="text-sm text-gray-500">{project.description}</p>
                    <p className="text-xs text-gray-400">
                      {project.category} • {project.priority} Priority • Team: {project.teamSize}
                    </p>
                  </div>
                  <span className="text-sm font-medium text-gray-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-700 h-2 rounded-full" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border-4 border-green-700">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Upcoming Deadlines</h3>
          <div className="space-y-3">
            {upcomingDeadlines.map(deadline => (
              <div key={deadline.id} className="flex justify-between items-center border-b pb-2 last:border-b-0">
                <div>
                  <p className="font-medium text-gray-800">{deadline.task}</p>
                  <p className="text-sm text-gray-500">{deadline.project}</p>
                  <p className="text-xs text-gray-400">
                    Due: {deadline.dueDate} • {deadline.status} • {deadline.completionPercentage}% done
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm text-gray-600">{deadline.assignee}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-6 border-4 border-green-700">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((act, idx) => (
              <div key={idx} className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-orange-400 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">{act.avatar}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-800">
                    <span className="font-medium">{act.user}</span> {act.action}{' '}
                    <span className="font-medium">{act.project}</span>
                  </p>
                  <p className="text-xs text-gray-500">{act.time} • {act.taskName}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;