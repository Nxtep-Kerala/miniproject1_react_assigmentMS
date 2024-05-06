import React, { useState, useEffect } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Stack,
  Alert,
  Select,
  MenuItem,
  List,
  ListItem,
  ListItemText,
  IconButton,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { dataRef } from "../firebase-config"; // Firebase Realtime Database reference

const AdminAssignments = () => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const [assignment, setAssignment] = useState({
    department: "",
    title: "",
    dueDate: "",
    format: "online",
  });

  const [assignments, setAssignments] = useState([]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error state

    try {
      // Validate admin credentials against Firebase Realtime Database
      const adminRef = dataRef.ref("admin").child(username); // Assuming admin data is stored in a path like this
      const snapshot = await adminRef.once("value");
      const adminData = snapshot.val();

      if (adminData && adminData.password === password) {
        setAdminAuthenticated(true); // Login successful
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while trying to log in. Please try again later.");
    }
  };

  const fetchAssignments = async (department) => {
    try {
      const assignmentsRef = dataRef.ref(`assignments/${department}`);
      const snapshot = await assignmentsRef.once("value");
      const data = snapshot.val();
      setAssignments(data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []);
    } catch (err) {
      setError("Failed to fetch assignments.");
    }
  };

  useEffect(() => {
    if (adminAuthenticated && assignment.department) {
      fetchAssignments(assignment.department);
    }
  }, [adminAuthenticated, assignment.department]);

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignment({
      ...assignment,
      [name]: value,
    });
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    const currentDate = new Date();
    const selectedDate = new Date(assignment.dueDate);

    if (selectedDate < currentDate) {
      setError("Due date cannot be in the past.");
      return;
    }

    try {
      const assignmentsRef = dataRef.ref(`assignments/${assignment.department}`).push();
      await assignmentsRef.set({
        title: assignment.title,
        dueDate: assignment.dueDate,
        format: assignment.format,
      });

      setAssignment({
        department: "",
        title: "",
        dueDate: "",
        format: "online",
      });

      fetchAssignments(assignment.department); // Refresh assignments after submission
    } catch (err) {
      setError("Failed to create assignment.");
    }
  };

  const handleDeleteAssignment = async (assignmentId, department) => {
    try {
      await dataRef.ref(`assignments/${department}/${assignmentId}`).remove();
      fetchAssignments(department); // Refresh the list after deletion
    } catch (err) {
      setError("Failed to delete assignment.");
    }
  };

  if (!adminAuthenticated) {
    return (
      <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
        <Typography variant="h4" component="h2" gutterBottom>
          Admin Login
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleLogin}>
          <Stack spacing={3}>
            <TextField
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" variant="contained" color="primary">
              Login
            </Button>
          </Stack>
        </form>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 4 }}>
      <Typography variant="h4" component="h2" gutterBottom>
        Create Assignment
      </Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <form onSubmit={handleAssignmentSubmit}>
        <Stack spacing={3}>
          <Select
            name="department"
            value={assignment.department}
            onChange={handleAssignmentChange}
            required
            displayEmpty
          >
            <MenuItem value="" disabled>
              Select Department
            </MenuItem>
            <MenuItem value="CSE">Computer Science and Engineering</MenuItem>
            <MenuItem value="BT">Biotechnology</MenuItem>
            <MenuItem value="EC">Electronics and Communication</MenuItem>
          </Select>
          <TextField
            label="Assignment Title"
            name="title"
            value={assignment.title}
            required
            onChange={handleAssignmentChange}
          />
          <TextField
            label="Due Date"
            type="date"
            name="dueDate"
            value={assignment.dueDate}
            required
            onChange={handleAssignmentChange}
          />
          <Select
            name="format"
            value={assignment.format}
            required
            onChange={handleAssignmentChange}
          >
            <MenuItem value="online">Online</MenuItem>
            <MenuItem value="offline">Offline</MenuItem>
          </Select>
          <Button type="submit" variant="contained" color="primary">
            Create Assignment
          </Button>
        </Stack>
      </form>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5">Assignments</Typography>
        {assignments.length > 0 ? (
          <List>
            {assignments.map((assignment) => (
              <ListItem key={assignment.id}>
                <ListItemText primary={`${assignment.title} - Due: ${assignment.dueDate}`} />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="end"
                    color="secondary"
                    onClick={() => handleDeleteAssignment(assignment.id, assignment.department)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography>No assignments available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default AdminAssignments;
