import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCamera, FaSave, FaUser } from 'react-icons/fa';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';

export default function AdminProfile() {
    const navigate = useNavigate();
    const { user, login } = useAuth(); // login used to update local storage
    const [name, setName] = useState(user?.name || '');
    const [imageString, setImageString] = useState('');
    const [preview, setPreview] = useState(user?.profile_picture || null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    useEffect(() => {
        if (user) {
            setName(user.name || '');
            setPreview(user.profile_picture || null);
        }
    }, [user]);

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
        setLoading(true);
        setMessage('');

        try {
            // Update Name
            const updateResponse = await fetch(`${API_BASE_URL}/api/users/${user._id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, username: user.username }) // Keep username same
            });

            if (!updateResponse.ok) throw new Error('Failed to update name');
            const updateData = await updateResponse.json();

            // Update Photo if changed
            let finalUser = updateData.user;
            if (imageString) {
                const photoResponse = await fetch(`${API_BASE_URL}/api/users/${user._id}/photo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ profile_picture: imageString })
                });

                if (!photoResponse.ok) throw new Error('Failed to update photo');
                const photoData = await photoResponse.json();
                finalUser = photoData.user;
            }

            // Update Local Storage & Context
            // We can manually update localStorage or use the login function if it accepts user object
            // Assuming AuthContext's login sets user and localStorage
            // But login usually takes token. Let's look at AuthContext later. 
            // For now manually update localStorage and reload to be safe or use a method if available.
            // A simple page reload or re-fetch might be needed if Context doesn't expose update.
            // Let's just update localStorage directly for now as per other components.
            const currentUser = JSON.parse(localStorage.getItem('user'));
            const newUser = { ...currentUser, ...finalUser };
            localStorage.setItem('user', JSON.stringify(newUser));

            setMessage('Profile updated successfully!');
            // Optional: force reload or context update
            window.location.reload();
        } catch (err) {
            setMessage('Error: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ color: 'white', maxWidth: 600, margin: '0 auto' }}>
            <h1 style={{ marginBottom: 30 }}>Admin Profile</h1>

            {message && (
                <div style={{
                    padding: 15,
                    background: message.includes('Error') ? 'rgba(255,107,107,0.2)' : 'rgba(40,167,69,0.2)',
                    color: message.includes('Error') ? '#ff6b6b' : '#28a745',
                    borderRadius: 12,
                    marginBottom: 20
                }}>
                    {message}
                </div>
            )}

            <div className="glass-card" style={{ padding: 40 }}>
                <form onSubmit={handleSubmit}>

                    {/* Image Upload */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 30 }}>
                        <div style={{ position: 'relative', width: 120, height: 120 }}>
                            <div style={{
                                width: '100%', height: '100%', borderRadius: '50%',
                                overflow: 'hidden', border: '3px solid rgba(255,255,255,0.2)',
                                background: '#333'
                            }}>
                                {preview ? (
                                    <img src={preview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                ) : (
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'rgba(255,255,255,0.5)' }}>
                                        <FaUser size={40} />
                                    </div>
                                )}
                            </div>
                            <label style={{
                                position: 'absolute', bottom: 0, right: 0,
                                background: 'var(--accent-color)', width: 36, height: 36,
                                borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', border: '2px solid #003B5C'
                            }}>
                                <FaCamera size={16} color="white" />
                                <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                            </label>
                        </div>
                    </div>

                    {/* Name Input */}
                    <div style={{ marginBottom: 25 }}>
                        <label style={{ display: 'block', marginBottom: 10, color: 'rgba(255,255,255,0.7)' }}>Display Name</label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: '100%', padding: 15, borderRadius: 12, border: '1px solid rgba(255,255,255,0.1)',
                                background: 'rgba(0,0,0,0.2)', color: 'white', fontSize: 16
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: 25 }}>
                        <label style={{ display: 'block', marginBottom: 10, color: 'rgba(255,255,255,0.7)' }}>Role</label>
                        <div style={{ padding: 15, background: 'rgba(255,255,255,0.05)', borderRadius: 12, color: 'rgba(255,255,255,0.5)' }}>
                            {user?.role === 'faculty' ? 'Faculty Administrator' : 'System Administrator'}
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="btn"
                        style={{
                            width: '100%', background: 'var(--accent-color)', color: 'white', padding: 15,
                            borderRadius: 12, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10
                        }}
                    >
                        {loading ? 'Saving...' : <><FaSave /> Save Changes</>}
                    </button>
                </form>
            </div>
        </div>
    );
}
