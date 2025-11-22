import React, { useState, useEffect } from "react";
import api from "../api";
import { useOutletContext } from "react-router-dom";
import { Save, User, Bell, Shield, Palette, Globe } from "lucide-react";

const Settings = () => {
  const { setUser } = useOutletContext();

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

  const [isEditing, setIsEditing] = useState(false); 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/api/users/me/");
        setSettings(prev => ({
          ...prev,
          displayName: res.data.username,
          email: res.data.email,
        }));
      } catch (err) {
        console.error("Failed to load user", err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    try {
      const res = await api.put("/api/users/update/", {
        username: settings.displayName,
        email: settings.email,
      });

      alert("Profile updated successfully!");
      setIsEditing(false);

      // Update parent layout (sidebar)
      setUser(prev => ({
        ...prev,
        username: settings.displayName,
        email: settings.email,
      }));
    } catch (err) {
      console.error(err);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-green-100 rounded-lg">
            <User className="text-green-700" size={24} />
          </div>
          <div className="flex justify-between flex-1 items-center">
            <h3 className="text-xl font-bold text-gray-800">Profile Settings</h3>
            <button
              onClick={() => setIsEditing(prev => !prev)}
              className="px-3 py-1 text-sm bg-green-700 text-white rounded hover:bg-green-800 transition"
            >
              {isEditing ? "Cancel" : "Edit"}
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Display Name
            </label>
            <input
              type="text"
              value={settings.displayName}
              onChange={(e) => setSettings({ ...settings, displayName: e.target.value })}
              placeholder="Enter your display name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              readOnly={!isEditing} // <-- read-only if not editing
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={settings.email}
              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              placeholder="Enter your email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
              readOnly={!isEditing} // <-- read-only if not editing
            />
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Bell className="text-green-700" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Notifications</h3>
        </div>
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between py-3 border-b last:border-b-0">
              <span className="text-gray-700 font-medium">
                {key.replace(/([A-Z])/g, " $1").replace(/^./, str => str.toUpperCase())}
              </span>
              <button
                onClick={() =>
                  setSettings({
                    ...settings,
                    notifications: {
                      ...settings.notifications,
                      [key]: !settings.notifications[key],
                    },
                  })
                }
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
                  settings.notifications[key] ? "bg-green-600" : "bg-gray-300"
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    settings.notifications[key] ? "translate-x-6" : ""
                  }`}
                />
              </button>
            </label>
          ))}
        </div>
      </div>

      {/* Appearance & Language */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Appearance */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Palette className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Appearance</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Theme
            </label>
            <select
              value={settings.theme}
              onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>

        {/* Language */}
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-200">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-green-100 rounded-lg">
              <Globe className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-bold text-gray-800">Language</h3>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Preferred Language
            </label>
            <select
              value={settings.language}
              onChange={(e) => setSettings({ ...settings, language: e.target.value })}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
            >
              <option value="en">English</option>
              <option value="tl">Tagalog</option>
              <option value="es">Spanish</option>
            </select>
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-white rounded-xl shadow-md p-6 mb-6 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-green-100 rounded-lg">
            <Shield className="text-green-700" size={24} />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Security</h3>
        </div>
        <div>
          <p className="text-sm text-gray-600 mb-4">
            Update your password to keep your account secure
          </p>
          <button className="px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg font-semibold">
            Change Password
          </button>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className={`flex items-center gap-2 px-6 py-3 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-all shadow-md hover:shadow-lg font-semibold ${
            !isEditing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={!isEditing} // <-- disabled if not editing
        >
          <Save size={20} />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
