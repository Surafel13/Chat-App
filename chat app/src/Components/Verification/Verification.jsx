import React, { useEffect, useState } from 'react';
import './Verification.css';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase'; // Adjust path if necessary
import { sendEmailVerification, signOut } from 'firebase/auth';

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

        // Poll every 3 seconds to check if email is verified
        const interval = setInterval(async () => {
            try {
                if (auth.currentUser) {
                    await auth.currentUser.reload();
                    if (auth.currentUser.emailVerified) {
                        clearInterval(interval);
                        navigate('/Messaging');
                    }
                }
            } catch (error) {
                console.error("Error checking verification status", error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [navigate]);

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
            // Handle rate limiting usually thrown by Firebase
            if (error.code === 'auth/too-many-requests') {
                setMessage('Too many requests. Please wait a bit before resending.');
            } else {
                setMessage('Failed to send email. Please try again.');
            }
        } finally {
            setIsResending(false);
        }
    };

    const handleLogout = async () => {
        try {
            await signOut(auth);
            navigate('/');
        } catch (error) {
            console.error("Error signing out:", error);
        }
    };

    return (
        <div className='Main-container'>
            <div className="verify-container">
                <h2>Verify Your Email</h2>
                <div className="verify-content">
                    <p>
                        📩 We’ve sent a verification link to <strong>{auth.currentUser?.email}</strong>.
                    </p>
                    <p>
                        Please check your inbox (and spam folder) and click the link to verify your account.
                        The system will automatically detect when you verify.
                    </p>

                    {message && <p className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>{message}</p>}

                    <div className="button-group">
                        <button
                            className="primary-btn"
                            onClick={handleResendEmail}
                            disabled={isResending}
                        >
                            {isResending ? 'Sending...' : 'Resend Verification Email'}
                        </button>

                        <button
                            className="secondary-btn"
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
