import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { auth } from './firebase-config';
import { useAuthState } from 'react-firebase-hooks/auth';

// Update these imports to default imports
import LoginForm from './components/LoginForm'; // Updated to default import
import RegistrationForm from './components/RegistrationForm';
import StudentDashboard from './components/StudentDashboard';
import TeacherDashboard from './components/TeacherDashboard';
import Profile from './components/Profile';
import Navbar from './components/Navbar';

import arun from './components/arun';

function App() {
  const [user, loading, error] = useAuthState(auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginForm />} />
        <Route path="/register" element={user ? <Navigate to="/" /> : <RegistrationForm />} />
        <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
        <Route path="/dashboard" element={user ? (user.role === 'teacher' ? <TeacherDashboard userId={user.uid} /> : <StudentDashboard userId={user.uid} />) : <Navigate to="/login" />} />
        <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </Router>
  );
}

export default App;
