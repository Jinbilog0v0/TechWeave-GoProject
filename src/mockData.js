// Stats Data
export const statsData = [
  { label: 'Active Projects', value: '3', icon: '📊', description: 'Currently ongoing projects' },
  { label: 'Pending Tasks', value: '12', icon: '🔄', description: 'Tasks waiting to be completed' },
  { label: 'Total Expenses', value: '₱4,500.00', icon: '💰', description: 'Total project expenses' },
  { label: 'Team Members', value: '4', icon: '👥', description: 'Active team members' }
];

// Recent Projects
export const recentProjects = [
  { id: 1, name: 'Systems Integration and Architecture 1 GoProject', status: 'All Teams', progress: 70, description: 'Full system integration project for SIA', dueDate: '2025-12-15', teamSize: 5, priority: 'High', startDate: '2025-10-01', budget: 15000, category: 'Development' },
  { id: 2, name: 'Data Analytics Systematic Literature Review Docs', status: 'In Progress', progress: 40, description: 'Comprehensive literature review for data analytics system', dueDate: '2025-12-20', teamSize: 3, priority: 'Medium', startDate: '2025-10-15', budget: 1500, category: 'Research' },
  { id: 3, name: 'IT ELECTIVE 3 AccommoTrack', status: 'All done', progress: 90, description: 'Generic accommodation tracking system', dueDate: '2025-11-30', teamSize: 4, priority: 'High', startDate: '2025-09-01', budget: 50000, category: 'Academic' }
];

// Recent Activity
export const recentActivity = [
  { user: 'Neal Jean', action: 'completed task', project: 'UI Design', time: '2 hours ago', avatar: 'NJ', timestamp: '2025-11-10T10:00:00', taskName: 'Homepage mockup design' },
  { user: 'Neal Jean', action: 'updated design', project: 'Desktop View', time: '5 hours ago', avatar: 'NJ', timestamp: '2025-11-10T07:00:00', taskName: 'Responsive layout updates' },
  { user: 'John Paul', action: 'updated design', project: 'Phone View', time: '1 hours ago', avatar: 'JP', timestamp: '2025-11-10T11:00:00', taskName: 'Mobile navigation improvements' },
  { user: 'Rhadzmiel Sali', action: 'updated design', project: 'Desktop View', time: '6 hours ago', avatar: 'RS', timestamp: '2025-11-10T06:00:00', taskName: 'Color scheme adjustments' },
  { user: 'Neal Jean', action: 'updated design', project: 'Desktop View', time: '8 hours ago', avatar: 'NJ', timestamp: '2025-11-10T04:00:00', taskName: 'Typography refinements' },
  { user: 'Ar-Rauf', action: 'updated design', project: 'GoProject Logo', time: '10 hours ago', avatar: 'AR', timestamp: '2025-11-10T02:00:00', taskName: 'Logo variations created' }
];

// Upcoming Deadlines
export const upcomingDeadlines = [
  { id: 1, task: 'Complete UI Mockup (coded)', project: 'IT ELECTIVE 3 AccountsTrack', priority: 'Wednesday', dueDate: '2025-11-13', assignee: 'Neal Jean', status: 'In Progress', completionPercentage: 60 },
  { id: 2, task: 'GoProject Figma Design', project: 'Systems Integration and Architecture 1', priority: 'Wednesday', dueDate: '2025-11-13', assignee: 'John Paul', status: 'In Progress', completionPercentage: 45 },
  { id: 3, task: 'Phase 1 & Phase 2 Documentation', project: 'IT ELECTIVE 3 AccountsTrack', priority: 'Monday', dueDate: '2025-11-11', assignee: 'Rhadzmiel Sali', status: 'Pending', completionPercentage: 30 },
  { id: 4, task: 'Weekly Report Documentations', project: 'IT ELECTIVE 3 & 4A', priority: 'Monday', dueDate: '2025-11-11', assignee: 'Ar-Rauf', status: 'Pending', completionPercentage: 20 }
];

// Optional: Export all as a default object for convenience
const mockData = {
  statsData,
  recentProjects,
  recentActivity,
  upcomingDeadlines
};

export default mockData;