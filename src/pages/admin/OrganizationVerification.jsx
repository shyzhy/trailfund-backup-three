import React, { useEffect, useState } from 'react';
import { API_BASE_URL } from '../../config';

export default function OrganizationVerification() {
    const [orgs, setOrgs] = useState([]);

    const fetchOrgs = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/api/organizations/admin/pending`);
            if (response.ok) {
                const data = await response.json();
                setOrgs(data);
            }
        } catch (error) {
            console.error('Error fetching organizations:', error);
        }
    };

    useEffect(() => {
        fetchOrgs();
    }, []);

    const handleApprove = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/api/organizations/${id}/approve`, { method: 'POST' });
            fetchOrgs();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div>
            <h1 style={{ color: 'white' }}>Organization Verification</h1>
            <p style={{ color: 'rgba(255,255,255,0.6)' }}>Approve or reject student organizations and teams.</p>

            {orgs.length === 0 ? <p style={{ color: 'rgba(255,255,255,0.6)' }}>No pending organizations.</p> : (
                <div style={{ display: 'grid', gap: 20 }}>
                    {orgs.map(org => (
                        <div key={org._id} className="glass-card" style={{
                            background: 'rgba(255,255,255,0.05)', padding: 20, borderRadius: 16,
                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                            border: '1px solid rgba(255,255,255,0.1)', color: 'white'
                        }}>
                            <div>
                                <h3 style={{ color: 'white', marginTop: 0 }}>{org.name}</h3>
                                <p style={{ color: 'rgba(255,255,255,0.8)' }}>{org.description}</p>
                                <small style={{ color: 'rgba(255,255,255,0.5)' }}>Submitted by: {org.representative_user_id?.name || org.user_id?.name}</small>
                            </div>
                            <button onClick={() => handleApprove(org._id)} className="btn" style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
                                Approve
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
