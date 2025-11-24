import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login.jsx'
import Register from './pages/Register.jsx'
import About from './pages/About.jsx'
import Analytics from './pages/Analytics.jsx'
import Home from './pages/Home.jsx'
import PersonalWorkspace from './pages/PersonalWorkspace.jsx'
import CollaborativeWorkspace from './pages/CollaborativeWorkspace.jsx'
import Expenses from './pages/Expenses.jsx'
import NotFound from './pages/NotFound.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Layout from './pages/Layout.jsx'
import LandingPage from './pages/LandingPage.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import ProjectDetailPage from './pages/ProjectDetailPage.jsx'

function Logout() { 
  localStorage.clear();
  return <Navigate to ="/" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />

        {/* Protected Routes */}
        {/* We wrap Layout in ProtectedRoute. If authorized, Layout renders. 
            If Layout renders, it renders the <Outlet> which shows the child routes. */}
        <Route 
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/personalworkspace" element={<PersonalWorkspace />} />
          <Route path="/collaborativeworkspace" element={<CollaborativeWorkspace />} />
          <Route path="/expensetrack" element={<Expenses />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App