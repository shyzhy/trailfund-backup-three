import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaArrowLeft } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

export default function ForgotPassword() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Verify, 2: Reset
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [userId, setUserId] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const handleVerify = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/verify-reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, email }),
            });

            const data = await response.json();

            if (response.ok) {
                setUserId(data.user_id);
                setStep(2);
            } else {
                setError(data.message || 'Verification failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = async (e) => {
        e.preventDefault();
        setError('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/reset-password`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: userId, newPassword }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccessMessage('Password reset successfully! Redirecting...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError(data.message || 'Reset failed');
            }
        } catch (err) {
            setError('Connection error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Image with Mask Fade */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                height: '60vh',
                backgroundImage: 'url(/assets/university.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'top center',
                backgroundRepeat: 'no-repeat',
                zIndex: 0,
                opacity: 0.3,
                maskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 30%, black 70%, transparent 100%)'
            }} />

            <div style={{ position: 'relative', zIndex: 1, width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="glass-card" style={{ width: '100%', maxWidth: 400, padding: 40, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>

                    <h2 style={{ marginBottom: 10, fontSize: 24, fontWeight: 'bold' }}>
                        {step === 1 ? 'Forgot Password' : 'Reset Password'}
                    </h2>

                    <p style={{ marginBottom: 30, textAlign: 'center', color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>
                        {step === 1
                            ? 'Enter your details to verify your account.'
                            : 'Create a new password for your account.'}
                    </p>

                    {error && (
                        <div style={{
                            background: 'rgba(255, 107, 107, 0.2)',
                            border: '1px solid #FF6B6B',
                            color: '#FF6B6B',
                            padding: '10px',
                            borderRadius: '8px',
                            width: '100%',
                            marginBottom: 20,
                            textAlign: 'center',
                            fontSize: 14
                        }}>
                            {error}
                        </div>
                    )}

                    {successMessage && (
                        <div style={{
                            background: 'rgba(75, 181, 67, 0.2)',
                            border: '1px solid #4BB543',
                            color: '#4BB543',
                            padding: '10px',
                            borderRadius: '8px',
                            width: '100%',
                            marginBottom: 20,
                            textAlign: 'center',
                            fontSize: 14
                        }}>
                            {successMessage}
                        </div>
                    )}

                    {step === 1 ? (
                        <form onSubmit={handleVerify} style={{ width: '100%' }}>
                            <div style={{ marginBottom: 20, position: 'relative' }}>
                                <FaUser style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <input
                                    type="text"
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 45px',
                                        borderRadius: 32,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: 16,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 30, position: 'relative' }}>
                                <FaEnvelope style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <input
                                    type="email"
                                    placeholder="Email Address"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 45px',
                                        borderRadius: 32,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: 16,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: 'var(--accent-color)',
                                    color: 'white',
                                    fontSize: 16,
                                    padding: 14,
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    borderRadius: 32,
                                    border: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isLoading ? 'Verifying...' : 'Verify Account'}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleReset} style={{ width: '100%' }}>
                            <div style={{ marginBottom: 20, position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <input
                                    type="password"
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 45px',
                                        borderRadius: 32,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: 16,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>
                            <div style={{ marginBottom: 30, position: 'relative' }}>
                                <FaLock style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
                                <input
                                    type="password"
                                    placeholder="Confirm New Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 12px 12px 45px',
                                        borderRadius: 32,
                                        border: '1px solid rgba(255,255,255,0.2)',
                                        background: 'rgba(255,255,255,0.05)',
                                        color: 'white',
                                        fontSize: 16,
                                        outline: 'none',
                                        boxSizing: 'border-box'
                                    }}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className="btn"
                                disabled={isLoading}
                                style={{
                                    width: '100%',
                                    background: 'var(--accent-color)',
                                    color: 'white',
                                    fontSize: 16,
                                    padding: 14,
                                    opacity: isLoading ? 0.7 : 1,
                                    cursor: isLoading ? 'not-allowed' : 'pointer',
                                    borderRadius: 32,
                                    border: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                {isLoading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}

                    <Link to="/login" style={{ marginTop: 20, color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'flex', alignItems: 'center', fontSize: 14 }}>
                        <FaArrowLeft style={{ marginRight: 5 }} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
