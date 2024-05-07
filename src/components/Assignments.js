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
  const [userProfile, setUserProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [openCourseModal, setOpenCourseModal] = useState(false);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRef = dataRef.ref(`registrations`).orderByChild('username').equalTo(username);
        const snapshotUser = await userRef.once("value");
        if (snapshotUser.exists()) {
          const userDetail = snapshotUser.val();
          const userKey = Object.keys(userDetail)[0];
          setUserProfile(userDetail[userKey]);
        } else {
          setError("User not found.");
        }

        const assignmentsRef = dataRef.ref(`assignments/${department}`);
        const snapshotAssignments = await assignmentsRef.once("value");
        setAssignments(Object.values(snapshotAssignments.val() || {}).sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));

        const timetableRef = dataRef.ref(`timetables/${department}`);
        const snapshotTimetable = await timetableRef.once("value");
        setTimetable(snapshotTimetable.val() || {});

      } catch (err) {
        setError("Failed to load data.");
      }
      setLoading(false);
    };

    fetchData();
  }, [department, username]);

  const handleLogout = () => {
    window.location.href = "/login";
  };

  const handleProfileOpen = () => {
    setOpenProfileModal(true);
  };

  const handleProfileClose = () => {
    setOpenProfileModal(false);
  };

  const handleCourseDetailsOpen = () => {
    setOpenCourseModal(true);
  };

  const handleCourseDetailsClose = () => {
    setOpenCourseModal(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  let courseDetails = "";
  switch (department) {
    case "CSE":
      courseDetails = "Computer Engineering students learn how to develop, prototype, and test microchips, circuits, processors, conductors and any other component used in computer devices or systems (e.g. supercomputers, smartphones, laptops, servers, loT gadgets). They also develop firmware, an essential type of software that allows operating systems and applications to take full advantage of the hardware. In addition to general Computer Engineering degrees, universities and colleges also offer different specialisations or subdisciplines if you want to narrow down your focus. Here are a few examples: Hardware Systems, Distributed Computing, Robotics and Cybernetics, Embedded Systems, Computer Graphics and Visualization, Medical Image Computing, Computer and Network Security.";
      break;
    case "BT":
      courseDetails = "Biotechnology course details here...";
      break;
    case "EC":
      courseDetails = "ELECTRONICS AND COMMUNICATION ENGINEERING A degree in Electronics and Communication Engineering enables you with a clear understanding of analog transmission, basic electronics, microprocessors, solid-state devices, digital analog communication, satellite communication, Integrated circuits, antennae and wave progression, and microwave engineering. Basic Electronics, Solid State Devices, Analog Electronics, Digital Electronics, Electromagnetic Theory, Signals and Systems, Control Systems, Microprocessor and Microcontrollers, Analog Communications, Digital Communications, Satellite Communications, Power Electronics.";
      break;
    default:
      courseDetails = "Course details not available.";
      break;
  }

  return (
    <Box className="assignments-container" sx={{ maxWidth: 960, margin: "auto", mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
    <Typography variant="h3" className="username-title">
      {username}
    </Typography>
    <Button variant="contained" onClick={handleProfileOpen} sx={{ mr: 2 }}>
      Profile
    </Button>
    <Button variant="contained" onClick={handleCourseDetailsOpen} sx={{ mr: 2 }}>
      Course Details
    </Button>
    <Button variant="contained" onClick={handleLogout}>
      Logout
    </Button>
  </Box>

      <Modal
        open={openProfileModal}
        onClose={handleProfileClose}
        aria-labelledby="profile-details-modal"
        aria-describedby="profile-details-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openProfileModal}>
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
              Profile Details
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Username: {userProfile.username || "Not Available"}
            </Typography>
            <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Phone Number: {userProfile.phoneNumber || "Not Available"}
              </Typography>

              <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
              Department: {userProfile.department || "Not Available"}
            </Typography>
            <Button variant="contained" onClick={handleProfileClose} sx={{ mt: 3 }}>
              Close
            </Button>
          </Paper>
        </Fade>
      </Modal>

      <Modal
        open={openCourseModal}
        onClose={handleCourseDetailsClose}
        aria-labelledby="course-details-modal"
        aria-describedby="course-details-modal-description"
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500
        }}
      >
        <Fade in={openCourseModal}>
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

