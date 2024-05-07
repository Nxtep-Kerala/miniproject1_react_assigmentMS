import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dataRef } from "../firebase-config";
import {
  Box, CircularProgress, Alert, Button, Card, CardContent, Typography, LinearProgress,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper
} from '@mui/material';

import "./Assignments.css"; 

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const getProgressValue = (dueDate) => {
  const now = new Date();
  const due = new Date(dueDate);
  const total = due - now;
  if (total <= 0) {
    return 100; 
  }
  const passed = new Date() - now;
  return Math.max(0, (passed / total) * 100);
};

const Assignments = () => {
  const { department } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentsRef = dataRef.ref(`assignments/${department}`);
        const snapshot = await assignmentsRef.once("value");
        const data = snapshot.val() || {};
        const sortedAssignments = Object.values(data).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
        setAssignments(sortedAssignments);
      } catch (err) {
        setError("Failed to load assignments.");
      }
    };

    const fetchTimetable = async () => {
      try {
        const timetableRef = dataRef.ref(`timetables/${department}`);
        const snapshot = await timetableRef.once("value");
        const data = snapshot.val() || {};
        setTimetable(data);
      } catch (err) {
        setError("Failed to load timetable.");
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await fetchAssignments();
      await fetchTimetable();
      setLoading(false);
    };

    fetchData();
  }, [department]);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box className="assignments-container" sx={{ maxWidth: 960, margin: 'auto', mt: 4 }}>
      <Button variant="contained" color="primary" onClick={handleLogout}>
        Logout
      </Button>
      <div className="container">
      <div className="rectangle-4"></div>
      <div className="heading">
        <Typography variant="h4" gutterBottom>
          Timetable for {department}
        </Typography>
      </div>
    </div>
      <TableContainer component={Paper}>
        <Table aria-label="simple timetable">
          <TableHead>
            <TableRow>
              <TableCell>Day / Period</TableCell>
              {Array.from({ length: 7 }, (_, i) => (
                <TableCell key={i}>Period {i + 1}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {daysOfWeek.map(day => (
              <TableRow key={day}>
                <TableCell component="th" scope="row">{day}</TableCell>
                {(timetable[day] || Array(7).fill({ subject: '' })).map((period, index) => (
                  <TableCell key={index}>{period.subject}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <div className="container">
      <div className="rectangle-4"></div>
      <div className="heading">
        <Typography variant="h4" gutterBottom>
          Assignments for {department}
        </Typography>
      </div>
    </div>
      {assignments.length > 0 ? (
        assignments.map((assignment, index) => (
          <Card key={index} className="assignment-card" sx={{ borderRadius: 8, m: 1 }}>
            <CardContent>
              <Typography variant="h5" className="assignment-title">{assignment.title}</Typography>
              <Typography variant="body2" className="assignment-details">by: {assignment.createdBy}</Typography>
              <Typography className="assignment-due">Due: {formatDate(assignment.dueDate)}</Typography>
              <Typography variant="body2" className="assignment-details">{assignment.description}</Typography>
              <Typography variant="caption" className="assignment-details">{assignment.format.toUpperCase()}</Typography>
              <LinearProgress variant="determinate" value={getProgressValue(assignment.dueDate)} sx={{ mt: 1 }} />
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No assignments available.</Typography>
      )}
    </Box>
  );
};

export default Assignments;
