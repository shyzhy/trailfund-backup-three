import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheckCircle, FaExclamationTriangle, FaUsers, FaClipboardList, FaBuilding, FaBullhorn } from 'react-icons/fa';

export default function AdminDashboard() {
    const navigate = useNavigate();

    const adminTools = [
        { id: 'approvals', icon: <FaCheckCircle />, label: 'Campaign Approvals', color: '#28a745', count: 3 },
        { id: 'reports', icon: <FaExclamationTriangle />, label: 'Manage Reports', color: '#dc3545', count: 5 },
        { id: 'users', icon: <FaUsers />, label: 'Manage Users', color: '#17a2b8', count: null },
        { id: 'requests', icon: <FaClipboardList />, label: 'Manage Requests', color: '#ffc107', count: 12 },
        { id: 'orgs', icon: <FaBuilding />, label: 'Org Verification', color: '#6610f2', count: 1 },
        { id: 'broadcasts', icon: <FaBullhorn />, label: 'Broadcasts', color: '#fd7e14', count: null },
    ];

    return (
        <div style={{ padding: 20, paddingBottom: 100, minHeight: '100vh', color: 'white' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 20 }}>
                <FaArrowLeft size={20} onClick={() => navigate(-1)} style={{ cursor: 'pointer' }} />
                <h2 style={{ margin: 0, fontSize: 20 }}>Admin Dashboard</h2>
            </div>

            {/* Welcome Banner */}
            <div className="glass-card" style={{ padding: 20, marginBottom: 20, background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)' }}>
                <h3 style={{ margin: '0 0 5px 0' }}>Welcome, Admin</h3>
                <p style={{ margin: 0, fontSize: 14, color: 'rgba(255,255,255,0.7)' }}>Here's what's happening today.</p>
            </div>

            {/* Tools Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 15 }}>
                {adminTools.map(tool => (
                    <div key={tool.id} className="glass-card" style={{ padding: 20, display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', gap: 10, cursor: 'pointer' }}>
                        <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: '50%',
                            background: `${tool.color}33`, // 20% opacity
                            color: tool.color,
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            fontSize: 24
                        }}>
                            {tool.icon}
                        </div>
                        <div style={{ fontWeight: 'bold', fontSize: 14 }}>{tool.label}</div>
                        {tool.count !== null && (
                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>
                                {tool.count} Pending
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
