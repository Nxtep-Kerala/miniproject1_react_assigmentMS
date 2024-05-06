import React, { useState, useEffect } from 'react';
import { firestore } from '../firebase-config';

function TeacherDashboard({ userId }) {
    const [assignments, setAssignments] = useState([]);
    const [newAssignment, setNewAssignment] = useState({ title: '', description: '', deadline: '' });

    const handleCreateAssignment = async () => {
        await firestore.collection('assignments').add({
            ...newAssignment,
            createdBy: userId
        });
        setNewAssignment({ title: '', description: '', deadline: '' });
        fetchAssignments();
    };

    useEffect(() => {
        fetchAssignments();
    }, [userId]);

    const fetchAssignments = async () => {
        const assignmentsSnapshot = await firestore.collection('assignments')
            .where('createdBy', '==', userId).get();
        setAssignments(assignmentsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    return (
        <div>
            <h2>Teacher Dashboard</h2>
            <h3>Create Assignment</h3>
            <input type="text" value={newAssignment.title} onChange={(e) => setNewAssignment(prev => ({ ...prev, title: e.target.value }))} placeholder="Title" />
            <input type="text" value={newAssignment.description} onChange={(e) => setNewAssignment(prev => ({ ...prev, description: e.target.value }))} placeholder="Description" />
            <input type="date" value={newAssignment.deadline} onChange={(e) => setNewAssignment(prev => ({ ...prev, deadline: e.target.value }))} placeholder="Deadline" />
            <button onClick={handleCreateAssignment}>Create</button>

            <h3>Manage Assignments</h3>
            {assignments.map(assignment => (
                <div key={assignment.id}>
                    <h4>{assignment.title}</h4>
                    <p>{assignment.description}</p>
                    <p>Deadline: {assignment.deadline}</p>
                </div>
            ))}
        </div>
    );
}

export default TeacherDashboard;
