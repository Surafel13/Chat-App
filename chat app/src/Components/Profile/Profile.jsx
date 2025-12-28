import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCamera, FaSave, FaUserEdit, FaExpand } from "react-icons/fa";
import './Profile.css';
import { useUser } from '../../Context/UserContext';
import { db } from '../../firebase';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';
import img1 from './../../Img/cat-1.jpg'; // Default image

function Profile() {
    const navigate = useNavigate();
    const { user: currentUser } = useUser();

    // Form States
    const [displayName, setDisplayName] = useState('');
    const [status, setStatus] = useState('');
    const [photoURL, setPhotoURL] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });
    const [isEditing, setIsEditing] = useState(false);

    // 1. Redirect if not logged in
    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    // 2. Listen to Real-time User Data
    useEffect(() => {
        if (!currentUser) return;

        const userDocRef = doc(db, "users", currentUser.uid);
        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                setDisplayName(data.displayName || '');
                setStatus(data.status || 'Available');
                setPhotoURL(data.photoURL || '');
            }
        });

        return () => unsubscribe();
    }, [currentUser]);

    // 3. Handle Update
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!currentUser) return;

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                displayName: displayName,
                status: status,
                photoURL: photoURL // Assuming URL input for now, or just keeping existing
            });

            setMessage({ type: 'success', text: 'Profile updated successfully!' });
            setIsEditing(false);

            // Auto-hide success message
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            console.error("Error updating profile:", error);
            setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className='ProfileContainer'>
            {/* Header / Cover Area */}
            <div className='UserInfoWrapper'>
                <button className="back-btn" onClick={() => navigate('/Messaging')}>
                    <FaArrowLeft size={18} color="#4A5568" />
                </button>

                <div className="profile-image-section">
                    <img src={photoURL || img1} alt="profile" />

                    <a
                        href={photoURL || img1}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-photo-btn"
                        title="View Full Image"
                    >
                        <FaExpand size={14} />
                    </a>

                    {isEditing && (
                        <div className="camera-icon">
                            <FaCamera />
                        </div>
                    )}
                </div>

                <div className='userInfo'>
                    <h1>{displayName || "User"}</h1>
                    <small>{status || "Available"}</small>
                </div>
            </div>

            {/* Form Section */}
            <div className='AccountInfoWrapper'>
                <div className="section-header">
                    <h5>Personal Information</h5>
                    {!isEditing && (
                        <button className="edit-toggle-btn" onClick={() => setIsEditing(true)}>
                            <FaUserEdit /> Edit
                        </button>
                    )}
                </div>

                {message.text && (
                    <div className={`alert-message ${message.type}`}>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleUpdate} className="profile-form">
                    {/* Read Only Fields */}
                    <div className='Infos readonly'>
                        <small className="label">E-Mail Address</small>
                        <p>{currentUser.email}</p>
                    </div>

                    <div className='Infos readonly'>
                        <small className="label">User ID (Private)</small>
                        <p>{currentUser.uid}</p>
                    </div>

                    {/* Editable Fields */}
                    <div className={`Infos ${isEditing ? 'editable' : ''}`}>
                        <small className="label">Display Name</small>
                        {isEditing ? (
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                placeholder="Enter your name"
                                required
                            />
                        ) : (
                            <p>{displayName || "Not set"}</p>
                        )}
                    </div>

                    {isEditing && (
                        <div className='Infos editable'>
                            <small className="label">Photo URL</small>
                            <input
                                type="text"
                                value={photoURL}
                                onChange={(e) => setPhotoURL(e.target.value)}
                                placeholder="https://example.com/avatar.jpg"
                            />
                        </div>
                    )}

                    <div className={`Infos bio ${isEditing ? 'editable' : ''}`}>
                        <small className="label">About / Status</small>
                        {isEditing ? (
                            <textarea
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                placeholder="What's on your mind?"
                                rows={3}
                            />
                        ) : (
                            <p>{status || "Available"}</p>
                        )}
                    </div>

                    {/* Save Actions */}
                    {isEditing && (
                        <div className="form-actions">
                            <button
                                type="button"
                                className="cancel-btn"
                                onClick={() => setIsEditing(false)}
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="save-btn"
                                disabled={loading}
                            >
                                {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                            </button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Profile;