import React, { useState } from "react";
import { dataRef } from "../firebase-config";
//import { loginUser } from '../AuthService.jss';

const LoginForm = () => {
  const [applicationNumber, setApplicationNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    const registrationsRef = dataRef.ref("registrations").child(applicationNumber);

    registrationsRef.once("value", (snapshot) => {
      const userData = snapshot.val();
      if (userData) {
        if (userData.password === password) {
          alert("Login successful!");
        } else {
          alert("Incorrect password!");
        }
      } else {
        alert("Application number not found!");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      <input
        type="number"
        value={applicationNumber}
        onChange={(e) => setApplicationNumber(e.target.value)}
        placeholder="Application number"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
