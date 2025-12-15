import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCamera, FaArrowRight } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

const UploadPhoto = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, username } = location.state || {};
    const [preview, setPreview] = useState(null);
    const [imageString, setImageString] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Redirect if no user ID (accessed directly)
    React.useEffect(() => {
        if (!userId) {
            navigate('/signup');
        }
    }, [userId, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(reader.result);
                setImageString(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!imageString) return;

        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}/photo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ profile_picture: imageString }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('user', JSON.stringify(data.user));
                navigate('/home');
            } else {
                const data = await response.json();
                setError(data.message || 'Failed to upload photo');
            }
        } catch (err) {
            setError('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSkip = () => {
        navigate('/home');
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
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card"
                style={{ width: '100%', maxWidth: 450, padding: 40, textAlign: 'center' }}
            >
                <h1 style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>Welcome, {username}!</h1>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 14, marginBottom: 30 }}>Add a photo to complete your profile</p>

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

                <div style={{ marginBottom: 30, display: 'flex', justifyContent: 'center' }}>
                    <div style={{
                        position: 'relative',
                        width: 128,
                        height: 128,
                        borderRadius: '50%',
                        background: 'rgba(255,255,255,0.1)',
                        border: '4px solid rgba(255,255,255,0.2)',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        {preview ? (
                            <img src={preview} alt="Profile Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <FaCamera style={{ fontSize: 40, color: 'rgba(255,255,255,0.5)' }} />
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            style={{
                                position: 'absolute',
                                inset: 0,
                                opacity: 0,
                                cursor: 'pointer'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    <button
                        onClick={handleSubmit}
                        disabled={!imageString || loading}
                        className="btn"
                        style={{
                            width: '100%',
                            background: 'var(--accent-color)',
                            color: 'white',
                            fontSize: 16,
                            padding: 14,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            opacity: (!imageString || loading) ? 0.7 : 1,
                            cursor: (!imageString || loading) ? 'not-allowed' : 'pointer'
                        }}
                    >
                        {loading ? 'Uploading...' : 'Complete Setup'}
                        {!loading && <FaArrowRight />}
                    </button>

                    <button
                        onClick={handleSkip}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: 14,
                            cursor: 'pointer',
                            padding: 10
                        }}
                    >
                        Skip for now
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default UploadPhoto;
