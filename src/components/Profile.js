import React, { useState, useEffect } from 'react';
import { firestore, auth } from '../firebase-config';

function Profile() {
    const [userProfile, setUserProfile] = useState({ name: '', email: '', department: '', year: '', profilePic: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            const user = auth.currentUser;
            if (user) {
                const userProfileDoc = await firestore.collection('users').doc(user.uid).get();
                if (userProfileDoc.exists) {
                    setUserProfile(userProfileDoc.data());
                    setLoading(false);
                }
            }
        };
        fetchUserProfile();
    }, []);

    const handleUpdateProfile = async () => {
        const user = auth.currentUser;
        if (user) {
            await firestore.collection('users').doc(user.uid).update(userProfile);
            alert('Profile updated successfully!');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Profile</h2>
            <input type="text" value={userProfile.name} onChange={(e) => setUserProfile({ ...userProfile, name: e.target.value })} placeholder="Name" />
            <input type="text" value={userProfile.department} onChange={(e) => setUserProfile({ ...userProfile, department: e.target.value })} placeholder="Department" />
            <input type="text" value={userProfile.year} onChange={(e) => setUserProfile({ ...userProfile, year: e.target.value })} placeholder="Year" />
            <input type="text" value={userProfile.profilePic} onChange={(e) => setUserProfile({ ...userProfile, profilePic: e.target.value })} placeholder="Profile Picture URL" />
            <button onClick={handleUpdateProfile}>Update Profile</button>
        </div>
    );
}

export default Profile;
