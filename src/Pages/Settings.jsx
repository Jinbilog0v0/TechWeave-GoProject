import React, { useState, useEffect } from "react";
import Sidebar from "../Components/Sidebar";
import { Save, User, Bell, Shield, Palette } from "lucide-react";

const Settings = ({ user: propUser, onLogout }) => {
  const [user, setUser] = useState(propUser || null); // store user state locally
  const [settings, setSettings] = useState({
    displayName: "",
    email: "",
    notifications: {
      email: true,
      push: true,
      projectUpdates: true,
      deadlines: true,
    },
    theme: "light",
    language: "en",
  });

  // Initialize user from props or localStorage
  useEffect(() => {
    const storedUser = propUser || JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setSettings(prev => ({
        ...prev,
        displayName: storedUser.name || "",
        email: storedUser.email || "",
      }));
    }
  }, [propUser]);

  const handleSave = () => {
    alert("Settings saved successfully!");
    // Optionally update localStorage or call your API
    const updatedUser = { ...user, name: settings.displayName, email: settings.email };
    localStorage.setItem("user", JSON.stringify(updatedUser));
    setUser(updatedUser);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />

      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Settings</h2>
          <p className="text-gray-600 mb-6">Manage your account and preferences</p>

          {/* Profile */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <User className="text-green-700" size={24} />
              <h3 className="text-xl font-bold">Profile Settings</h3>
            </div>
            <div className="space-y-4">
              <input
                type="text"
                value={settings.displayName}
                onChange={e => setSettings({ ...settings, displayName: e.target.value })}
                placeholder="Display Name"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
              <input
                type="email"
                value={settings.email}
                onChange={e => setSettings({ ...settings, email: e.target.value })}
                placeholder="Email"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Notifications */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Bell className="text-green-700" size={24} />
              <h3 className="text-xl font-bold">Notifications</h3>
            </div>
            <div className="space-y-3">
              {Object.entries(settings.notifications).map(([key, value]) => (
                <label key={key} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={e =>
                      setSettings({
                        ...settings,
                        notifications: { ...settings.notifications, [key]: e.target.checked },
                      })
                    }
                    className="w-5 h-5 text-green-700 rounded focus:ring-green-500"
                  />
                  <span>{key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Appearance */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Palette className="text-green-700" size={24} />
              <h3 className="text-xl font-bold">Appearance</h3>
            </div>
            <select
              value={settings.theme}
              onChange={e => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-4 py-2 mb-4 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
            <select
              value={settings.language}
              onChange={e => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            >
              <option value="en">English</option>
              <option value="tl">Tagalog</option>
              <option value="es">Spanish</option>
            </select>
          </div>

          {/* Security */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <div className="flex items-center space-x-2 mb-4">
              <Shield className="text-green-700" size={24} />
              <h3 className="text-xl font-bold">Security</h3>
            </div>
            <button className="px-6 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors">
              Change Password
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center space-x-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
          >
            <Save size={20} />
            <span>Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;