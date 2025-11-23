import { useState } from 'react'
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
import Settings from './pages/Settings.jsx'
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

        {/* <Route path="/" element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        } /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />


        <Route element={<Layout />}>

          <Route path="/about" element={
              <About />
          } />

          <Route path="/home" element={
              <Home /> } />

          <Route path="/analytics" element={
              <Analytics />
          } />

          <Route path="/personalworkspace" element={
              <PersonalWorkspace />
          } />

          <Route path="/collaborativeworkspace" element={
              <CollaborativeWorkspace />
          } />

          <Route path="/expensetrack" element={
              <Expenses />
          } />

          <Route path="/settings" element={ <Settings /> } />

          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path='/profile' element={<ProfilePage />}  />
        
        </Route>



      </Routes>

    </BrowserRouter>
  )
}

export default App
