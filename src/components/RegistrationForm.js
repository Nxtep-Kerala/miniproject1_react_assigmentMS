import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { dataRef } from "../firebase-config";
import { Home } from "@mui/icons-material";
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
      <div className={styles.leftPanel}>
  <h1 className={styles.Header1}>
    <span>WORK</span> <br />
    <span>TRACKING</span> <br />
    <span>MADE</span> <br />
    <span>EASY</span><br />
    <span className={styles.light}>No more dues</span>
  </h1>
</div>
      <div className={styles.rightPanel}>
        <div className={styles.ripcone1}>
        <div className={styles.homeButtonContainer}>
          <Link to="/" className={styles.homeButton}>
            <Home />
          </Link>
        </div>
        <h1 className={styles.registerHeading}>Register</h1>
        {error && <div className={`${styles.errorMessage} ${styles.alert}`}>{error}</div>}
        <form className={styles.formreg} onSubmit={handleSubmit}>
            <input
              placeholder="Application Number"
              type="text"
              value={formData.applicationNumber}
              readOnly
              className={styles.inputContainer}
            />
            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className={styles.inputContainer}
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              required
              onChange={handleChange}
              className={styles.inputContainer}
            />
            <select
              name="department"
              value={formData.department}
              required
              onChange={handleChange}
              className={styles.inputContainer}
            >
              <option value="" disabled hidden>
                Select Department
              </option>
              <option value="CSE">Computer Science and Engineering</option>
              <option value="BT">Biotechnology</option>
              <option value="EC">Electronics and Communication</option>
            </select>
          <button type="submit" className={styles.registerButton}>
            Register
          </button>
        </form>
      </div>
      </div>
    </div>
  );
};

export default Register;
