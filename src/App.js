import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import RegistrationForm from "./components/RegistrationForm";
import Assignments from "./components/Assignments";
import AdminAssignments from "./components/AdminAssignments.js";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/assignments/:department" element={<Assignments />} />
        <Route path="/create-assignment" element={<AdminAssignments />} />
        <Route path="/" element={<h1>Welcome to the Assignment Reminder App</h1>} />
        <Route path="*" element={<h1>404 Not Found</h1>} />
      </Routes>
    </Router>
  );
}

export default App;
