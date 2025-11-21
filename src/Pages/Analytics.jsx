// import React from 'react';
// import {
//   BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend, ResponsiveContainer
// } from 'recharts';

// const Analytics = () => {
//   // Mock Data
//   const projects = [
//     { name: 'E-Commerce Platform', status: 'In Progress', completion: 55 },
//     { name: 'Marketing Website', status: 'Completed', completion: 100 },
//     { name: 'Mobile App', status: 'In Progress', completion: 60 },
//     { name: 'Inventory System', status: 'In Progress', completion: 50 },
//     { name: 'Blog CMS', status: 'Completed', completion: 100 },
//   ];

//   const teamMembers = [
//     { name: 'Alice', avgCompletion: 65 },
//     { name: 'Bob', avgCompletion: 60 },
//     { name: 'Charlie', avgCompletion: 57 },
//     { name: 'David', avgCompletion: 100 },
//     { name: 'Eve', avgCompletion: 50 },
//   ];

//   const projectStatusDistribution = [
//     { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
//     { name: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length },
//     { name: 'Pending', value: projects.filter(p => p.status === 'Pending').length },
//   ];

//   const COLORS = ['#4ade80', '#facc15', '#cbd5e1'];

//   return (
//     <div className="p-8 bg-gray-100 min-h-screen">
//       <h2 className="text-3xl font-bold text-gray-800 mb-6">Team Analytics Dashboard</h2>

//       {/* Project Progress Bar Chart */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h3 className="text-xl font-semibold mb-4">Project Completion (%)</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={projects}>
//             <XAxis dataKey="name" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="completion" fill="#22c55e" />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Project Status Pie Chart */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h3 className="text-xl font-semibold mb-4">Project Status Distribution</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <PieChart>
//             <Pie
//               data={projectStatusDistribution}
//               dataKey="value"
//               nameKey="name"
//               cx="50%"
//               cy="50%"
//               outerRadius={80}
//               label
//             >
//               {projectStatusDistribution.map((entry, index) => (
//                 <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
//               ))}
//             </Pie>
//             <Tooltip />
//             <Legend />
//           </PieChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Team Member Line Chart */}
//       <div className="bg-white p-6 rounded-xl shadow mb-8">
//         <h3 className="text-xl font-semibold mb-4">Team Member Average Completion (%)</h3>
//         <ResponsiveContainer width="100%" height={250}>
//           <LineChart data={teamMembers}>
//             <XAxis dataKey="name" />
//             <YAxis domain={[0, 100]} />
//             <Tooltip />
//             <Legend />
//             <Line type="monotone" dataKey="avgCompletion" stroke="#16a34a" strokeWidth={3} />
//           </LineChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Detailed Project Table */}
//       <div className="bg-white p-6 rounded-xl shadow">
//         <h3 className="text-xl font-semibold mb-4">Project Details</h3>
//         <table className="w-full table-auto border-collapse border border-gray-200">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="border p-2 text-left">Project</th>
//               <th className="border p-2 text-left">Status</th>
//               <th className="border p-2 text-left">Completion</th>
//               <th className="border p-2 text-left">Members</th>
//             </tr>
//           </thead>
//           <tbody>
//             {projects.map((p, i) => (
//               <tr key={i} className="hover:bg-gray-50">
//                 <td className="border p-2">{p.name}</td>
//                 <td className="border p-2">{p.status}</td>
//                 <td className="border p-2">{p.completion}%</td>
//                 <td className="border p-2">{p.status === 'Completed' ? 'All assigned members' : 'Team in progress'}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default Analytics;

import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, LineChart, Line, Legend, ResponsiveContainer
} from 'recharts';

const Analytics = ({ projects = [] }) => {
  // Prepare data for charts
  const projectData = projects.map(p => ({
    name: p.name,
    status: p.status,
    completion: p.subtasks && p.subtasks.length > 0
      ? Math.round((p.subtasks.filter(st => st.files?.length > 0).length / p.subtasks.length) * 100)
      : 0,
  }));

  // Compute team member average completion
  const teamMembers = [];
  projects.forEach(p => {
    p.members.forEach(m => {
      const existing = teamMembers.find(t => t.name === m);
      const memberSubtasks = p.subtasks.filter(st => st.members.includes(m));
      const completed = memberSubtasks.filter(st => st.files?.length > 0).length;
      const completion = memberSubtasks.length ? (completed / memberSubtasks.length) * 100 : 0;
      if (existing) {
        existing.avgCompletion = Math.round((existing.avgCompletion + completion) / 2);
      } else {
        teamMembers.push({ name: m, avgCompletion: Math.round(completion) });
      }
    });
  });

  const projectStatusDistribution = [
    { name: 'Completed', value: projects.filter(p => p.status === 'Completed').length },
    { name: 'In Progress', value: projects.filter(p => p.status === 'In Progress').length },
    { name: 'Pending', value: projects.filter(p => p.status === 'Pending').length },
  ];

  const COLORS = ['#4ade80', '#facc15', '#cbd5e1'];

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Team Analytics Dashboard</h2>

      {/* Project Progress Bar Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Project Completion (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={projectData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="completion" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Project Status Pie Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Project Status Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={projectStatusDistribution}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label
            >
              {projectStatusDistribution.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Team Member Line Chart */}
      <div className="bg-white p-6 rounded-xl shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Team Member Average Completion (%)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={teamMembers}>
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="avgCompletion" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Detailed Project Table */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h3 className="text-xl font-semibold mb-4">Project Details</h3>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2 text-left">Project</th>
              <th className="border p-2 text-left">Status</th>
              <th className="border p-2 text-left">Completion</th>
              <th className="border p-2 text-left">Team Members</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((p, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="border p-2">{p.name}</td>
                <td className="border p-2">{p.status}</td>
                <td className="border p-2">
                  {p.subtasks && p.subtasks.length > 0
                    ? `${Math.round((p.subtasks.filter(st => st.files?.length > 0).length / p.subtasks.length) * 100)}%`
                    : '0%'}
                </td>
                <td className="border p-2">{p.members.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Analytics;