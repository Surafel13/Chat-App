import React, { useEffect, useState } from 'react';
import './Verification.css';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../firebase'; // Adjust path if necessary
import { sendEmailVerification, signOut } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

function Verification() {
    const navigate = useNavigate();
    const [isResending, setIsResending] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Check if user is already verified or no user logged in
        if (!auth.currentUser) {
            navigate('/');
            return;
        }

        if (auth.currentUser.emailVerified) {
            navigate('/Messaging');
            return;
        }

        // Poll every 5 seconds to check if email is verified
        const interval = setInterval(async () => {
            checkVerificationStatus();
        }, 5000);

        return () => clearInterval(interval);
    }, [navigate]);

    const checkVerificationStatus = async () => {
        try {
            if (auth.currentUser) {
                await auth.currentUser.reload();
                if (auth.currentUser.emailVerified) {
                    // Update Firestore status
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    await updateDoc(userRef, { isVerified: true });
                    navigate('/Messaging');
                    return true;
                }
            }
        } catch (error) {
            console.error("Error checking verification status", error);
        }
        return false;
    };

    const handleResendEmail = async () => {
        setIsResending(true);
        setMessage('');
        try {
            if (auth.currentUser) {
                await sendEmailVerification(auth.currentUser);
                setMessage('Verification email sent successfully!');
            }
        } catch (error) {
            console.error("Error resending email:", error);
            if (error.code === 'auth/too-many-requests') {
                setMessage('Too many requests. Please wait a bit before resending.');
            } else {
                setMessage('Failed to send email. Please try again.');
            }
        } finally {
            setIsResending(false);
        }
    };

    const handleManualCheck = async () => {
        const verified = await checkVerificationStatus();
        if (!verified) {
            setMessage('Email not yet verified. Please check your inbox.');
            // Clear message after 3 seconds
            setTimeout(() => setMessage(''), 3000);
        }
    };

    const handleLogout = async () => {
        try {
            if (auth.currentUser) {
                const userRef = doc(db, "users", auth.currentUser.uid);
                await updateDoc(userRef, {
                    isOnline: false,
                    lastSeen: new Date()
                });
            }
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className='VerificationPage'>
            <div className="VerificationCard">
                <div className="IconWrapper">
                    <div className="MailIcon">📩</div>
                </div>
                <h2>Verify Your Email</h2>
                <div className="VerificationContent">
                    <p>
                        We’ve sent a verification link to <br />
                        <strong>{auth.currentUser?.email}</strong>
                    </p>
                    <p className="description">
                        Please check your inbox and click the link to verify your account.
                        If you don't see it, check your <strong>spam folder</strong>.
                    </p>

                    {message && (
                        <div className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>
                            {message}
                        </div>
                    )}

                    <div className="button-group">
                        <button
                            className="check-btn"
                            onClick={handleManualCheck}
                        >
                            I've Verified My Email
                        </button>

                        <button
                            className="resend-btn"
                            onClick={handleResendEmail}
                            disabled={isResending}
                        >
                            {isResending ? 'Sending...' : 'Resend Verification Email'}
                        </button>

                        <button
                            className="logout-btn"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Verification;
