import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dataRef } from "../firebase-config";
import {
  Box,
  CircularProgress,
  Alert,
  Button,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Modal,
  Backdrop,
  Fade
} from "@mui/material";

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

const Assignments = ({ route }) => {
  const { department, username } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openModal, setOpenModal] = useState(false); // State for modal visibility

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

  const handleCourseDetailsOpen = () => {
    setOpenModal(true);
  };

  const handleCourseDetailsClose = () => {
    setOpenModal(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  // Course details based on department
  let courseDetails = "";
  switch (department) {
    case "CSE":
      courseDetails = "Computer Science and Engineering course details here...";
      break;
    case "BT":
      courseDetails = "Biotechnology course details here...";
      break;
    case "EC":
      courseDetails = "ELECTRONICS AND COMMUNICATION ENGINEERING A degree in Electronics and Communication Engineering enables you with a clear understanding of analog transmission, basic electronics, microprocessors, solid-state devices, digital analog communication, satellite communication, Integrated circuits, antennae and wave progression, and microwave engineering. Basic Electronics Solid State Devices Analaog Electronics Digital Electronics Electromagnetic Theory Signals and Systems Control Systems Microprocessor and Microcontrollers Analog Communications Digital Communications Satellite Communications Power Electronics";
      break;
    default:
      courseDetails = "Course details not available.";
      break;
  }

  return (
    <Box className="assignments-container" sx={{ maxWidth: 960, margin: "auto", mt: 4 }}>
      <Typography variant="h3" className="username-title">
        {username}
      </Typography>
      <Button variant="contained" onClick={handleCourseDetailsOpen} sx={{ mr: 2 }}>
        Course Details
      </Button>
      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>

      {/* Modal for Course Details */}
      <Modal
        open={openModal}
        onClose={handleCourseDetailsClose}
        aria-labelledby="course-details-modal"
        aria-describedby="course-details-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openModal}>
          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "80%",
              maxWidth: 600,
              bgcolor: "white",
              boxShadow: 24,
              p: 4
            }}
          >
            <Typography variant="h4" gutterBottom>
              Course Details for {department}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              {courseDetails}
            </Typography>
            <Button variant="contained" onClick={handleCourseDetailsClose} sx={{ mt: 3 }}>
              Close
            </Button>
          </Paper>
        </Fade>
      </Modal>

      {/* Timetable Table */}
      <TableContainer component={Paper} sx={{ mt: 4 }}>
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
            {daysOfWeek.map((day) => (
              <TableRow key={day}>
                <TableCell component="th" scope="row">
                  {day}
                </TableCell>
                {(timetable[day] || Array(7).fill({ subject: "" })).map((period, index) => (
                  <TableCell key={index}>{period.subject}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Assignments Cards */}
      <Box sx={{ mt: 4 }}>
        {assignments.length > 0 ? (
          assignments.map((assignment, index) => (
            <Card key={index} className="assignment-card" sx={{ borderRadius: 8, my: 2 }}>
              <CardContent>
                <Typography variant="h5" className="assignment-title">
                  {assignment.title}
                </Typography>
                <Typography variant="body2" className="assignment-details">
                  by: {assignment.createdBy}
                </Typography>
                <Typography className="assignment-due">Due: {formatDate(assignment.dueDate)}</Typography>
                <Typography variant="body2" className="assignment-details">
                  {assignment.description}
                </Typography>
                <Typography variant="caption" className="assignment-details">
                  {assignment.format.toUpperCase()}
                </Typography>
                <LinearProgress variant="determinate" value={getProgressValue(assignment.dueDate)} sx={{ mt: 1 }} />
              </CardContent>
            </Card>
          ))
        ) : (
          <Typography variant="body1">No assignments available.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default Assignments;
