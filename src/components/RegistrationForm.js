// Register.js

import React, { useState } from 'react';

const Register = () => {
  const [formData, setFormData] = useState({
    applicationNumber: '',
    password: '',
    phoneNumber: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you can implement your form submission logic
    console.log(formData); // For example, you can log the form data
    // Reset the form after submission
    setFormData({
      applicationNumber: '',
      password: '',
      phoneNumber: ''
    });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="applicationNumber">Application Number:</label>
          <input
            type="text"
            id="applicationNumber"
            name="applicationNumber"
            value={formData.applicationNumber}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
        </div>
        <div>
          <label htmlFor="phoneNumber">Phone Number:</label>
          <input
            type="text"
            id="phoneNumber"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
