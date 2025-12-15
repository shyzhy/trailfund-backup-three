import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaEnvelope, FaLock, FaUniversity, FaIdCard, FaCalendarAlt } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        age: '',
        college: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/upload-photo', { state: { userId: data.user._id, username: data.user.username } });
            } else {
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = {
        width: '100%',
        padding: '12px 12px 12px 45px',
        borderRadius: 32,
        border: '1px solid rgba(255,255,255,0.2)',
        background: 'rgba(255,255,255,0.05)',
        color: 'white',
        fontSize: 16,
        outline: 'none',
        boxSizing: 'border-box'
    };

    const iconStyle = {
        position: 'absolute',
        left: 15,
        top: 14,
        color: 'rgba(255,255,255,0.6)'
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            background: 'var(--primary-bg)',
            color: 'white'
        }}>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: 450, padding: 40 }}
            >
                <div style={{ textAlign: 'center', marginBottom: 30 }}>
                    {/* Logo */}
                    <div style={{
                        width: 80,
                        height: 80,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto 20px',
                        overflow: 'hidden',
                        padding: 10
                    }}>
                        <img src="/assets/logo.png" alt="TrailFund Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                    </div>
                    <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Create Account</h1>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14 }}>Join the TrailFund community</p>
                </div>

                {error && (
                    <div style={{
                        background: 'rgba(255, 107, 107, 0.2)',
                        border: '1px solid #FF6B6B',
                        color: '#FF6B6B',
                        padding: '10px',
                        borderRadius: '8px',
                        marginBottom: 20,
                        textAlign: 'center',
                        fontSize: 14
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
                    {/* Username */}
                    <div style={{ position: 'relative' }}>
                        <FaUser style={iconStyle} />
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Name */}
                    <div style={{ position: 'relative' }}>
                        <FaIdCard style={iconStyle} />
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Age & College Row */}
                    <div style={{ display: 'flex', gap: 15 }}>
                        <div style={{ position: 'relative', width: '35%' }}>
                            <FaCalendarAlt style={iconStyle} />
                            <input
                                type="number"
                                name="age"
                                placeholder="Age"
                                value={formData.age}
                                onChange={handleChange}
                                required
                                style={inputStyle}
                            />
                        </div>
                        <div style={{ position: 'relative', width: '65%' }}>
                            <FaUniversity style={iconStyle} />
                            <select
                                name="college"
                                value={formData.college}
                                onChange={handleChange}
                                required
                                style={{
                                    ...inputStyle,
                                    appearance: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="" disabled style={{ color: 'black' }}>Select College</option>
                                <option value="College of Information Technology and Computing" style={{ color: 'black' }}>College of Information Technology and Computing</option>
                                <option value="College of Engineering and Architecture" style={{ color: 'black' }}>College of Engineering and Architecture</option>
                                <option value="College of Science and Mathematics" style={{ color: 'black' }}>College of Science and Mathematics</option>
                                <option value="College of Technology" style={{ color: 'black' }}>College of Technology</option>
                                <option value="College of Science and Technology Education" style={{ color: 'black' }}>College of Science and Technology Education</option>
                                <option value="Senior High School" style={{ color: 'black' }}>Senior High School</option>
                            </select>
                        </div>
                    </div>

                    {/* Email */}
                    <div style={{ position: 'relative' }}>
                        <FaEnvelope style={iconStyle} />
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    {/* Password */}
                    <div style={{ position: 'relative' }}>
                        <FaLock style={iconStyle} />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            style={inputStyle}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'var(--accent-color)',
                            color: 'white',
                            fontSize: 16,
                            padding: 14,
                            marginTop: 10,
                            opacity: loading ? 0.7 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <div style={{ marginTop: 20, textAlign: 'center', fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none' }}>
                        Log In
                    </Link>
                </div>
            </motion.div>
        </div>
    );
};

export default Signup;
