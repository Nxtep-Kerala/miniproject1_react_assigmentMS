import React, { useState } from 'react';
import { registerUser } from '../AuthService';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [profilePic, setProfilePic] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await registerUser(email, password, name, department, year, profilePic);
    if (response.success) {
      alert('Registration successful!');
    } else {
      alert(`Registration failed: ${response.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Register</h1>
      <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" required />
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required />
      <input type="text" value={department} onChange={(e) => setDepartment(e.target.value)} placeholder="Department" required />
      <input type="number" value={year} onChange={(e) => setYear(e.target.value)} placeholder="Year" required />
      <input type="text" value={profilePic} onChange={(e) => setProfilePic(e.target.value)} placeholder="Profile Picture URL" />
      <button type="submit">Register</button>
    </form>
  );
};

export default Register;
