import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Assignments from "./components/Assignments";
import AdminAssignments from "./components/AdminAssignments.js";
import AdminDashboard from "./components/AdminDashboard.js";
import Home from "./components/Home.js";

function App() {
  // State to store user role after authentication
  const [userRole, setUserRole] = useState(null);

  // Define a function to check if the user is authenticated
  const isAuthenticated = () => {
    return userRole !== null;
  };

  

  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm setUserRole={setUserRole} />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route
          path="/assignments/:department/:username"
          element={isAuthenticated() ? <Assignments /> : <Navigate to="/login" />}
        />
        
        <Route
          path="/create-assignment"
          element= {<AdminAssignments />}
        />
        <Route path="/" element={<h1>Welcome to the Assignment Reminder App</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
        
        <Route
          path="/main"
          element={<AdminDashboard />}
        />
      </Routes>
    </Router>
  );
}

export default App;
