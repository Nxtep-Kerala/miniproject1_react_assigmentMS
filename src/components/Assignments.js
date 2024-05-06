import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dataRef } from "../firebase-config";
import { Box, Card, CardContent, Typography, List, ListItem, Divider, CircularProgress, Alert } from "@mui/material";

const Assignments = () => {
  const { department } = useParams();
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    return formattedDate;
  };

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const assignmentsRef = dataRef.ref(`assignments/${department}`);
        const snapshot = await assignmentsRef.once("value");
        const data = snapshot.val();
        setAssignments(data ? Object.values(data) : []);
      } catch (err) {
        setError("Failed to load assignments.");
      }
    };


    const fetchTimetable = async () => {
      try {
        const timetableRef = dataRef.ref(`timetables/${department}`);
        const snapshot = await timetableRef.once("value");
        const data = snapshot.val();
        setTimetable(data ? Object.values(data) : []);
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

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Assignments for {department}
      </Typography>
      {assignments.length > 0 ? (
        assignments.map((assignment, index) => (
          <Card key={index} sx={{ mb: 2 }}>
            <CardContent>
              <Typography variant="h5">{assignment.title}</Typography>
              <Typography color="textSecondary">Due: {formatDate(assignment.dueDate)}</Typography>
              <Typography variant="body2">{assignment.description}</Typography>
              <Typography variant="caption">{assignment.format.toUpperCase()}</Typography>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography>No assignments available.</Typography>
      )}
      <Typography variant="h5" sx={{ mt: 4 }}>
        Timetable
      </Typography>
      {timetable.length > 0 ? (
        <List>
          {timetable.map((subject, index) => (
            <ListItem key={index} divider>
              <Typography>
                {subject.day}: {subject.subject}
              </Typography>
            </ListItem>
          ))}
        </List>
      ) : (
        <Typography>No timetable available.</Typography>
      )}
    </Box>
  );
};

export default Assignments;
