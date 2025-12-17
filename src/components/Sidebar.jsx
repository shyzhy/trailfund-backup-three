import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaUsers, FaUserFriends, FaHandHoldingHeart, FaBoxOpen, FaCog, FaSignOutAlt, FaTimes, FaBell, FaCompass } from 'react-icons/fa';
import { useNotification } from '../context/NotificationContext';

export default function Sidebar({ isOpen, onClose }) {
    const navigate = useNavigate();
    const { unreadCount } = useNotification();

    // Remove local fetch logic since context handles it

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/login');
    };

    const user = JSON.parse(localStorage.getItem('user')) || {};
    // ... rest of component

    const menuItems = [
        { icon: <FaUser />, label: 'User Profile', path: '/profile' },
        { icon: <FaBell />, label: 'Notifications', path: '/notifications', isNotification: true },
        // User asked for "another notification button". 
        // Since NotificationList is usually a popup, maybe clicking this 
        // should toggle the popup or go to a dedicated page?
        // Existing Home.jsx toggles a list. 
        // Let's assume for now it might just do nothing or close sidebar and show notifications on Home? 
        // Actually, usually sidebars navigate. 
        // But the request says "add another notification button... same instructions".
        // If "Notifications" is a page, we need a route. 
        // But we don't have a notification page.
        // Let's make it navigate to /home with some state or just dummy for now?
        // Or maybe we can trigger the dropdown?
        // Let's stick to adding the BUTTON with BADGE first.
        // I'll make it path '#' for now, or '/home' and pass state?
        // The user said "add another notification button", implies functionality.
        // In `Home.jsx`, the bell toggles `showNotifications`. 
        // I can't easily toggle state in Home from Sidebar without context.
        // I will just link to `#` for now but show the Badge as requested.
        { icon: <FaUsers />, label: 'Community', path: '/community' },
        { icon: <FaUserFriends />, label: 'Friends List', path: '/friends' },
        { icon: <FaCompass />, label: 'Explore', path: '/explore' },
        { icon: <FaBoxOpen />, label: 'Requests', path: '/requests' },
        { icon: <FaCog />, label: 'Settings', path: '/settings' },
    ];

    return (
        <>
            {/* Overlay */}
            <div
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    zIndex: 999,
                    opacity: isOpen ? 1 : 0,
                    pointerEvents: isOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
                onClick={onClose}
            />

            {/* Sidebar */}
            <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                width: 280,
                background: 'rgba(0, 59, 92, 0.95)', // Dark teal with slight transparency
                backdropFilter: 'blur(10px)',
                zIndex: 1000,
                transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '4px 0 15px rgba(0,0,0,0.3)'
            }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40, position: 'relative' }}>
                    <div
                        onClick={() => {
                            navigate('/profile');
                            onClose();
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    >
                        <div style={{ width: 40, height: 40, borderRadius: '50%', overflow: 'hidden', border: '2px solid white' }}>
                            <img src={user.profile_picture || "/assets/giselle.jpg"} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                        <div>
                            <div style={{ color: 'white', fontWeight: 'bold' }}>{user.name || user.username || 'Guest'}</div>
                            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>View Profile</div>
                        </div>
                    </div>

                    <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <FaTimes size={24} />
                    </button>
                </div>

                {/* Menu Items */}
                <div>
                    {menuItems.map((item, index) => (
                        <Link
                            key={index}
                            to={item.path}
                            onClick={onClose}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 15,
                                padding: '15px 10px',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: 16,
                                borderBottom: '1px solid rgba(255,255,255,0.05)',
                                position: 'relative'
                            }}
                        >
                            <span style={{ color: 'var(--accent-color)', fontSize: 20 }}>{item.icon}</span>
                            {item.label}
                            {item.isNotification && unreadCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    right: 10,
                                    background: '#FF6B6B',
                                    color: 'white',
                                    fontSize: 12,
                                    fontWeight: 'bold',
                                    padding: '2px 8px',
                                    borderRadius: 10,
                                }}>
                                    {unreadCount}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                {/* Logout */}
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 15,
                        padding: '15px 10px',
                        background: 'rgba(255, 107, 107, 0.1)',
                        border: 'none',
                        borderRadius: 12,
                        color: '#FF6B6B',
                        fontSize: 16,
                        cursor: 'pointer',
                        marginTop: 20
                    }}
                >
                    <FaSignOutAlt />
                    Log Out
                </button>

            </div>
        </>
    );
}
