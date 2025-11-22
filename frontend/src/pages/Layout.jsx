import React from 'react'
import api from '../api';
import { useState, useEffect } from 'react';
import { Home, Users, Edit3, Settings as SettingsIcon, LogOut, Info, Menu, X, TrendingUp } from 'lucide-react'; 
import { useNavigate, useLocation, Outlet } from 'react-router-dom';


const Layout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isOpen, setIsOpen] = useState(false); 

useEffect(() => {
  api.get("/api/users/me/")
     .then(res => setUser(res.data))
     .catch(() => console.log("Could not find user"));
}, []);

  const handleLogout = () => {
    if (e) E.stopPropagation();
    if (onLogout) onLogout();
    navigate('/');
  };

const getInitials = (name) => {
  if (!name) return "U";
  const words = name.split(" ");
  if (words.length === 1) return name.substring(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
};


const stringToColor = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const color = `hsl(${hash % 360}, 60%, 50%)`; 
  return color;
};

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'personal', label: 'Personal Workspace', icon: Users, path: '/personalworkspace' },
    { id: 'collaborative', label: 'Collaborative Workspace', icon: Users, path: '/collaborativeworkspace' },
    { id: 'expenses', label: 'Expense Tracker', icon: Edit3, path: '/expensetrack' },
    { id: 'reports', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
  ];

  return (
    <div className="flex h-screen overflow-hidden">
{/* ----- Sidebar (Desktop) ----- */}
<div className="hidden md:flex flex-col w-64 bg-white shadow-lg">

  {/* Logo Section */}
  <div className="p-6 border-b flex items-center gap-3 shrink-0">
    <div className="w-10 h-10 rounded-full flex items-center justify-center">
      <img src="./Images/TemporaryLogo-removebg.png" alt="Logo" className="w-10 h-10" />
    </div>
    <div>
      <h1 className="text-xl font-bold text-green-700">GoProject</h1>
      <p className="text-xs text-gray-500">Project Management</p>
    </div>
  </div>

  {/* Main Navigation */}
  <div className="flex-1 overflow-y-auto p-4">
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const active = location.pathname === item.path;

        return (
          <button
            key={item.id}
            onClick={() => item.action ? item.action() : navigate(item.path)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition
              ${active ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}
            `}
          >
            <Icon size={20} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  </div>

  {/* Desktop User Info */}
        <div className="p-4 border-t shrink-0">
          <div 
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
            onClick={() => navigate('/profile')}
            title="Go to Profile"
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden"
              style={{ backgroundColor: user?.profile?.profile_picture ? 'transparent' : (user ? stringToColor(user.username || user.email) : 'gray') }}
            >
              {user?.profile?.profile_picture ? (
                 <img 
                   src={`http://127.0.0.1:8000${user.profile.profile_picture}`} 
                   className="w-full h-full object-cover" 
                   alt="Avatar" 
                 />
              ) : (
                <span className="text-white font-bold text-sm">
                  {getInitials(user?.username || user?.email)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold truncate text-gray-800">{user?.username || "User"}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email || "email@example.com"}</p>
            </div>
            <button
              onClick={handleLogout} 
              className="hover:bg-red-50 hover:text-red-600 p-2 rounded transition ml-auto"
              title="Logout"
            >
              <LogOut size={18} />
            </button>   
          </div>
        </div>

</div>


{/* ----- Mobile Toggle Button ----- */}
<button
  onClick={() => setIsOpen(true)}
  className="md:hidden fixed top-4 left-4 bg-white p-2 rounded-md shadow-md z-20 hover:bg-gray-50 transition"
>
  <Menu size={24} />
</button>

{/* ----- Mobile Sidebar Overlay ----- */}
{isOpen && (
  <div className="fixed inset-0 bg-black/40 z-30 md:hidden" onClick={() => setIsOpen(false)}>
    <div
      className="absolute left-0 top-0 w-64 bg-white h-full shadow-lg flex flex-col"
      onClick={(e) => e.stopPropagation()}
    >

      {/* Mobile Header */}
      <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
        <div className="flex items-center gap-3">
          <img src="./Images/TemporaryLogo-removebg.png" className="w-10 h-10" alt="Logo" />
          <div>
            <h1 className="text-xl font-bold text-green-700">GoProject</h1>
            <p className="text-xs text-gray-500">Project Management</p>
          </div>
        </div>

        <button onClick={() => setIsOpen(false)} className="hover:bg-gray-100 p-1 rounded transition">
          <X size={24} />
        </button>
      </div>

      {/* Mobile Menu Items */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const active = location.pathname === item.path;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setIsOpen(false);
                  item.action ? item.action() : navigate(item.path);
                }}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition
                  ${active ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}
                `}
              >
                <Icon size={20} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile User Info */}
      <div className="p-4 border-t shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
            style={{ backgroundColor: user ? stringToColor(user.username || user.email) : 'gray' }}
          >
            <span className="text-white font-bold text-sm">
              {getInitials(user?.username || user?.email)}
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate">{ user?.username  ||"User"}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email || "email@example.com"}</p>
          </div>
        </div>
      </div> 
    </div>
  </div>
)}



      {/* Main Content */}
      <div className="flex-1 overflow-y-auto bg-gray-50">
        <div className="p-4 md:p-6 lg:p-8">
          <Outlet  context={{ user, setUser }}  />
        </div>
      </div>
    </div>
  );
};

export default Layout;