import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

export default function ReportsManagement() {
    const [reports, setReports] = useState([]);

    const fetchReports = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/reports`);
            if (response.ok) {
                const data = await response.json();
                setReports(data);
            }
        } catch (error) {
            console.error('Error fetching reports:', error);
        }
    };

    useEffect(() => {
        fetchReports();
    }, []);

    const handleAction = async (id, action) => {
        if (!window.confirm(`Take action '${action}' on this report?`)) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/reports/${id}/resolve`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action })
            });
            if (res.ok) fetchReports();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this report record?')) return;
        try {
            await fetch(`${API_BASE_URL}/api/reports/${id}`, { method: 'DELETE' });
            fetchReports();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white' }}>Reports Management</h1>
            <div style={{ display: 'grid', gap: 20 }}>
                {reports.map(report => (
                    <div key={report._id} className="glass-card" style={{
                        background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16,
                        border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                    }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                            <span style={{ fontWeight: 'bold', color: '#FF6B6B' }}>Reason: {report.reason}</span>
                            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>{new Date(report.date_reported).toLocaleDateString()}</span>
                        </div>
                        <p style={{ margin: '0 0 10px 0', color: 'rgba(255,255,255,0.9)' }}>{report.description}</p>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.6)', marginBottom: 15 }}>
                            Reported by: {report.user_id?.name || 'Unknown'} <br />
                            Target: {report.post_id ? 'Post' : report.campaign_id ? 'Campaign' : report.request_id ? 'Request' : 'Unknown'}
                        </div>

                        <div style={{ display: 'flex', gap: 10 }}>
                            <button onClick={() => handleAction(report._id, 'warned')} disabled={report.action_taken !== 'none'}
                                className="btn" style={{ padding: '6px 12px', background: '#FF9800', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: report.action_taken !== 'none' ? 0.5 : 1 }}>
                                Warn User
                            </button>
                            <button onClick={() => handleAction(report._id, 'suspended')} disabled={report.action_taken !== 'none'}
                                className="btn" style={{ padding: '6px 12px', background: '#FF6B6B', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer', opacity: report.action_taken !== 'none' ? 0.5 : 1 }}>
                                Suspend Content
                            </button>
                            <button onClick={() => handleDelete(report._id)}
                                className="btn" style={{ padding: '6px 12px', background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                                Dismiss Report
                            </button>
                        </div>
                        {report.action_taken !== 'none' && (
                            <div style={{ marginTop: 10, fontSize: 12, color: '#4CAF50' }}>
                                Action Taken: {report.action_taken}
                            </div>
                        )}
                    </div>
                ))}
                {reports.length === 0 && <p style={{ color: 'rgba(255,255,255,0.6)' }}>No active reports.</p>}
            </div>
        </div>
    );
}
