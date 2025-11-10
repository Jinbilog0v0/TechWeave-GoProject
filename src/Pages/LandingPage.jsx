import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, Users, BarChart, Shield } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 rounded-full flex items-center justify-center">
                <img src="./Images/TemporaryLogo-removebg.png" alt="Logo" className="w-10 h-10" />
              </div>
              <span className="text-xl font-bold text-green-700">Go</span>
              <span className="text-xl font-bold text-gray-700">Project</span>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="px-4 py-2 text-green-700 hover:bg-green-50 rounded-lg transition-colors"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/register')}
                className="px-4 py-2 bg-green-700 text-white rounded-lg hover:bg-green-800 transition-colors"
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Project Management <br />
            <span className="text-green-700">Made Simple</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Track projects, collaborate with teams, and manage expenses all in one place.
            GoProject helps you stay organized and productive.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 bg-green-700 text-white text-lg font-medium rounded-lg hover:bg-green-800 transition-colors"
          >
            Get Started Free
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Task Management</h3>
            <p className="text-gray-600">
              Create, assign, and track tasks with ease. Keep your team aligned and projects on schedule.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <Users className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Team Collaboration</h3>
            <p className="text-gray-600">
              Work together seamlessly with real-time updates and shared workspaces.
            </p>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
              <BarChart className="text-green-700" size={24} />
            </div>
            <h3 className="text-xl font-bold mb-2">Progress Tracking</h3>
            <p className="text-gray-600">
              Visualize project progress with intuitive charts and reports.
            </p>
          </div>
        </div>

        {/* Stats Section
        <div className="mt-20 bg-white rounded-2xl shadow-xl p-12">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">1000+</div>
              <div className="text-gray-600">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">5000+</div>
              <div className="text-gray-600">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">50+</div>
              <div className="text-gray-600">Countries</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-700 mb-2">99%</div>
              <div className="text-gray-600">Customer Satisfaction</div>
            </div>
          </div>
        </div> */}

        {/* CTA Section */}
        <div className="mt-20 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of teams using GoProject to manage their projects
          </p>
          <button
            onClick={() => navigate('/register')}
            className="inline-flex items-center px-8 py-4 bg-green-700 text-white text-lg font-medium rounded-lg hover:bg-green-800 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="ml-2" size={20} />
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 GoProject. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;