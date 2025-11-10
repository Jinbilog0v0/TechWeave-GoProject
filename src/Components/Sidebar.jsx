import { Home, Users, Edit3, Settings as SettingsIcon, LogOut, Plus, Info } from 'lucide-react'; 
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ user = {}, onLogout }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home, path: '/home' },
    { id: 'personal', label: 'Personal Workspace', icon: Users, path: '/personalworkspace' },
    { id: 'collaborative', label: 'Collaborative Workspace', icon: Users, path: '/collaborativeworkspace' },
    { id: 'expenses', label: 'Expense Tracker', icon: Edit3, path: '/expensetrack' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, path: '/settings' },
    { id: 'about', label: 'About', icon: Info, path: '/about' }
  ];

  const handleLogout = () => {
    if (onLogout) onLogout();
    navigate('/'); // Go back to landing page
  };

  return (
    <div className="fixed top-0 left-0 h-screen w-64 bg-white shadow-lg flex flex-col z-50">
      <div className="p-6 flex-1">
        <div className="flex items-center space-x-2 mb-8 cursor-pointer" onClick={() => navigate('/home')}>
          <div className="w-10 h-10 rounded-full flex items-center justify-center">
            <img src="./Images/TemporaryLogo-removebg.png" alt="Logo" className="w-10 h-10" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-green-700">GoProject</h1>
            <p className="text-xs text-gray-500">Project Management</p>
          </div>
        </div>

        <nav className="space-y-2">
          {menuItems.map(item => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.id}
                onClick={() => navigate(item.path)}
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
  );
};

export default Sidebar;