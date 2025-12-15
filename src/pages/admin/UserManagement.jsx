import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/users/admin/all`);
            if (response.ok) {
                const data = await response.json();
                setUsers(data);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleBan = async (id) => {
        if (!window.confirm('Toggle ban status for this user?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${id}/ban`, { method: 'POST' });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleVerifyUSTEP = async (id) => {
        if (!window.confirm('Manually verify USTEP link for this user?')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/users/${id}/verify-ustep`, { method: 'POST' });
            if (res.ok) fetchUsers();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white' }}>User Management</h1>

            <div className="glass-card" style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.05)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.1)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', color: 'white' }}>
                    <thead>
                        <tr style={{ background: 'rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                            <th style={{ padding: 15 }}>User</th>
                            <th style={{ padding: 15 }}>Role</th>
                            <th style={{ padding: 15 }}>Status</th>
                            <th style={{ padding: 15 }}>USTEP</th>
                            <th style={{ padding: 15 }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: 15 }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <div style={{
                                            width: 32, height: 32, borderRadius: '50%', background: '#333', marginRight: 10,
                                            backgroundImage: `url(${user.profile_picture || 'https://via.placeholder.com/32'})`,
                                            backgroundSize: 'cover', border: '1px solid rgba(255,255,255,0.2)'
                                        }} />
                                        <div>
                                            <div style={{ fontWeight: 'bold' }}>{user.name}</div>
                                            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>@{user.username}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: 15 }}>
                                    <span style={{
                                        padding: '2px 8px', borderRadius: 12, fontSize: 12,
                                        background: user.role === 'admin' || user.role === 'faculty' ? 'rgba(255, 215, 0, 0.2)' : 'rgba(255,255,255,0.1)',
                                        color: user.role === 'admin' || user.role === 'faculty' ? '#FFD700' : 'white'
                                    }}>
                                        {user.role}
                                    </span>
                                </td>
                                <td style={{ padding: 15, color: user.status === 'banned' ? '#FF6B6B' : '#4CAF50' }}>{user.status}</td>
                                <td style={{ padding: 15 }}>{user.ustep_linked ? 'Linked' : 'Not Linked'}</td>
                                <td style={{ padding: 15 }}>
                                    <button onClick={() => handleBan(user._id)} style={{ marginRight: 10, cursor: 'pointer', color: user.status === 'banned' ? '#4CAF50' : '#FF6B6B', background: 'none', border: 'none', textDecoration: 'underline' }}>
                                        {user.status === 'banned' ? 'Unban' : 'Ban'}
                                    </button>
                                    {!user.ustep_linked && (
                                        <button onClick={() => handleVerifyUSTEP(user._id)} style={{ cursor: 'pointer', color: '#00B4D8', background: 'none', border: 'none', textDecoration: 'underline' }}>
                                            Verify USTEP
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
