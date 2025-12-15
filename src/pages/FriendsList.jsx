import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaUserCheck, FaUserTimes, FaUser, FaSearch } from 'react-icons/fa';
import Modal from '../components/Modal';
import { API_BASE_URL } from '../config';

export default function FriendsList() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [modal, setModal] = useState({ isOpen: false, type: '', message: '' });
    const [loading, setLoading] = useState(true);

    const currentUser = JSON.parse(localStorage.getItem('user'));

    const fetchUser = async () => {
        try {
            if (!currentUser) return;
            const response = await fetch(`${API_BASE_URL}/api/users/${currentUser._id}/full`);
            if (response.ok) {
                const data = await response.json();
                setUser(data);
            }
        } catch (err) {
            console.error('Error fetching user:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/login');
            return;
        }
        fetchUser();
    }, [navigate]);

    const handleAccept = async (requesterId) => {
        setModal({ isOpen: true, type: 'pending', message: 'Accepting request...' });
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${requesterId}/friend/accept`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_user_id: currentUser._id })
            });

            if (response.ok) {
                setModal({ isOpen: true, type: 'success', message: 'Friend request accepted!' });
                fetchUser(); // Refresh list
            } else {
                setModal({ isOpen: true, type: 'warning', message: 'Failed to accept request' });
            }
        } catch (err) {
            setModal({ isOpen: true, type: 'error', message: err.message });
        }
    };

    const handleReject = async (requesterId) => {
        if (!window.confirm("Are you sure you want to remove this request?")) return;

        try {
            const response = await fetch(`${API_BASE_URL}/api/users/${requesterId}/friend/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ current_user_id: currentUser._id })
            });

            if (response.ok) {
                fetchUser(); // Refresh list
            }
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div style={{ padding: 20, color: 'white', textAlign: 'center' }}>Loading...</div>;

    // Filter requests to show only received ones
    const receivedRequests = user?.friend_requests?.filter(r => r.status === 'received') || [];

    return (
        <div style={{ paddingBottom: 100, minHeight: '100vh', color: 'white', padding: 24 }}>
            <Modal
                isOpen={modal.isOpen}
                type={modal.type}
                message={modal.message}
                onClose={() => setModal({ ...modal, isOpen: false })}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 30 }}>
                <div
                    onClick={() => navigate(-1)}
                    style={{
                        width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.1)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                    }}
                >
                    <FaArrowLeft />
                </div>
                <h1 style={{ margin: 0, fontSize: 24 }}>Friends List</h1>
            </div>

            {/* Friend Requests Section */}
            {receivedRequests.length > 0 && (
                <div style={{ marginBottom: 40 }}>
                    <h2 style={{ fontSize: 18, color: 'var(--accent-color)', marginBottom: 15 }}>Friend Requests</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {receivedRequests.map(req => (
                            <div key={req._id} className="glass-card" style={{ padding: 15, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div
                                    style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile/${req.user_id._id}`)}
                                >
                                    <img
                                        src={req.user_id?.profile_picture || "/assets/giselle.jpg"}
                                        alt="Profile"
                                        style={{ width: 50, height: 50, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{req.user_id?.name || 'Unknown User'}</div>
                                        <div style={{ fontSize: 12, opacity: 0.7 }}>@{req.user_id?.username}</div>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', gap: 8 }}>
                                    <button
                                        onClick={() => handleAccept(req.user_id._id)}
                                        style={{
                                            background: '#4CAF50', border: 'none', borderRadius: 8, width: 36, height: 36,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <FaUserCheck />
                                    </button>
                                    <button
                                        onClick={() => handleReject(req.user_id._id)}
                                        style={{
                                            background: '#F44336', border: 'none', borderRadius: 8, width: 36, height: 36,
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', cursor: 'pointer'
                                        }}
                                    >
                                        <FaUserTimes />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Friends List Section */}
            <div>
                <h2 style={{ fontSize: 18, color: 'white', marginBottom: 15 }}>Your Friends ({user?.friends?.length || 0})</h2>

                {user?.friends?.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 15 }}>
                        {user.friends.map(friend => (
                            <div
                                key={friend._id}
                                className="glass-card"
                                style={{ padding: 15, textAlign: 'center', cursor: 'pointer' }}
                                onClick={() => navigate(`/profile/${friend._id}`)}
                            >
                                <img
                                    src={friend.profile_picture || "/assets/giselle.jpg"}
                                    alt="Profile"
                                    style={{ width: 70, height: 70, borderRadius: '50%', objectFit: 'cover', marginBottom: 10 }}
                                />
                                <div style={{ fontWeight: 'bold', fontSize: 14, marginBottom: 4 }}>{friend.name}</div>
                                <div style={{ fontSize: 12, opacity: 0.6 }}>@{friend.username}</div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: 40, opacity: 0.6, background: 'rgba(255,255,255,0.05)', borderRadius: 12 }}>
                        <FaUser size={40} style={{ marginBottom: 15, opacity: 0.5 }} />
                        <div>No friends yet</div>
                        <div style={{ fontSize: 13, marginTop: 5 }}>Connect with others to grow your network!</div>
                    </div>
                )}
            </div>
        </div>
    );
}
