import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Typography, Alert, Box, Stack } from "@mui/material";
import { dataRef } from "../firebase-config";

const LoginForm = ({ setUserRole }) => { 
  const [applicationNumber, setApplicationNumber] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null); 

    const registrationsRef = dataRef.ref("registrations").child(applicationNumber);

    try {
      const snapshot = await registrationsRef.once("value");
      const userData = snapshot.val();

      if (userData) {
        if (userData.password === password) {
          setUserRole(userData.role); 
          navigate(`/assignments/${userData.department}`);
        } else {
          setError("Incorrect password. Please try again.");
        }
      } else {
        setError("Application number not found.");
      }
    } catch (err) {
      setError("An error occurred while trying to log in. Please try again later.");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Login
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Application Number"
            value={applicationNumber}
            onChange={(e) => setApplicationNumber(e.target.value)}
            required
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
