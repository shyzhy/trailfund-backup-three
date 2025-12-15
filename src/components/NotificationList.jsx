import React, { useEffect, useState } from "react";
import { FaBell, FaCheck, FaTimes, FaCircle } from "react-icons/fa";
import { API_BASE_URL } from '../config';
import { useNavigate } from 'react-router-dom';

export default function NotificationList({ userId, onClose, onMarkAllRead }) {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/notifications/${userId}`);
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

        if (userId) {
            fetchNotifications();
        }
    }, [userId]);

    const handleNotificationClick = async (notification) => {
        // Mark as read
        if (!notification.is_read) {
            try {
                await fetch(`${API_BASE_URL}/api/notifications/${notification._id}/read`, { method: 'PUT' });
                setNotifications(notifications.map(n => n._id === notification._id ? { ...n, is_read: true } : n));
            } catch (err) {
                console.error("Error marking as read:", err);
            }
        }

        // Navigate based on type
        if (notification.type === 'friend_request' && notification.sender_id) {
            navigate(`/profile/${notification.sender_id._id}`);
            if (onClose) onClose();
        } else if (['campaign_rejected', 'campaign_approved', 'campaign_revision'].includes(notification.type) && notification.related_id) {
            navigate(`/campaigns/${notification.related_id}`);
            if (onClose) onClose();
        } else if (notification.type === 'request_fulfillment' && notification.related_id) {
            navigate(`/requests/${notification.related_id}`);
            if (onClose) onClose();
        } else if (notification.type === 'report_update') {
            // Maybe direct to a specific page or just close
            if (onClose) onClose();
        }
    };

    if (loading) return <div style={{ padding: 20, color: 'white', textAlign: 'center' }}>Loading...</div>;

    if (notifications.length === 0) {
        return <div style={{ padding: 20, color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>No notifications</div>;
    }

    const unreadCount = notifications.filter(n => !n.is_read).length;

    const handleMarkAllRead = async (e) => {
        e.stopPropagation();
        try {
            await fetch(`${API_BASE_URL}/api/notifications/${userId}/read-all`, { method: 'PUT' });
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            if (onMarkAllRead) onMarkAllRead();
            // Optional: close or keep open. User might want to see they are read.
            // Actually, usually it stays open or closes. Let's keep it open to show checkmarks or just remove dots.
            // if (onClose) onClose(); 
        } catch (err) {
            console.error("Error marking all read:", err);
        }
    };

    return (
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
            {unreadCount > 0 && (
                <div style={{ padding: '0 15px 10px 15px', borderBottom: '1px solid rgba(255,255,255,0.1)', textAlign: 'right' }}>
                    <span
                        onClick={handleMarkAllRead}
                        style={{ fontSize: 12, color: '#00B4D8', cursor: 'pointer', textDecoration: 'underline' }}
                    >
                        Mark all as read
                    </span>
                </div>
            )}
            {notifications.map(n => (
                <div
                    key={n._id}
                    onClick={() => handleNotificationClick(n)}
                    style={{
                        padding: 15,
                        borderBottom: '1px solid rgba(255,255,255,0.1)',
                        background: n.is_read ? 'transparent' : 'rgba(255,255,255,0.05)',
                        cursor: 'pointer',
                        display: 'flex',
                        gap: 10,
                        alignItems: 'start'
                    }}
                >
                    <div style={{
                        width: 35, height: 35, borderRadius: '50%',
                        backgroundImage: `url(${n.sender_id?.profile_picture || '/assets/default_avatar.png'})`,
                        backgroundSize: 'cover',
                        flexShrink: 0
                    }} />

                    <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', marginBottom: 4 }}>
                            <span style={{ fontWeight: 'bold' }}>{n.sender_id?.name || 'Someone'}</span> {n.message}
                        </div>
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
                            {new Date(n.date).toLocaleDateString()} • {new Date(n.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                    </div>

                    {!n.is_read && <FaCircle size={8} color="#00B4D8" style={{ marginTop: 5 }} />}
                </div>
            ))}
        </div>
    );
}
