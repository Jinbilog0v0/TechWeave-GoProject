import React, { useState, useEffect } from 'react';
import api from '../api';
import { Home, Users, Edit3, Settings as SettingsIcon, LogOut, Info, Menu, X, TrendingUp } from 'lucide-react'; 
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button"; 

const Layout = ({ onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [showLogoutDialog, setShowLogoutDialog] = useState(false); 

  const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

  useEffect(() => {
    api.get("/api/user/")
       .then(res => setUser(res.data))
       .catch((error) => console.log("Could not find user:", error)); 
  }, []);

  const handleLogout = (e) => {
    if (e) e.stopPropagation();
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
    return `hsl(${hash % 360}, 60%, 50%)`; 
  };

  const getProfileImageUrl = (userObj) => {
    if (!userObj?.profile?.profile_picture) return null;
    const pic = userObj.profile.profile_picture;
    if (pic.startsWith('http')) return pic;
    return `${BASE_URL}${pic}`;
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'personal', label: 'Personal Workspace', icon: Users, path: '/personalworkspace' },
    { id: 'collaborative', label: 'Collaborative Workspace', icon: Users, path: '/collaborativeworkspace' },
    { id: 'expenses', label: 'Expense Tracker', icon: Edit3, path: '/expensetrack' },
    { id: 'reports', label: 'Analytics', icon: TrendingUp, path: '/analytics' },
    { id: 'about', label: 'About', icon: Info, path: '/about' },
  ];

  return (
    // FIX: Wrap the entire Layout content within AlertDialog
    <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
      <div className="flex h-screen overflow-hidden">
        
        {/* Desktop Sidebar */}
        <div className="hidden md:flex flex-col w-64 bg-white shadow-lg animate-in slide-in-from-left duration-500 ease-out z-20">

          <div className="p-6 border-b flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-full flex items-center justify-center animate-in zoom-in duration-700 delay-300 fill-mode-backwards">
              <img src="/Images/TemporaryLogo-removebg.png" alt="Logo" className="w-10 h-10" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-700">GoProject</h1>
              <p className="text-xs text-gray-500">Project Management</p>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <nav className="space-y-1">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                const delayClass = `delay-[${index * 75}ms]`; 
                
                return (
                  <button
                    key={item.id}
                    onClick={() => item.action ? item.action() : navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition-all duration-300
                      ${active ? "bg-green-100 text-green-700 font-semibold translate-x-1" : "text-gray-700 hover:bg-gray-100 hover:translate-x-1"}
                      animate-in slide-in-from-left-4 fade-in fill-mode-backwards ${index < 5 ? 'duration-500' : 'duration-0'}
                    `}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-4 border-t shrink-0 animate-in slide-in-from-bottom-4 duration-700 delay-500 fill-mode-backwards">
            <div 
              className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition"
              onClick={() => navigate('/profile')}
              title="Go to Profile"
            >
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border border-gray-200 overflow-hidden"
                style={{ backgroundColor: user?.profile?.profile_picture ? 'transparent' : (user ? stringToColor(user.username || user.email) : 'gray') }}
              >
                {getProfileImageUrl(user) ? (
                    <img 
                      src={getProfileImageUrl(user)}
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
              {/* Logout Button with AlertDialogTrigger */}
              <AlertDialogTrigger asChild>
                  <button
                      // No need for onClick here, AlertDialogTrigger handles opening
                      className="hover:bg-red-50 hover:text-red-600 p-2 rounded transition ml-auto"
                      title="Logout"
                  >
                      <LogOut size={18} />
                  </button> 
              </AlertDialogTrigger>
            </div>
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsSidebarOpen(true)} // Use isSidebarOpen state
          className="md:hidden fixed top-4 left-4 bg-white p-2 rounded-md shadow-md z-20 hover:bg-gray-50 transition animate-in fade-in duration-500"
        >
          <Menu size={24} />
        </button>

        {/* Mobile Sidebar */}
        {isSidebarOpen && ( // Use isSidebarOpen state
          <div className="fixed inset-0 bg-black/40 z-30 md:hidden animate-in fade-in duration-300" onClick={() => setIsSidebarOpen(false)}>
            <div
              className="absolute left-0 top-0 w-64 bg-white h-full shadow-lg flex flex-col animate-in slide-in-from-left duration-300"
              onClick={(e) => e.stopPropagation()}
            >
               <div className="flex items-center justify-between p-6 border-b flex-shrink-0">
                 <div className="flex items-center gap-3">
                   <img src="/Images/TemporaryLogo-removebg.png" className="w-10 h-10" alt="Logo" />
                   <div>
                     <h1 className="text-xl font-bold text-green-700">GoProject</h1>
                   </div>
                 </div>
                 <button onClick={() => setIsSidebarOpen(false)} className="hover:bg-gray-100 p-1 rounded transition">
                   <X size={24} />
                 </button>
               </div>
               
               <nav className="flex-1 overflow-y-auto p-4">
                 <div className="space-y-1">
                   {menuItems.map((item) => {
                     const Icon = item.icon;
                     const active = location.pathname === item.path;
                     return (
                       <button
                         key={item.id}
                         onClick={() => { setIsSidebarOpen(false); item.action ? item.action() : navigate(item.path); }}
                         className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition
                           ${active ? "bg-green-100 text-green-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}
                         `}
                       >
                         <Icon size={20} />
                         <span>{item.label}</span>
                       </button>
                     );
                   })}
                   {/* Logout button in mobile sidebar */}
                   <AlertDialogTrigger asChild>
                      <button
                          // No need for onClick here, AlertDialogTrigger handles opening
                          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm transition text-red-700 hover:bg-red-50 font-semibold"
                          title="Logout"
                      >
                          <LogOut size={20} />
                          <span>Logout</span>
                      </button>
                   </AlertDialogTrigger>
                 </div>
               </nav>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto bg-gray-50 animate-in fade-in duration-700 delay-150 fill-mode-backwards">
          <div className="p-4 md:p-6 lg:p-8">
            <Outlet context={{ user, setUser }} />
          </div>
        </div>

  
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
            <AlertDialogDescription>
              You will be redirected to the landing page. You can always log back in.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel asChild>
                <Button variant="outline">Cancel</Button> 
            </AlertDialogCancel>
            <AlertDialogAction asChild>
                <Button variant="destructive" onClick={handleLogout} 
                className="bg-red-600 hover:bg-red-700 text-white">Log Out</Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>

      </div> 
    </AlertDialog> 
  );
};

export default Layout;