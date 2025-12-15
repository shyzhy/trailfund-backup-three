import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';
import { FaFlag, FaTrash } from 'react-icons/fa';

export default function RequestMonitoring() {
    const [requests, setRequests] = useState([]);

    const fetchRequests = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/requests`);
            if (response.ok) {
                const data = await response.json();
                setRequests(data);
            }
        } catch (error) {
            console.error('Error fetching requests:', error);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this request? This cannot be undone.')) return;
        try {
            await fetch(`${API_BASE_URL}/api/requests/${id}`, { method: 'DELETE' });
            fetchRequests();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white' }}>Request Monitoring</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Monitor and moderate active user requests.</p>

            <div style={{ display: 'grid', gap: 20 }}>
                {requests.map(request => (
                    <div key={request._id} className="glass-card" style={{
                        background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <h3 style={{ color: 'white', marginTop: 0 }}>{request.title}</h3>
                            <button onClick={() => handleDelete(request._id)} style={{ color: '#FF6B6B', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <FaTrash /> Remove
                            </button>
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.8)' }}>{request.description}</p>
                        <small style={{ color: 'rgba(255,255,255,0.5)' }}>Requested by: {request.user_id?.name || 'Unknown'}</small>
                    </div>
                ))}
            </div>
        </div>
    );
}
