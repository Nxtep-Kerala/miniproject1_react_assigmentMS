import React, { useEffect, useState } from 'react';
import { firestore } from '../firebase-config';

function StudentDashboard({ userId }) {
    const [tasks, setTasks] = useState([]);
    const [timetable, setTimetable] = useState([]);

    useEffect(() => {
        const tasksRef = firestore.collection('assignments')
            .where('assignedTo', '==', userId);
        const timetableRef = firestore.collection('timetables')
            .where('studentId', '==', userId);

        const unsubscribeTasks = tasksRef.onSnapshot(snapshot => {
            setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        const unsubscribeTimetable = timetableRef.onSnapshot(snapshot => {
            setTimetable(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
        });

        return () => {
            unsubscribeTasks();
            unsubscribeTimetable();
        };
    }, [userId]);

    return (
        <div>
            <h2>Student Dashboard</h2>
            <h3>Assigned Tasks</h3>
            {tasks.map(task => (
                <div key={task.id}>
                    <h4>{task.title}</h4>
                    <p>{task.description}</p>
                    <p>Due by: {task.deadline}</p>
                </div>
            ))}
            <h3>Timetable</h3>
            {timetable.map(entry => (
                <div key={entry.id}>
                    <p>{entry.class} at {entry.time}</p>
                </div>
            ))}
        </div>
    );
}

export default StudentDashboard;
