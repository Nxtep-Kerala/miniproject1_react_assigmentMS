import React, { useEffect, useState } from "react";
import { dataRef } from "../firebase-config";

const Assignments = ({ department }) => {
  const [assignments, setAssignments] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

    fetchAssignments();
    fetchTimetable();
    setLoading(false);
  }, [department]);

  if (loading) {
    return <p>Loading data...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div>
      <h1>Assignments for {department}</h1>
      {assignments.length > 0 ? (
        <ul>
          {assignments.map((assignment, index) => (
            <li key={index}>
              {assignment.title} - Due: {assignment.dueDate}
            </li>
          ))}
        </ul>
      ) : (
        <p>No assignments available.</p>
      )}
      <h2>Timetable</h2>
      {timetable.length > 0 ? (
        <ul>
          {timetable.map((subject, index) => (
            <li key={index}>
              {subject.day}: {subject.subject}
            </li>
          ))}
        </ul>
      ) : (
        <p>No timetable available.</p>
      )}
    </div>
  );
};

export default Assignments;
