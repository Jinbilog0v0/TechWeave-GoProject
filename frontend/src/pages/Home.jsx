import React, { useState, useEffect, useRef } from "react";
// Added CalendarX and History for the empty states
import { Bell, DollarSign, Users, Briefcase, CalendarDays, TrendingUp, CalendarX, History } from "lucide-react";
import EmptyContainer from "../components/EmptyContainer";
import api from "../api";

const Home = ({ user = {} }) => {
  const [personalProjects, setPersonalProjects] = useState([]);
  const [collabProjects, setCollabProjects] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const bellRef = useRef();

  // Fetch data from backend
const fetchData = async () => {
        try {
            // 1. Fetch ONLY Personal Projects
            const personalRes = await api.get("/api/projects/?type=Personal");
            setPersonalProjects(personalRes.data);

            // 2. Fetch ONLY Collaborative Projects
            const collabRes = await api.get("/api/projects/?type=Collaborative");
            setCollabProjects(collabRes.data);
        } catch (error) {
            console.error("Error fetching projects:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

  // Data Processing
  const upcomingTasks = [...personalProjects, ...collabProjects].filter(p => {
    if (!p.end_date) return false;
    const due = new Date(p.end_date);
    const now = new Date();
    const diff = (due - now) / (1000 * 60 * 60 * 24);
    return diff >= 0 && diff <= 7;
  });

  // Combine and sort deadlines for display
  const allDeadlines = [...personalProjects, ...collabProjects]
    .sort((a, b) => new Date(a.end_date) - new Date(b.end_date));

  const totalPersonal = personalProjects.length;
  const totalCollaborative = collabProjects.length;
  const totalExpenses = Array.isArray(expenses) 
    ? expenses.reduce((sum, e) => sum + Number(e.amount || 0), 0) 
    : 0;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-gray-600 mt-1">Welcome back, {user?.first_name || user?.username || "User"}</p>
        </div>

        {/* Bell Notification */}
        <div ref={bellRef} className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 hover:bg-gray-100 rounded-full transition relative"
          >
            <Bell size={24} className="text-gray-700" />
            {upcomingTasks.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-lg p-4 z-50 border border-gray-200">
              <h4 className="font-bold mb-3 text-gray-800">Upcoming Tasks (Next 7 Days)</h4>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {upcomingTasks.map(p => (
                    <div key={p.id} className="border-b pb-2 last:border-b-0">
                      <p className="text-sm font-medium text-gray-800">{p.title}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-gray-500">Due: {p.end_date?.split("T")[0]}</p>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No upcoming tasks!</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[ 
          { icon: Briefcase, label: "Personal Projects", value: totalPersonal, color: "bg-green-600" },
          { icon: Users, label: "Collaborative Projects", value: totalCollaborative, color: "bg-blue-600" },
          { icon: DollarSign, label: "Total Expenses", value: `$${totalExpenses}`, color: "bg-purple-600" },
          { icon: CalendarDays, label: "Upcoming Tasks", value: upcomingTasks.length, color: "bg-orange-600" },
        ].map((stat, idx) => (
          <div key={idx} className={`${stat.color} text-white p-4 rounded-xl shadow-md hover:shadow-lg transition`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90 mb-1">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
              <stat.icon size={40} className="opacity-80" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6 min-h-[400px]">
        
        {/* Upcoming Deadlines */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col h-full">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <TrendingUp size={20} className="text-green-600" />
            Upcoming Deadlines
          </h3>

          <div className="flex-1 flex flex-col">
            {allDeadlines.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {allDeadlines.map((p) => (
                  <div key={p.id} className="border-b pb-3 last:border-b-0 bg-gray-100 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-1">
                      <p className="font-medium text-gray-800">{p.title}</p>
                      <span className="text-sm bg-green-100 text-green-700 px-2 py-1 rounded font-medium">
                        {p.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">Due: {p.end_date?.split("T")[0]}</p>
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State for Deadlines */
              <div className="flex-1 flex items-center justify-center">
                <EmptyContainer 
                  title="No Deadlines" 
                  description="You have no upcoming project deadlines. Enjoy your free time!"
                  icon={CalendarX}
                  showLearnMore={false}
                />
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-md p-6 border border-gray-200 flex flex-col h-full">
          <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
            <Users size={20} className="text-green-600" />
            Recent Activity
          </h3>

          <div className="flex-1 flex flex-col">
            {recentActivity.length > 0 ? (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {recentActivity.map((act) => (
                  <div key={act.id} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                      <span className="text-green-700 font-bold text-xs">
                        {act.user_name?.substring(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800">
                        <span className="font-semibold">{act.user_name}</span> {act.action}{" "}
                        <span className="font-semibold">{act.project_title}</span>
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(act.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
               /* Empty State for Activity */
              <div className="flex-1 flex items-center justify-center">
                 <EmptyContainer 
                  title="No Recent Activity" 
                  description="No recent actions logged. Collaborators' updates will appear here."
                  icon={History}
                  showLearnMore={false}
                />
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Home;