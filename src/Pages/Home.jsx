import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../Components/Sidebar.jsx";
import { Bell, DollarSign, Users, Briefcase, CalendarDays } from "lucide-react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

const Home = ({ user = {}, onLogout = () => {} }) => {
  const [personalProjects, setPersonalProjects] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [calendarDate, setCalendarDate] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef();

  // Mock fetching
  useEffect(() => {
    setPersonalProjects([
      { id: 1, name: "Portfolio Website", dueDate: "2025-11-20", progress: 80 },
      { id: 2, name: "Blog Revamp", dueDate: "2025-11-30", progress: 50 },
    ]);
    setCollabProjects([
      { id: 1, name: "E-Commerce App", teamSize: 5, dueDate: "2025-12-10", progress: 60 },
      { id: 2, name: "Marketing Site", teamSize: 3, dueDate: "2025-11-25", progress: 90 },
    ]);
    setExpenses([
      { id: 1, category: "Hosting", amount: 20 },
      { id: 2, category: "Subscriptions", amount: 45 },
      { id: 3, category: "Equipment", amount: 120 },
    ]);
    setRecentActivity([
      { id: 1, user: "NJ", action: "updated", target: "Portfolio Website", workspace: "Personal", time: "2h ago" },
      { id: 2, user: "Team Alpha", action: "completed", target: "Marketing Site", workspace: "Collaborative", time: "1 day ago" },
      { id: 3, user: "NJ", action: "added new expense", target: "Software Subscription", workspace: "Expense Tracker", time: "3 days ago" },
    ]);
  }, []);

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Upcoming tasks in next 7 days
  const upcomingTasks = [...personalProjects, ...collabProjects].filter(p => {
    const due = new Date(p.dueDate);
    const now = new Date();
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  const totalPersonal = personalProjects.length;
  const totalCollaborative = collabProjects.length;
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const allDates = [...personalProjects.map(p => p.dueDate), ...collabProjects.map(p => p.dueDate)];

  const tileClassName = ({ date }) => {
    if (allDates.includes(date.toISOString().split("T")[0])) {
      return "bg-green-600 text-white rounded-full";
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-4 pl-16 lg:p-6 xl:p-6 md:ml-64 overflow-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-2 sm:space-y-0 relative">
          <div>
            <h2 className="text-2xl md:text-3xl lg:text-2xl font-bold text-gray-800">Dashboard</h2>
            <p className="text-gray-600">Welcome back, {user?.name || "NJ"}</p>
          </div>

          {/* Bell Notification */}
          <div ref={bellRef} className="relative">
            <Bell
              size={24}
              className="text-gray-600 cursor-pointer"
              onClick={() => setShowNotifications(!showNotifications)}
            />
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-4 z-50 border border-gray-200">
                <h4 className="font-bold mb-2">Upcoming Tasks (Next 7 Days)</h4>
                {upcomingTasks.length > 0 ? (
                  upcomingTasks.map(p => (
                    <div key={p.id} className="border-b py-2 last:border-b-0">
                      <p className="text-sm font-medium">{p.name}</p>
                      <p className="text-xs text-gray-500">Due: {p.dueDate}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-500">No upcoming tasks!</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[ 
            { icon: Briefcase, label: "Personal Projects", value: totalPersonal },
            { icon: Users, label: "Collaborative Projects", value: totalCollaborative },
            { icon: DollarSign, label: "Total Expenses", value: `$${totalExpenses}` },
            { icon: CalendarDays, label: "Upcoming Tasks", value: allDates.length },
          ].map((stat, idx) => (
            <div key={idx} className="bg-green-700 text-white p-3 rounded-xl flex items-center space-x-4">
              <stat.icon size={28} />
              <div>
                <p className="text-sm opacity-80">{stat.label}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Calendar */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-6 border-4 border-green-700 overflow-x-auto">
          <h3 className="text-lg font-bold mb-4">Calendar Overview</h3>
          <Calendar onChange={setCalendarDate} value={calendarDate} tileClassName={tileClassName} />
        </div>

        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-lg p-4 mb-8 border-4 border-green-700 overflow-x-auto">
          <h3 className="text-lg font-bold mb-4">Upcoming Deadlines</h3>
          {[...personalProjects, ...collabProjects]
            .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
            .map((p) => (
              <div key={p.id} className="flex justify-between border-b pb-2 last:border-b-0 mb-2">
                <div>
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-gray-400">Due: {p.dueDate}</p>
                </div>
                <p className="text-sm text-gray-600">{p.progress}%</p>
              </div>
            ))}
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow-lg p-4 border-4 border-green-700 overflow-x-auto">
          <h3 className="text-lg font-bold mb-4">Recent Activity</h3>
          <div className="space-y-3">
            {recentActivity.map((act) => (
              <div key={act.id} className="flex justify-between border-b pb-2 last:border-b-0">
                <div>
                  <p className="text-sm">
                    <span className="font-medium">{act.user}</span> {act.action}{" "}
                    <span className="font-medium">{act.target}</span>
                  </p>
                  <p className="text-xs text-gray-500">{act.workspace} • {act.time}</p>
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