import React, { useState } from 'react';
import { storage } from '../firebase-config';
import { firestore } from '../firebase-config';

function SubmitAssignment({ userId, assignmentId }) {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) return;
        const fileRef = storage.ref().child(`submissions/${userId}/${assignmentId}/${file.name}`);
        setUploading(true);
        await fileRef.put(file);
        const fileUrl = await fileRef.getDownloadURL();
        await firestore.collection('submissions').add({
            userId,
            assignmentId,
            submissionUrl: fileUrl,
            submittedAt: new Date()
        });
        setUploading(false);
        alert('File submitted successfully!');
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleUpload} disabled={uploading}>
                {uploading ? 'Uploading...' : 'Submit Assignment'}
            </button>
        </div>
    );
}

export default SubmitAssignment;
