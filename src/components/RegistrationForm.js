import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { dataRef } from "../firebase-config";
import styles from "./Register.module.css";

const Register = () => {
  const [formData, setFormData] = useState({
    applicationNumber: "",
    password: "",
    phoneNumber: "",
    department: "",
  });

  const [error, setError] = useState(null);
  const navigate = useNavigate(); // For navigation to other routes

  useEffect(() => {
    const registrationsRef = dataRef.ref("registrations");
    registrationsRef.once("value", (snapshot) => {
      const count = snapshot.numChildren();
      const formattedCount = String(count + 1).padStart(3, "0");
      const applicationNumber = `2024${formattedCount}`;
      setFormData((prevFormData) => ({
        ...prevFormData,
        applicationNumber,
      }));
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const registrationsRef = dataRef.ref("registrations").child(formData.applicationNumber);
      await registrationsRef.set(formData);

      // Navigate to the assignment listing based on department
      if (formData.department) {
        navigate(`/assignments/${formData.department}`);
      } else {
        throw new Error("Department information is missing");
      }
    } catch (err) {
      setError("Failed to submit form. Please try again.");
    }
  };

  return (
    <div className={styles.registerContainer}>
      <h4 className={styles.registerHeading}>Register</h4>
      {error && <div className={`${styles.errorMessage} ${styles.alert}`}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.inputContainer}>
          <input
            placeholder="Application Number"
            type="text"
            value={formData.applicationNumber}
            readOnly
            className={styles.registerInput}
          />
        </div>
        <div className={styles.inputContainer}>
          {/* <label>Phone Number</label> */}
          <input
            type="text"
            name="phoneNumber"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className={styles.registerInput}
          />
        </div>
        <div className={styles.inputContainer}>
          {/* <label>Password</label> */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            required
            onChange={handleChange}
            className={styles.registerInput}
          />
        </div>
        <div className={styles.inputContainer}>
          <select
            name="department"
            value={formData.department}
            required
            onChange={handleChange}
            className={styles.registerInput}
          >
            <option value="" disabled hidden>
      Select Department
    </option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="BT">Biotechnology</option>
            <option value="EC">Electronics and Communication</option>
          </select>
        </div>
        <button type="submit" className={styles.registerButton}>
          Register
        </button>
      </form>
    </div>
  );
};

export default Register;
