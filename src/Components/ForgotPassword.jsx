import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleReset = () => {
    if (email) {
      setSent(true);
      setTimeout(() => {
        setSent(false);
        setEmail('');
      }, 3000);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-8 w-96">
        <div className="flex items-center justify-center mb-8">
          <div className="w-20 h-20 rounded-full flex items-center justify-center">
            <img src="/Images/TemporaryLogo-removebg.png" alt="Logo" className="w-21 h-21" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-2">Reset Password</h1>
        <p className="text-sm text-gray-600 text-center mb-6">
          Enter your email to receive reset instructions
        </p>
        
        {sent ? (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-lg mb-4">
            Reset link sent to your email!
          </div>
        ) : (
          <>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Enter your email"
              />
            </div>
            
            <button
              onClick={handleReset}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors font-medium"
            >
              Send Reset Link
            </button>
          </>
        )}
        
        <p className="text-center text-sm text-gray-600 mt-4">
          <Link to="/login" className="text-green-700 hover:underline">Back to Login</Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;