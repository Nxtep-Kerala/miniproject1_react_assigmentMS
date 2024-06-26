import React, { useState, useEffect } from "react";
import { dataRef } from "../firebase-config";
import { useNavigate, Link } from "react-router-dom";
import {
  Box, TextField, Button, Typography, Stack, Alert, Select, MenuItem, List, ListItem,
  ListItemText, IconButton, ListItemSecondaryAction,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import './AdminA.css';
import { Home } from "@mui/icons-material";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const AdminAssignments = () => {
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [assignment, setAssignment] = useState({
    department: "",
    title: "",
    description: "",
    dueDate: "",
    format: "online",
  });
  const [assignments, setAssignments] = useState([]);
  const [timetables, setTimetables] = useState(
    daysOfWeek.reduce((acc, day) => ({ ...acc, [day]: Array(7).fill({ subject: '' }) }), {})
  );
  const navigate = useNavigate();

  useEffect(() => {
    // Check if admin is authenticated on component mount
    const isAuthenticated = localStorage.getItem("adminAuthenticated") === "true";
    setAdminAuthenticated(isAuthenticated);
  }, []);

  useEffect(() => {
    if (adminAuthenticated && assignment.department) {
      fetchAssignments(assignment.department);
      fetchTimetable(assignment.department);
    }
  }, [adminAuthenticated, assignment.department]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const adminRef = dataRef.ref("admin").child(username);
      const snapshot = await adminRef.once("value");
      const adminData = snapshot.val();
      if (adminData && adminData.password === password) {
        setAdminAuthenticated(true);
        setAssignment(prev => ({
          ...prev,
          department: adminData.department || ""
        }));
        if (adminData.department) {
          fetchAssignments(adminData.department);
          fetchTimetable(adminData.department);
        }
      } else {
        setError("Invalid admin credentials. Please try again.");
      }
    } catch (err) {
      setError("An error occurred while trying to log in. Please try again later.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuthenticated"); // Remove authentication flag
    setAdminAuthenticated(false);
    navigate("/create-assignment"); // Navigate to login page after logout
  };

  const fetchTimetable = async (department) => {
    try {
      const timetableRef = dataRef.ref(`timetables/${department}`);
      const snapshot = await timetableRef.once("value");
      const data = snapshot.val() || {};
      setTimetables(daysOfWeek.reduce((acc, day) => ({
        ...acc,
        [day]: data[day] ? data[day].map(period => ({ subject: period.subject || '' })) : Array(7).fill({ subject: '' })
      }), {}));
    } catch (err) {
      setError("Failed to fetch timetable.");
    }
  };

  const handleTimetableChange = (value, day, periodIndex) => {
    setTimetables(prev => ({
      ...prev,
      [day]: prev[day].map((item, index) => index === periodIndex ? { ...item, subject: value } : item)
    }));
  };

  const saveTimetable = async () => {
    setError(null);
    try {
      await dataRef.ref(`timetables/${assignment.department}`).set(timetables);
      fetchTimetable(assignment.department);
    } catch (err) {
      setError("Failed to save timetable.");
    }
  };

  const fetchAssignments = async (department) => {
    try {
      const assignmentsRef = dataRef.ref(`assignments/${department}`);
      const snapshot = await assignmentsRef.once("value");
      const data = snapshot.val();
      setAssignments(data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : []);
    } catch (err) {
      setError("Failed to fetch assignments.");
    }
  };

  const handleAssignmentSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const currentDate = new Date();
    const selectedDate = new Date(assignment.dueDate);
    if (selectedDate < currentDate) {
      setError("Due date cannot be in the past.");
      return;
    }
    try {
      const adminUsername = username;

    // Create the assignment data object with additional createdBy field
    const assignmentData = {
      ...assignment,
      createdBy: adminUsername, // Store the admin's username with the assignment
    };
      const assignmentsRef = dataRef.ref(`assignments/${assignment.department}`).push();
      await assignmentsRef.set(assignment);
      await assignmentsRef.set(assignmentData);
      fetchAssignments(assignment.department);
      setAssignment({
        department: assignment.department,
        title: "",
        description: "",
        dueDate: "",
        format: "online",
      });
    } catch (err) {
      setError("Failed to create assignment.");
    }
  };

  const handleAssignmentChange = (e) => {
    const { name, value } = e.target;
    setAssignment(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  const handleDeleteAssignment = async (assignmentId, department) => {
    try {
      await dataRef.ref(`assignments/${department}/${assignmentId}`).remove();
      fetchAssignments(department);
    } catch (err) {
      setError("Failed to delete assignment.");
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      {adminAuthenticated ? (
        <>
          {/* Logout Button */}
          <Button variant="contained" color="primary" onClick={handleLogout} sx={{ mb: 2 }}>
            Logout
          </Button>
          {/* Manage Assignments and Timetable */}
          <Typography variant="h4" gutterBottom>
            Manage Assignments and Timetable
          </Typography>
          {error && <Alert severity="error">{error}</Alert>}
          {/* Timetable Management */}
          <Typography variant="h5" gutterBottom>Timetable Management</Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple timetable">
              <TableHead>
                <TableRow>
                  <TableCell>Day</TableCell>
                  {Array.from({ length: 7 }, (_, i) => <TableCell key={i}>Period {i + 1}</TableCell>)}
                </TableRow>
              </TableHead>
              <TableBody>
                {daysOfWeek.map(day => (
                  <TableRow key={day}>
                    <TableCell>{day}</TableCell>
                    {timetables[day].map((period, index) => (
                      <TableCell key={index}>
                        <TextField
                          fullWidth
                          size="small"
                          variant="outlined"
                          value={period.subject}
                          onChange={(e) => handleTimetableChange(e.target.value, day, index)}
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Button variant="contained" color="primary" sx={{ mt: 2, mb: 2 }} onClick={saveTimetable}>
            Save Timetable
          </Button>
          {/* Assignment creation and list */}
          <Typography variant="h4" gutterBottom>
            Create Assignment
          </Typography>
          <form onSubmit={handleAssignmentSubmit}>
            <Stack spacing={3}>
              <Select name="department" disabled required value={assignment.department} onChange={handleAssignmentChange} displayEmpty>
                <MenuItem value="" disabled>Select Department</MenuItem>
                <MenuItem value="CSE">Computer Science and Engineering</MenuItem>
                <MenuItem value="BT">Biotechnology</MenuItem>
                <MenuItem value="EC">Electronics and Communication</MenuItem>
              </Select>
              <TextField label="Assignment Title" required name="title" value={assignment.title} onChange={handleAssignmentChange} />
              <TextField label="Description" name="description" required value={assignment.description} onChange={handleAssignmentChange} />
              <TextField type="date" required name="dueDate" value={assignment.dueDate} onChange={handleAssignmentChange} />
              <Select name="format" required value={assignment.format} onChange={handleAssignmentChange}>
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
                    <ListItemText primary={`${assignment.title} - Due: ${formatDate(assignment.dueDate)}`} />
                    <ListItemSecondaryAction>
                      <IconButton edge="end" color="secondary" onClick={() => handleDeleteAssignment(assignment.id, assignment.department)}>
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
        </>
      ) : (
        <div className="loginContainer11">
        <div className="leftPanel11">
          <h1 className="Header111">
            <span>WORK</span> <span>TRACKING</span> <span>MADE</span> <span>EASY</span><span className="light11">No more dues</span>
          </h1>
        </div>
        <div className="rightPanel11">
          <div className="ripcone11">
          <div className="homeButtonContainer11">
            <Link to="/" className="homeButton">
              <Home />
            </Link>
          </div>
          <h1 > Teacher Login</h1>
          {error && <div className="errorMessage">{error}</div>}
          <form onSubmit={handleLogin}>
          <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="inputContainer11"
                required
              />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="inputContainer11"
                required
              />
            <button type="submit" className="loginButton11">
              Login
            </button>
          </form>
        </div>
        </div>
      </div>
      )}
    </Box>
  );
};

export default AdminAssignments;
