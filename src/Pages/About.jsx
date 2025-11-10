import React from 'react';
import Sidebar from '../Components/Sidebar';
import { Code, Users, Target, Award } from 'lucide-react';

const About = ({ user, onLogout }) => {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      <Sidebar user={user} onLogout={onLogout} />
      
      <div className="flex-1 p-8 ml-64 overflow-auto">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">About GoProject</h2>
            <p className="text-gray-600">Learn more about our project management system</p>
          </div>

          {/* Hero Section */}
          <div className="bg-gradient-to-r from-green-600 to-green-800 text-white rounded-xl shadow-lg p-12 mb-8">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                <img src="/Images/TemporaryLogo-removebg.png" alt="GoProject Logo" className="w-20 h-20" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-center mb-4">GoProject</h1>
            <p className="text-xl text-center text-green-100">
              A comprehensive project management solution for teams and individuals
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <Code className="text-green-700 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Modern Technology</h3>
              <p className="text-gray-600">
                Built with React, Vite, and Tailwind CSS for a fast and responsive experience.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Users className="text-green-700 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
              <p className="text-gray-600">
                Work together seamlessly with shared workspaces and real-time updates.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Target className="text-green-700 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Goal Tracking</h3>
              <p className="text-gray-600">
                Set milestones, track progress, and achieve your project goals efficiently.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
              <Award className="text-green-700 mb-4" size={32} />
              <h3 className="text-xl font-bold mb-2">Best Practices</h3>
              <p className="text-gray-600">
                Follow industry-standard project management methodologies and workflows.
              </p>
            </div>
          </div>

          {/* Tech Stack */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h3 className="text-2xl font-bold mb-6">Technology Stack</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Frontend:</p>
                <p className="text-sm text-gray-600">React.js, Vite, Tailwind CSS</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Backend:</p>
                <p className="text-sm text-gray-600">Django REST Framework, Python</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">Database:</p>
                <p className="text-sm text-gray-600">MongoDB</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium">APIs:</p>
                <p className="text-sm text-gray-600">REST API, EmailJS, SendGrid</p>
              </div>
            </div>
          </div>

          {/* Version Info */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h3 className="text-2xl font-bold mb-4">Version Information</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Version:</strong> 1.0.0</p>
              <p><strong>Release Date:</strong> November 2025</p>
              <p><strong>Last Updated:</strong> November 10, 2025</p>
              <p><strong>Developer:</strong> TechWeave Team</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;