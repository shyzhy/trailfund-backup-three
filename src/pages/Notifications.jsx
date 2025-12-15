import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaFilter, FaArrowLeft, FaCircle } from 'react-icons/fa';
import { API_BASE_URL } from '../config';

export default function Notifications() {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // all, campaigns, requests, people
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setCurrentUser(JSON.parse(storedUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!currentUser) return;
            try {
                const response = await fetch(`${API_BASE_URL}/api/notifications/${currentUser._id}`);
                if (response.ok) {
                    const data = await response.json();
                    setNotifications(data);
                }
            } catch (err) {
                console.error("Error fetching notifications:", err);
            } finally {
                setLoading(false);
            }
        };

        if (currentUser) {
            fetchNotifications();
        }
    }, [currentUser]);

    const handleMarkAllRead = async () => {
        if (!currentUser) return;
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${currentUser._id}/read-all`, { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
        } catch (err) {
            console.error("Error marking all read:", err);
        }
    };

    const handleNotificationClick = async (notification) => {
        // Mark as read locally first for immediate feedback
        if (!notification.is_read) {
            setNotifications(prev => prev.map(n => n._id === notification._id ? { ...n, is_read: true } : n));
            try {
                await fetch(`${API_BASE_URL}/api/notifications/${notification._id}/read`, { method: 'PUT' });
            } catch (err) {
                console.error("Error marking as read:", err);
            }
        }

        // Navigate based on type
        if (notification.type === 'friend_request' && notification.sender_id) {
            navigate(`/profile/${notification.sender_id._id}`);
        } else if (['campaign_rejected', 'campaign_approved', 'campaign_revision'].includes(notification.type) && notification.related_id) {
            navigate(`/campaigns/${notification.related_id}`);
        } else if (notification.type === 'request_fulfillment' && notification.related_id) {
            navigate(`/requests/${notification.related_id}`);
        }
    };

    const getFilteredNotifications = () => {
        if (filter === 'all') return notifications;

        return notifications.filter(n => {
            if (filter === 'campaigns') {
                return ['campaign_approved', 'campaign_rejected', 'campaign_revision'].includes(n.type);
            }
            if (filter === 'requests') {
                return ['request_fulfillment'].includes(n.type); // Add other request types if any
            }
            if (filter === 'people') {
                return ['friend_request', 'follow'].includes(n.type);
            }
            return true;
        });
    };

    const filteredNotifications = getFilteredNotifications();

    return (
        <div style={{ padding: '20px', paddingBottom: 80, minHeight: '100vh', background: 'var(--primary-bg)', color: 'white' }}>

            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
                    <div onClick={() => navigate(-1)} style={{ cursor: 'pointer', background: 'rgba(255,255,255,0.1)', padding: 10, borderRadius: '50%' }}>
                        <FaArrowLeft />
                    </div>
                    <h1 style={{ margin: 0, fontSize: 24, fontWeight: 'bold' }}>Notifications</h1>
                </div>
                <button
                    onClick={handleMarkAllRead}
                    style={{
                        background: 'transparent',
                        border: '1px solid #00B4D8',
                        color: '#00B4D8',
                        padding: '8px 16px',
                        borderRadius: 20,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                        fontSize: 14,
                        fontWeight: 'bold'
                    }}
                >
                    <FaCheck /> Mark all as read
                </button>
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto', paddingBottom: 10, marginBottom: 10, scrollbarWidth: 'none' }}>
                {['all', 'campaigns', 'requests', 'people'].map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        style={{
                            background: filter === f ? '#00B4D8' : 'rgba(255,255,255,0.1)',
                            color: 'white',
                            border: 'none',
                            padding: '8px 20px',
                            borderRadius: 20,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            fontWeight: filter === f ? 'bold' : 'normal',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="glass-card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: 40, textAlign: 'center', opacity: 0.7 }}>Loading notifications...</div>
                ) : filteredNotifications.length > 0 ? (
                    filteredNotifications.map(n => (
                        <div
                            key={n._id}
                            onClick={() => handleNotificationClick(n)}
                            style={{
                                padding: 20,
                                borderBottom: '1px solid rgba(255,255,255,0.1)',
                                background: n.is_read ? 'transparent' : 'rgba(0, 180, 216, 0.1)', // Light blue tint for unread
                                cursor: 'pointer',
                                display: 'flex',
                                gap: 15,
                                alignItems: 'flex-start',
                                transition: 'background 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = n.is_read ? 'transparent' : 'rgba(0, 180, 216, 0.1)'}
                        >
                            <div style={{
                                width: 48, height: 48, borderRadius: '50%',
                                backgroundImage: `url(${n.sender_id?.profile_picture || '/assets/default_avatar.png'})`,
                                backgroundSize: 'cover',
                                flexShrink: 0,
                                border: '2px solid rgba(255,255,255,0.2)'
                            }} />

                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.95)', marginBottom: 6, lineHeight: 1.4 }}>
                                    <span style={{ fontWeight: 'bold', color: '#FFD700' }}>{n.sender_id?.name || 'System'}</span> {n.message}
                                </div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: 6 }}>
                                    {new Date(n.date).toLocaleDateString()} at {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}

                                    {/* Type Badge */}
                                    <span style={{
                                        background: 'rgba(255,255,255,0.1)',
                                        padding: '2px 8px',
                                        borderRadius: 4,
                                        fontSize: 10,
                                        textTransform: 'uppercase',
                                        marginLeft: 8
                                    }}>
                                        {n.type.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            {!n.is_read && <FaCircle size={10} color="#00B4D8" style={{ marginTop: 10 }} />}
                        </div>
                    ))
                ) : (
                    <div style={{ padding: 50, textAlign: 'center', opacity: 0.6, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 15 }}>
                        <FaBell size={40} />
                        <div>No notifications found in this category.</div>
                    </div>
                )}
            </div>
        </div>
    );
}
