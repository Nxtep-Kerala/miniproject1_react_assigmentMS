import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, TextField, Button, Typography, Stack, Alert } from "@mui/material";
import { dataRef } from "../firebase-config";

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
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Register
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            label="Application Number"
            value={formData.applicationNumber}
            readOnly
          />
          <TextField
            label="Phone Number"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            required
          />
          <TextField
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            required
            onChange={handleChange}
          />
          <TextField
            label="Department"
            select
            name="department"
            value={formData.department}
            required
            onChange={handleChange}
            SelectProps={{ native: true }}
          >
            <option value=""></option>
            <option value="CSE">Computer Science and Engineering</option>
            <option value="BT">Biotechnology</option>
            <option value="EC">Electronics and Communication</option>
          </TextField>
          <Button type="submit" variant="contained" color="primary">
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Register;
