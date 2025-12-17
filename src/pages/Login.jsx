import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

import { useAuth } from '../context/AuthContext';

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [identifier, setIdentifier] = useState(''); // Username or Email
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Login successful
                console.log('Login successful:', data.user);
                login(data.user);
                if (data.user.role === 'faculty' || data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else {
                    navigate('/home');
                }
            } else {
                setError(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
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
            padding: 20,
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Background Image with Mask Fade */}
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

                    {/* Logo */}
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 20,
                        overflow: 'hidden',
                        padding: 10
                    }}>
                        <img src="/assets/logo.png" alt="TrailFund Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>

                    <h2 style={{ marginBottom: 30, fontSize: 24, fontWeight: 'bold' }}>Welcome Back</h2>

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

                    <form onSubmit={handleLogin} style={{ width: '100%' }}>
                        {/* Identifier Input */}
                        <div style={{ marginBottom: 20, position: 'relative' }}>
                            <FaUser style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
                            <input
                                type="text"
                                placeholder="Username or Email"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
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

                        {/* Password Input */}
                        <div style={{ marginBottom: 10, position: 'relative' }}>
                            <FaLock style={{ position: 'absolute', left: 15, top: 14, color: 'rgba(255,255,255,0.6)' }} />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
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

                        {/* Forgot Password */}
                        <div style={{ textAlign: 'right', marginBottom: 30 }}>
                            <button type="button" style={{ background: 'none', border: 'none', color: 'var(--accent-color)', cursor: 'pointer', fontSize: 14 }}>
                                Forgot Password?
                            </button>
                        </div>

                        {/* Login Button */}
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
                                cursor: isLoading ? 'not-allowed' : 'pointer'
                            }}
                        >
                            {isLoading ? 'Logging in...' : 'Log In'}
                        </button>
                    </form>



                    {/* Sign Up Link */}
                    <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                        Don't have an account?{' '}
                        <Link to="/signup" style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                            Sign Up
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
