import React, { useState } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaChartLine, FaClipboardList, FaUsers, FaExclamationTriangle, FaBullhorn, FaSignOutAlt, FaBuilding, FaBars, FaTimes, FaBoxOpen } from 'react-icons/fa';

export default function AdminLayout() {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: <FaChartLine /> },
        { path: '/admin/campaigns', label: 'Campaigns', icon: <FaClipboardList /> },
        { path: '/admin/users', label: 'Users', icon: <FaUsers /> },
        { path: '/admin/reports', label: 'Reports', icon: <FaExclamationTriangle /> },
        { path: '/admin/announcements', label: 'Announcements', icon: <FaBullhorn /> },
        { path: '/admin/requests', label: 'Requests', icon: <FaBoxOpen /> },
        { path: '/admin/organizations', label: 'Organizations', icon: <FaBuilding /> },
    ];

    return (
        <div style={{ minHeight: '100vh', background: 'var(--primary-bg)', color: 'white' }}>

            {/* Mobile/Top Header with Toggle */}
            <div style={{
                padding: '20px 30px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottom: '1px solid rgba(255,255,255,0.1)'
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                    <button onClick={() => setIsSidebarOpen(true)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer', padding: 0, display: 'flex' }}>
                        <FaBars size={24} />
                    </button>
                    <div style={{ fontSize: 20, fontWeight: 'bold', color: '#FFD700' }}>TrailFund Admin</div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div
                        onClick={() => navigate('/admin/profile')}
                        style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: '#333',
                            backgroundImage: `url(${user?.profile_picture || 'https://via.placeholder.com/40'})`,
                            backgroundSize: 'cover',
                            border: '2px solid rgba(255,255,255,0.2)',
                            cursor: 'pointer'
                        }}
                    />
                </div>
            </div>

            {/* Main Content Area - Full Width */}
            <main style={{ padding: 30, maxWidth: 1200, margin: '0 auto' }}>
                <Outlet />
            </main>

            {/* Sidebar Overlay (Tap to close) */}
            <div
                style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(0,0,0,0.5)', zIndex: 999,
                    opacity: isSidebarOpen ? 1 : 0,
                    pointerEvents: isSidebarOpen ? 'auto' : 'none',
                    transition: 'opacity 0.3s ease'
                }}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Sliding Sidebar */}
            <aside style={{
                position: 'fixed', top: 0, left: 0, bottom: 0,
                width: 280,
                background: 'var(--secondary-bg)',
                color: 'white',
                display: 'flex',
                flexDirection: 'column',
                padding: 20,
                zIndex: 1000,
                transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
                transition: 'transform 0.3s ease',
                boxShadow: '4px 0 15px rgba(0,0,0,0.3)'
            }}>
                {/* Sidebar Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
                    <div
                        onClick={() => {
                            navigate('/admin/profile');
                            setIsSidebarOpen(false);
                        }}
                        style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}
                    >
                        <div style={{
                            width: 40, height: 40, borderRadius: '50%',
                            background: '#333',
                            backgroundImage: `url(${user?.profile_picture || 'https://via.placeholder.com/40'})`,
                            backgroundSize: 'cover',
                            border: '2px solid rgba(255,255,255,0.2)'
                        }} />
                        <div>
                            <div style={{ fontWeight: 'bold', fontSize: 14 }}>{user?.name}</div>
                            <div style={{ fontSize: 12, opacity: 0.7 }}>{user?.role === 'faculty' ? 'Faculty Admin' : 'Admin'}</div>
                        </div>
                    </div>
                    <button onClick={() => setIsSidebarOpen(false)} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}>
                        <FaTimes size={24} />
                    </button>
                </div>

                <nav style={{ flex: 1 }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => (
                            <li key={item.path} style={{ marginBottom: 10 }}>
                                <Link
                                    to={item.path}
                                    onClick={() => setIsSidebarOpen(false)}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        padding: '12px 15px',
                                        color: isActive(item.path) ? '#002840' : 'rgba(255,255,255,0.8)',
                                        background: isActive(item.path) ? '#FFD700' : 'transparent',
                                        borderRadius: 16,
                                        textDecoration: 'none',
                                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                                        transition: 'all 0.2s',
                                        fontSize: 16
                                    }}
                                >
                                    <span style={{ marginRight: 10, fontSize: 18 }}>{item.icon}</span>
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
                    <button
                        onClick={handleLogout}
                        style={{
                            width: '100%',
                            padding: 10,
                            background: 'rgba(255, 107, 107, 0.2)',
                            color: '#FF6B6B',
                            border: '1px solid #FF6B6B',
                            borderRadius: 16,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        <FaSignOutAlt style={{ marginRight: 8 }} />
                        Logout
                    </button>
                </div>
            </aside>
        </div>
    );
}
