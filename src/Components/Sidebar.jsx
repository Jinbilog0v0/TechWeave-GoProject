import { useState } from 'react';
import { Home, Users, Edit3, Settings as SettingsIcon, LogOut, Info, Menu, X, BarChart, BarChart2Icon } from 'lucide-react'; 
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false); 

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'personal', label: 'Personal Workspace', icon: Users, path: '/personalworkspace' },
    { id: 'collaborative', label: 'Collaborative Workspace', icon: Users, path: '/collaborativeworkspace' },
    { id: 'expenses', label: 'Expense Tracker', icon: Edit3, path: '/expensetrack' },
    { id: 'analytics', label: 'Analytics', icon: BarChart2Icon, path: '/analytics' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
    { id: 'about', label: 'About', icon: Info, path: '/about' }
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/');
  };

  return (
    <>
      {/* Hamburger Button for Mobile */}
      {!isOpen && (
        <button
          className="fixed top-4 left-4 z-60 md:hidden text-gray-600 hover:text-green-700 p-2 rounded-md"
          onClick={() => setIsOpen(true)}
        >
          <Menu size={24} />
        </button>
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col z-50
          transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
          md:translate-x-0 md:flex
        `}
      >
        {/* Close button inside sidebar on mobile */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-600 hover:text-green-700"
          onClick={() => setIsOpen(false)}
        >
          <X size={24} />
        </button>

        <div className="flex-1 flex flex-col justify-between mt-12 md:mt-0">
          <div className="p-6">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => {navigate('/home'); setIsOpen(false)}}>
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img src="./Images/TemporaryLogo-removebg.png" alt="Logo" className="w-10 h-10" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-green-700">GoProject</h1>
                <p className="text-xs text-gray-500">Project Management</p>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-2">
              {menuItems.map(item => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <button
                    key={item.id}
                    onClick={() => { navigate(item.path); setIsOpen(false); }}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive ? 'bg-green-50 text-green-700' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* User Info & Logout */}
          <div className="p-6 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">{user?.avatar || "NJ"}</span>
                </div>
                <div>
                  <p className="text-sm font-medium">{user?.name || "NJ"}</p>
                  <p className="text-xs text-gray-500">{user?.email || "nealjeanclaro@gmail.com"}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-gray-600 hover:text-green-700"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;