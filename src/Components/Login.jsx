// import React, { useState } from 'react';
// import { Link, useNavigate } from 'react-router-dom';

// const Login = ({ onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const navigate = useNavigate();

//   const handleLogin = () => {
//     if (username && password) {
//       onLogin(username);
//       navigate('/Home');
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       handleLogin();
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white rounded-lg shadow-lg p-8 w-96">
//         <div className="flex items-center justify-center mb-8">
//           <div className="w-20 h-20 rounded-full flex items-center justify-center">
//             <img src="./Images/TemporaryLogo-removebg.png" alt="Logo" className="w-21 h-21" />
//           </div>
//         </div>
//         <h1 className="text-2xl font-bold text-center mb-2">GoProject</h1>
//         <p className="text-sm text-gray-600 text-center mb-6">Project Management</p>
        
//         <div>
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               placeholder="Enter username"
//             />
//           </div>
          
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               onKeyPress={handleKeyPress}
//               className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
//               placeholder="Enter password"
//             />
//           </div>
          
//           <button
//             onClick={handleLogin}
//             className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors font-medium"
//           >
//             Log In
//           </button>
          
//           <div className="mt-4 text-center space-y-2">
//             <Link to="/forgot-password" className="block text-sm text-green-700 hover:underline">
//               Forgot Password?
//             </Link>
//             <p className="text-sm text-gray-600">
//               Don't have an account? <Link to="/register" className="text-green-700 hover:underline">Sign Up</Link>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Login;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = () => {
    if (!username || !password) {
      alert('Please enter both username and password');
      return;
    }

    // // Temporary login simulation
    // alert(`Logged in as ${username}`);
    
    // Navigate to Home
    navigate('/Home');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
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
        <h1 className="text-2xl font-bold text-center mb-2">GoProject</h1>
        <p className="text-sm text-gray-600 text-center mb-6">Project Management</p>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter username"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Enter password"
            />
          </div>
          
          <button
            onClick={handleLogin}
            className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-800 transition-colors font-medium"
          >
            Log In
          </button>
          
          <div className="mt-4 text-center space-y-2">
            <Link to="/forgot-password" className="block text-sm text-green-700 hover:underline">
              Forgot Password?
            </Link>
            <p className="text-sm text-gray-600">
              Don't have an account? <Link to="/register" className="text-green-700 hover:underline">Sign Up</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
