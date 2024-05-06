import React, { useState, useEffect } from "react";
import { dataRef } from "../firebase-config";

const Register = () => {
  const [formData, setFormData] = useState({
    applicationNumber: "",
    password: "",
    phoneNumber: "",
    department: "",
  });

  useEffect(() => {
    const registrationsRef = dataRef.ref("registrations");
    registrationsRef.once("value", (snapshot) => {
      const count = snapshot.numChildren();
      const formattedCount = String(count + 1).padStart(3, "0");
      const applicationNumber = `2024${formattedCount}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        applicationNumber: applicationNumber,
      }));
    });
  }, [formData.applicationNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const registrationsRef = dataRef
      .ref("registrations")
      .child(formData.applicationNumber);
    registrationsRef.set(formData);
    setFormData({
      applicationNumber: "",
      password: "",
      phoneNumber: "",
      department: "",
    });
    alert("Form submitted successfully");
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
            readOnly
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
            required
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
            required
          />
        </div>
        <div>
          <label htmlFor="department">Department:</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="BT">Biotechnology</option>
            <option value="EC">Electronics and Communication</option>
          </select>
        </div>
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
