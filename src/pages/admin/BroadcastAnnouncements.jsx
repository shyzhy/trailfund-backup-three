import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { useAuth } from '../../context/AuthContext';
import { FaThumbtack, FaTrash } from 'react-icons/fa';

export default function BroadcastAnnouncements() {
    const { user } = useAuth();
    const [announcements, setAnnouncements] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const fetchAnnouncements = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/announcements`);
            if (response.ok) {
                const data = await response.json();
                setAnnouncements(data);
            }
        } catch (error) {
            console.error('Error fetching announcements:', error);
        }
    };

    useEffect(() => {
        fetchAnnouncements();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE_URL}/api/announcements`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user_id: user._id, title, content })
            });
            if (res.ok) {
                setTitle('');
                setContent('');
                fetchAnnouncements();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this announcement?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/announcements/${id}`, { method: 'DELETE' });
            fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    const handlePin = async (id) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/announcements/${id}/pin`, { method: 'PUT' });
            if (res.ok) fetchAnnouncements();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white' }}>Broadcast Announcements</h1>

            <div className="glass-card" style={{
                background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16,
                marginBottom: 30, border: '1px solid rgba(255,255,255,0.1)'
            }}>
                <h3 style={{ color: 'white', marginTop: 0 }}>Create New Announcement</h3>
                <form onSubmit={handleCreate}>
                    <input
                        type="text"
                        placeholder="Title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: 12, marginBottom: 10, borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.2)', background: 'rgba(0,0,0,0.2)', color: 'white'
                        }}
                    />
                    <textarea
                        placeholder="Content"
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        required
                        style={{
                            width: '100%', padding: 12, marginBottom: 10, borderRadius: 12,
                            border: '1px solid rgba(255,255,255,0.2)', height: 100, background: 'rgba(0,0,0,0.2)', color: 'white'
                        }}
                    />
                    <button type="submit" className="btn" style={{ padding: '10px 20px', background: '#FFD700', color: '#002840', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold' }}>
                        Post Announcement
                    </button>
                </form>
            </div>

            <h3 style={{ color: 'white' }}>Active Announcements</h3>
            <div style={{ display: 'grid', gap: 20 }}>
                {announcements.map(announcement => (
                    <div key={announcement._id} className="glass-card" style={{
                        background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white',
                        borderLeft: announcement.is_pinned ? '5px solid #FFD700' : '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h4 style={{ margin: '0 0 5px 0', display: 'flex', alignItems: 'center', color: 'white' }}>
                                    {announcement.is_pinned && <FaThumbtack style={{ marginRight: 8, color: '#FFD700' }} />}
                                    {announcement.title}
                                </h4>
                                <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: 14 }}>{announcement.content}</p>
                                <small style={{ color: 'rgba(255,255,255,0.5)' }}>{new Date(announcement.date_posted).toLocaleDateString()}</small>
                            </div>
                            <div style={{ display: 'flex', gap: 10 }}>
                                <button onClick={() => handlePin(announcement._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: announcement.is_pinned ? '#FFD700' : 'rgba(255,255,255,0.5)' }} title={announcement.is_pinned ? "Unpin" : "Pin"}>
                                    <FaThumbtack />
                                </button>
                                <button onClick={() => handleDelete(announcement._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#FF6B6B' }} title="Delete">
                                    <FaTrash />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
